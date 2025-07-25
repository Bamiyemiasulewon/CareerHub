"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator"
import { resetPasswordSchema, type ResetPasswordData } from "@/lib/validation"
import { AUTH_ERRORS } from "@/lib/auth-utils"
import { cn } from "@/lib/auth-utils"

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token || "",
    },
  })

  const passwordValue = watch("password")

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        return
      }

      try {
        // Mock token validation - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setTokenValid(true)
      } catch (error) {
        setTokenValid(false)
      }
    }

    validateToken()
  }, [token])

  const onSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true)

    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSuccess(true)
    } catch (error: any) {
      setError("root", {
        message: error.message || AUTH_ERRORS.SERVER_ERROR,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <AuthLayout title="Validating reset link...">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600">Please wait while we validate your reset link...</p>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <AuthLayout title="Invalid reset link" subtitle="This link has expired or is invalid">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Link expired or invalid</h2>
              <p className="text-gray-600 mb-4">This password reset link has expired or is no longer valid.</p>
              <p className="text-sm text-gray-500">
                Password reset links expire after 15 minutes for security reasons.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/forgot-password">Request new reset link</Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/auth/login">Back to sign in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <AuthLayout title="Password reset successful" subtitle="Your password has been updated">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Password updated!</h2>
              <p className="text-gray-600 mb-4">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
            </div>

            <Button asChild className="w-full">
              <Link href="/auth/login">Continue to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your new password below">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Global Error */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* Hidden token field */}
            <input type="hidden" {...register("token")} />

            {/* New Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={cn("pl-10 pr-10", errors.password && "border-red-500 focus:border-red-500")}
                  placeholder="Enter your new password"
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
              <PasswordStrengthIndicator password={passwordValue} className="mt-2" />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={cn("pl-10 pr-10", errors.confirmPassword && "border-red-500 focus:border-red-500")}
                  placeholder="Confirm your new password"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Password Security Tips:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Use at least 8 characters with mixed case letters</li>
                <li>• Include numbers and special characters</li>
                <li>• Avoid common words or personal information</li>
                <li>• Don't reuse passwords from other accounts</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating password..." : "Update password"}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-primary hover:underline">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
