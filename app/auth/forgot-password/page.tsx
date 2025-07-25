"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { forgotPasswordSchema, type ForgotPasswordData, isEmail, formatPhoneNumber } from "@/lib/validation"
import { checkRateLimit, AUTH_ERRORS } from "@/lib/auth-utils"
import { cn } from "@/lib/auth-utils"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [inputType, setInputType] = useState<"email" | "phone">("email")
  const [submittedIdentifier, setSubmittedIdentifier] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
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

  const onSubmit = async (data: ForgotPasswordData) => {
    // Check rate limiting
    if (!checkRateLimit(data.identifier)) {
      setError("root", { message: AUTH_ERRORS.RATE_LIMITED })
      return
    }

    setIsLoading(true)

    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmittedIdentifier(data.identifier)
      setIsSuccess(true)
    } catch (error: any) {
      setError("root", {
        message: error.message || AUTH_ERRORS.SERVER_ERROR,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resendReset = async () => {
    setIsLoading(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Show success message or update UI
    } catch (error) {
      setError("root", { message: AUTH_ERRORS.SERVER_ERROR })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="We've sent password reset instructions"
        showBackButton
        backHref="/auth/login"
      >
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Reset link sent!</h2>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to{" "}
                <span className="font-medium text-gray-900">{submittedIdentifier}</span>
              </p>
              <p className="text-sm text-gray-500">The link will expire in 15 minutes for security reasons.</p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to sign in
                </Link>
              </Button>

              <Button variant="outline" className="w-full bg-transparent" onClick={resendReset} disabled={isLoading}>
                {isLoading ? "Sending..." : "Resend reset link"}
              </Button>
            </div>

            <div className="text-xs text-gray-500 space-y-2">
              <p>Didn't receive the email? Check your spam folder.</p>
              <p>
                Still having trouble?{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="No worries, we'll send you reset instructions"
      showBackButton
      backHref="/auth/login"
    >
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
              <p className="mt-2 text-xs text-gray-500">
                We'll send reset instructions to this {inputType === "email" ? "email address" : "phone number"}
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>

          {/* Alternative Options */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
