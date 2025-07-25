"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, Chrome, Phone, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { api } from "@/lib/api"
import { AuthLayout } from "@/components/auth/auth-layout"
import { loginSchema, type LoginData, isEmail, formatPhoneNumber } from "@/lib/validation"
import { checkRateLimit, getRemainingCooldown, AUTH_ERRORS } from "@/lib/auth-utils"
import { cn } from "@/lib/auth-utils"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inputType, setInputType] = useState<"email" | "phone">("email")
  const [rateLimited, setRateLimited] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)

  const { login } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  })

  const identifierValue = watch("identifier")

  // Auto-detect input type and format
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (isEmail(value)) {
      setInputType("email")
      setValue("identifier", value)
    } else {
      setInputType("phone")
      setValue("identifier", formatPhoneNumber(value))
    }
  }

  const onSubmit = async (data: LoginData) => {
    // Check rate limiting
    if (!checkRateLimit(data.identifier)) {
      setRateLimited(true)
      const remaining = getRemainingCooldown(data.identifier)
      setCooldownTime(Math.ceil(remaining / 1000 / 60))
      setError("root", { message: AUTH_ERRORS.RATE_LIMITED })
      return
    }

    setIsLoading(true)
    setRateLimited(false)

    try {
      const response = await api.auth.login(data.identifier, data.password)
      login(response.user)
      router.push("/dashboard")
    } catch (error: any) {
      if (error.message === "ACCOUNT_NOT_VERIFIED") {
        router.push(`/auth/verify?identifier=${encodeURIComponent(data.identifier)}`)
      } else {
        setError("root", {
          message: error.message || AUTH_ERRORS.INVALID_CREDENTIALS,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      // Mock social login - replace with actual implementation
      const mockUser = {
        id: "1",
        email: "user@example.com",
        name: "John Doe",
        role: "job-seeker" as const,
        avatar: "/placeholder.svg?height=40&width=40",
      }
      login(mockUser)
      router.push("/dashboard")
    } catch (error) {
      setError("root", { message: AUTH_ERRORS.SERVER_ERROR })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        <>
          Don't have an account?{" "}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            Sign up for free
          </Link>
        </>
      }
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          {/* Social Login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-50"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <Chrome className="h-4 w-4 mr-2" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-50"
              onClick={() => handleSocialLogin("linkedin")}
              disabled={isLoading}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Continue with LinkedIn
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Global Error */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* Rate Limit Warning */}
            {rateLimited && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md text-sm">
                Too many failed attempts. Please try again in {cooldownTime} minutes.
              </div>
            )}

            {/* Email/Phone Input */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                Email or Phone
              </label>
              <div className="relative">
                {inputType === "email" ? (
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                ) : (
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                )}
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  className={cn("pl-10", errors.identifier && "border-red-500 focus:border-red-500")}
                  placeholder="Enter your email or phone"
                  {...register("identifier")}
                  onChange={handleIdentifierChange}
                  disabled={isLoading}
                  aria-describedby={errors.identifier ? "identifier-error" : undefined}
                />
              </div>
              {errors.identifier && (
                <p id="identifier-error" className="mt-1 text-sm text-red-600">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={cn("pl-10 pr-10", errors.password && "border-red-500 focus:border-red-500")}
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isLoading}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" {...register("rememberMe")} disabled={isLoading} />
                <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline focus:outline-none focus:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading || rateLimited}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Terms */}
      <p className="text-center text-xs text-gray-600 mt-6">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </AuthLayout>
  )
}
