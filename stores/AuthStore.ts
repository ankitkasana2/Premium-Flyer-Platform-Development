// stores/AuthStore.ts
import { makeAutoObservable, runInAction, autorun } from "mobx"
import { getApiUrl } from "@/config/api"
import { Amplify } from 'aws-amplify'
import { Hub } from '@aws-amplify/core'
import {
  signIn as awsSignIn,
  signUp as awsSignUp,
  signOut as awsSignOut,
  getCurrentUser,
  fetchAuthSession,
  resetPassword as awsResetPassword,
  confirmResetPassword as awsConfirmResetPassword,
  type SignInInput,
  type SignUpInput,
  type ResetPasswordInput,
  type ConfirmResetPasswordInput,
  type SignInWithRedirectInput,
  type AuthUser as AWSAuthUser
} from 'aws-amplify/auth'
import { awsConfig } from "@/config/aws-config"

// Configure AWS Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: awsConfig.userPoolId,
      userPoolClientId: awsConfig.userPoolWebClientId,
      loginWith: {
        oauth: {
          ...awsConfig.oauth,
          redirectSignIn: [awsConfig.oauth.redirectSignIn],
          redirectSignOut: [awsConfig.oauth.redirectSignOut],
          scopes: awsConfig.oauth.scopes
        },
      },
    },
  },
}

Amplify.configure(amplifyConfig, { ssr: true })

export interface AuthUser {
  id: string
  name: string
  email: string
  provider?: string
  phone?: string
  favorites?: string[]
  orders?: string[]
  createdAt?: string
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  fullname: string
  email: string
  password: string
}

const STORAGE_KEY = "grodify_session"

export class AuthStore {
  user: AuthUser | null = null
  token: string | null = null
  loading = false
  error: string | null = null
  authModal = false
  private authListener: any = null

  constructor() {
    makeAutoObservable(this)
    this.initializeAuthListener()
  }

  private initializeAuthListener = () => {
    // Clean up any existing listener
    if (this.authListener) {
      this.authListener()
    }

    // Define the Hub payload type for auth events
    type AuthHubPayload = {
      event: 'signedIn' | 'signedOut' | 'signInWithRedirect' | 'signInWithRedirect_failure' | 'tokenRefresh' | 'tokenRefresh_failure' | string;
      data?: any;
      message?: string;
    };

    // Set up new auth state listener with proper typing
    this.authListener = Hub.listen('auth', async ({ payload }: { payload: AuthHubPayload }) => {
      if (!payload) return;
      
      switch (payload.event) {
        case 'signedIn':
          await this.updateUserFromAmplify()
          break
        case 'signedOut':
          this.clearUser()
          break
        case 'signInWithRedirect':
        case 'signInWithRedirect_failure':
          // Handle redirect sign-in success/failure
          if (payload.event === 'signInWithRedirect_failure') {
            console.error('Sign in with redirect failed:', payload.message || 'Unknown error')
          }
          break
        case 'tokenRefresh':
        case 'tokenRefresh_failure':
          // Handle token refresh events if needed
          break
        default:
          // Handle any other auth events
          break
      }
    })
  }

  hydrate = () => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      runInAction(() => {
        this.user = parsed.user ?? null
        this.token = parsed.token ?? null
      })
    } catch (error) {
      console.error("Failed to hydrate auth session", error)
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }

  private persistSession = () => {
    if (typeof window === "undefined") return
    const payload = JSON.stringify({ user: this.user, token: this.token })
    window.localStorage.setItem(STORAGE_KEY, payload)
  }

  private clearSessionStorage = () => {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(STORAGE_KEY)
  }

  private normalizeUser = (payload: any): AuthUser => {
    const name = payload?.fullname ?? payload?.name ?? payload?.email ?? "User"
    return {
      id: String(payload?.id ?? payload?.user_id ?? payload?.uuid ?? ""),
      name,
      email: payload?.email ?? "",
      phone: payload?.phone ?? payload?.mobile ?? "",
      provider: payload?.provider ?? "email",
      favorites: payload?.favorites ?? [],
      orders: payload?.orders ?? [],
      createdAt: payload?.created_at ?? payload?.createdAt ?? new Date().toISOString(),
    }
  }

  private setSession = (user: AuthUser | null, token: string | null = null) => {
    runInAction(() => {
      this.user = user
      this.token = token
      if (user) {
        this.persistSession()
      }
    })
  }

  private clearUser = () => {
    this.setSession(null, null)
    this.clearSessionStorage()
  }

  get authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {}
  }

  get isLoggedIn() {
    return Boolean(this.user)
  }

  login = async ({ email, password }: LoginPayload) => {
    this.loading = true
    this.error = null
    try {
      const signInInput: SignInInput = {
        username: email,
        password,
      }
      
      const { isSignedIn } = await awsSignIn(signInInput)
      
      if (!isSignedIn) {
        throw new Error('Additional authentication steps required')
      }
      
      return await this.updateUserFromAmplify()
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed"
      runInAction(() => {
        this.error = errorMessage
      })
      throw new Error(errorMessage)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  private updateUserFromAmplify = async () => {
    try {
      const user = await getCurrentUser()
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString() || ''
      
      const normalized = this.normalizeUser({
        id: user.userId,
        email: user.signInDetails?.loginId || '',
        name: user.username || user.userId,
      })

      runInAction(() => {
        this.setSession(normalized, token)
        this.authModal = false
      })

      return normalized
    } catch (error) {
      runInAction(() => {
        this.clearUser()
      })
      return null
    }
  }

  register = async ({ fullname, email, password }: RegisterPayload) => {
    this.loading = true
    this.error = null
    try {
      const signUpInput: SignUpInput = {
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: fullname,
            // Add any additional attributes as needed
          },
        },
      }
      
      const { isSignUpComplete, userId, nextStep } = await awsSignUp(signUpInput)
      
      // Return a consistent response format
      return {
        success: isSignUpComplete,
        user: {
          id: userId,
          email,
          name: fullname,
        },
        message: 'User registration successful. Please check your email to confirm your account.'
      }
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.message || "Registration failed"
      })
      throw error
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  logout = async () => {
    try {
      await awsSignOut()
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      this.clearUser()
    }
  }

  updateProfile = async (payload: Partial<AuthUser>) => {
    if (!this.user) return
    const updated = { ...this.user, ...payload }
    this.setSession(updated, this.token)
  }

  signInWithProvider = async (provider: "google" | "apple") => {
    try {
      // This will redirect to the Cognito Hosted UI
      const signInInput: SignInWithRedirectInput = {
        provider: provider.toLowerCase() as 'Google' | 'Apple',
      }
      await awsSignIn(signInInput)
    } catch (error) {
      console.error('Error signing in with provider:', error)
      throw new Error(`Failed to sign in with ${provider}`)
    }
  }

  sendOTP = async (email: string) => {
    try {
      const resetPasswordInput: ResetPasswordInput = { username: email }
      const result = await awsResetPassword(resetPasswordInput)
      
      // In v6, resetPassword doesn't return a boolean, so we assume success if no error is thrown
      return { 
        success: true, 
        message: 'Password reset code sent to your email.',
        nextStep: result.nextStep
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      throw new Error('Failed to send password reset code. Please try again.')
    }
  }

  verifyOTP = async (email: string, code: string, newPassword: string) => {
    try {
      const confirmResetPasswordInput: ConfirmResetPasswordInput = {
        username: email,
        confirmationCode: code,
        newPassword,
      }
      
      // In v6, confirmResetPassword doesn't return a boolean
      await awsConfirmResetPassword(confirmResetPasswordInput)
      
      return { 
        success: true, 
        message: 'Password reset successful. You can now sign in with your new password.' 
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      throw new Error('Failed to reset password. The code may be invalid or expired.')
    }
  }

  handleAuthModal = () => {
    this.authModal = !this.authModal
  }
}
