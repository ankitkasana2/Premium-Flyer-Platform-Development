// stores/AuthStore.ts
import { makeAutoObservable, runInAction } from "mobx"
import { getApiUrl } from "@/config/api"

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

  constructor() {
    makeAutoObservable(this)
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

  private setSession = (user: AuthUser, token?: string | null) => {
    this.user = user
    if (token !== undefined) {
      this.token = token
    }
    this.persistSession()
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
      const response = await fetch(getApiUrl("/api/web/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to sign in")
      }

      const userPayload = data?.user ?? data?.data ?? data
      const token = data?.token ?? data?.data?.token ?? null
      const normalized = this.normalizeUser(userPayload)

      runInAction(() => {
        this.setSession(normalized, token)
        this.authModal = false
      })

      return normalized
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.message || "Login failed"
      })
      throw error
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  register = async ({ fullname, email, password }: RegisterPayload) => {
    this.loading = true
    this.error = null
    try {
      const response = await fetch(getApiUrl("/api/web/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, email, password }),
      })

      const data = await response.json()
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to sign up")
      }

      return data
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

  logout = () => {
    this.user = null
    this.token = null
    this.clearSessionStorage()
  }

  updateProfile = async (payload: Partial<AuthUser>) => {
    if (!this.user) return
    const updated = { ...this.user, ...payload }
    this.setSession(updated, this.token)
  }

  signInWithProvider = async (_provider: "google" | "apple") => {
    throw new Error("Social sign-in is not available yet.")
  }

  sendOTP = async (_email: string) => {
    return Promise.resolve()
  }

  verifyOTP = async (_email: string, _otp: string) => {
    return Promise.resolve()
  }

  handleAuthModal = () => {
    this.authModal = !this.authModal
  }
}
