"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import { Eye, EyeOff, Mail, Lock, User, Chrome, Apple } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "signin" | "signup"
}

export function AuthModal({ isOpen, onClose, defaultMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "otp">(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    otp: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const { signIn, signUp, signInWithGoogle, signInWithApple, sendOTP, verifyOTP } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "signin") {
        await signIn(formData.email, formData.password)
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
        onClose()
      } else if (mode === "signup") {
        await signUp(formData.email, formData.password, formData.name)
        toast({
          title: "Account created!",
          description: "Please check your email for verification.",
        })
        setMode("otp")
      } else if (mode === "otp") {
        await verifyOTP(formData.email, formData.otp)
        toast({
          title: "Email verified!",
          description: "Your account has been activated.",
        })
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    setIsLoading(true)
    try {
      if (provider === "google") {
        await signInWithGoogle()
      } else {
        await signInWithApple()
      }
      toast({
        title: "Welcome!",
        description: `Successfully signed in with ${provider}.`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Social sign-in failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOTP = async () => {
    if (!formData.email) return

    setIsLoading(true)
    try {
      await sendOTP(formData.email)
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-card-foreground">
            {mode === "signin" && "Sign In to Grodify"}
            {mode === "signup" && "Create Your Account"}
            {mode === "otp" && "Verify Your Email"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {mode !== "otp" && (
            <>
              {/* Social Sign In */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleSocialSignIn("apple")}
                  disabled={isLoading}
                >
                  <Apple className="w-4 h-4 mr-2" />
                  Continue with Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            </>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 bg-input border-border"
                    required
                  />
                </div>
              </div>
            )}

            {mode !== "otp" && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-input border-border"
                    required
                  />
                </div>
              </div>
            )}

            {mode !== "otp" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-input border-border"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {mode === "otp" && (
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    className="bg-input border-border"
                    maxLength={6}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="bg-transparent"
                  >
                    Resend
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">We sent a verification code to {formData.email}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : mode === "signin"
                  ? "Sign In"
                  : mode === "signup"
                    ? "Create Account"
                    : "Verify Email"}
            </Button>
          </form>

          {mode !== "otp" && (
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              </span>
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </Button>
            </div>
          )}

          {mode === "signin" && (
            <div className="text-center">
              <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground">
                Forgot your password?
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
