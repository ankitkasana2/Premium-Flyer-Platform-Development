"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import { Eye, EyeOff, Mail, Lock, User, Chrome, Apple } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// ⚡ Import Shadcn OTP components
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: string
}

// 🔹 Simple OTP generator
function generateOTP(length = 6) {
  let otp = ""
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10)
  }
  return otp
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    otp: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [generatedOTP, setGeneratedOTP] = useState("")

  const { signIn, signUp, signInWithGoogle, signInWithApple } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 🔹 Sign In → generate OTP first
      if (mode === "signin") {
        if (!formData.email) {
          toast({
            title: "Email required",
            description: "Please enter your email before signing in.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // simulate sending OTP
        const otp = generateOTP()
        setGeneratedOTP(otp)
        console.log("Generated OTP:", otp)

        toast({
          title: "OTP Sent",
          description: `A verification code has been sent to ${formData.email}`,
        })

        setMode("otp") // show OTP screen
        setIsLoading(false)
        return
      }

      // 🔹 OTP Verification
      if (mode === "otp") {
       
          await signIn(formData.email, formData.password)
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          })
          onClose()
        setIsLoading(false)
        return
      }

      // 🔹 Sign Up
      if (mode === "signup") {
        await signUp(formData.email, formData.password, formData.name)
        toast({
          title: "Account created!",
          description: "Please check your email for verification.",
        })
        setMode("otp")
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
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
        description:
          error instanceof Error
            ? error.message
            : "Social sign-in failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = () => {
    const otp = generateOTP()
    setGeneratedOTP(otp)
    console.log("Resent OTP:", otp)
    toast({
      title: "OTP Resent",
      description: `A new code has been sent to ${formData.email}`,
    })
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
          {/* 🔹 OTP Screen */}
          {mode === "otp" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Enter the 6-digit code sent to <b>{formData.email}</b>
              </p>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={formData.otp}
                  onChange={(value) =>
                    setFormData({ ...formData, otp: value })
                  }
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={formData.otp.length < 6 || isLoading}
              >
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>
            </form>
          ) : (
            <>
              {/* 🔹 Social Sign In */}
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
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* 🔹 Email/Password Form */}
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
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="pl-10 bg-input border-border"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-10 bg-input border-border"
                      required
                    />
                  </div>
                </div>

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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Loading..."
                    : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {mode === "signin"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={() =>
                    setMode(mode === "signin" ? "signup" : "signin")
                  }
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </Button>
              </div>

              {mode === "signin" && (
                <div className="text-center">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-muted-foreground"
                  >
                    Forgot your password?
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
