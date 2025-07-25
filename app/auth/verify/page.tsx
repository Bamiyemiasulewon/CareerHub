"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Mail, Phone, RefreshCw } from "lucide-react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { OtpInput } from "@/components/auth/otp-input"
import { otpVerificationSchema, type OtpVerificationData, isEmail } from "@/lib/validation"
import { checkRateLimit, AUTH_ERRORS, generateToken } from "@/lib/auth-utils"
import { useAuthStore } from "@/lib/store"

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("email")

  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuthStore()

  const identifier = searchParams.get("identifier") || ""
  const type = searchParams.get("type") || "registration" // registration, login, password-reset
  const token = searchParams.get("token") || generateToken()

  const {
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<OtpVerificationData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: "",
      token,
    },
  })

  const otpValue = watch("otp")

  // Determine verification method
  useEffect(() => {
    if (identifier) {
      setVerificationMethod(isEmail(identifier) ? "email" : "phone")
    }
  }, [identifier])

  // Start resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const onSubmit = async (data: OtpVerificationData) => {
    // Check rate limiting
    if (!checkRateLimit(`verify_${identifier}`)) {
      setError("root", { message: AUTH_ERRORS.RATE_LIMITED })
      return
    }

    setIsLoading(true)

    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate different scenarios
          if (data.otp === "123456") {
            resolve(true)
          } else if (data.otp === "000000") {
            reject(new Error(AUTH_ERRORS.OTP_EXPIRED))
          } else {
            reject(new Error(AUTH_ERRORS.INVALID_OTP))
          }
        }, 2000)
      })

      setIsSuccess(true)

      // Auto-redirect after success
      setTimeout(() => {
        if (type === "registration") {
          // Mock user login after successful verification
          const mockUser = {
            id: "1",
            email: identifier,
            name: "John Doe",
            role: "job-seeker" as const,
            avatar: "/placeholder.svg?height=40&width=40",
          }
          login(mockUser)
          router.push("/dashboard")
        } else {
          router.push("/auth/login")
        }
      }, 2000)
    } catch (error: any) {
      setError("root", {
        message: error.message || AUTH_ERRORS.INVALID_OTP,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (value: string) => {
    setValue("otp", value)
    if (errors.otp) {
      setError("otp", { message: "" })
    }
  }

  const handleOtpComplete = (value: string) => {
    handleSubmit(onSubmit)()
  }

  const resendCode = async () => {
    if (resendCooldown > 0) return

    // Check rate limiting for resend
    if (!checkRateLimit(`resend_${identifier}`, 3)) {
      setError("root", { message: "Too many resend attempts. Please wait before trying again." })
      return
    }

    setIsLoading(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setResendCooldown(60) // 60 second cooldown
      setError("root", { message: "" }) // Clear any errors

      // Show success message briefly
      setError("root", { message: "Verification code sent!" })
      setTimeout(() => setError("root", { message: "" }), 3000)
    } catch (error) {
      setError("root", { message: AUTH_ERRORS.SERVER_ERROR })
    } finally {
      setIsLoading(false)
    }
  }

  const switchVerificationMethod = () => {
    const newMethod = verificationMethod === "email" ? "phone" : "email"
    setVerificationMethod(newMethod)
    // In a real app, you'd trigger a new verification code to the alternate method
    resendCode()
  }

  // Success state
  if (isSuccess) {
    return (
      <AuthLayout title="Verification successful!" subtitle="Your account has been verified">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Account verified!</h2>
              <p className="text-gray-600">
                {type === "registration"
                  ? "Welcome to CareerHub! Redirecting to your dashboard..."
                  : "You can now sign in to your account."}
              </p>
            </div>

            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  const getTitle = () => {
    switch (type) {
      case "registration":
        return "Verify your account"
      case "login":
        return "Two-factor authentication"
      case "password-reset":
        return "Verify password reset"
      default:
        return "Verify your account"
    }
  }

  const getSubtitle = () => {
    const methodText = verificationMethod === "email" ? "email" : "phone number"
    return `Enter the verification code sent to your ${methodText}`
  }

  return (
    <AuthLayout title={getTitle()} subtitle={getSubtitle()} showBackButton backHref="/auth/login">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          {/* Identifier Display */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              {verificationMethod === "email" ? (
                <Mail className="h-4 w-4 text-gray-500" />
              ) : (
                <Phone className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-700">{identifier}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Global Error/Success */}
            {errors.root && (
              <div
                className={`border px-4 py-3 rounded-md text-sm flex items-center space-x-2 ${
                  errors.root.message.includes("sent")
                    ? "bg-green-50 border-green-200 text-green-600"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {errors.root.message.includes("sent") ? (
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">Verification Code</label>
              <OtpInput
                value={otpValue}
                onChange={handleOtpChange}
                onComplete={handleOtpComplete}
                disabled={isLoading}
                error={!!errors.otp}
                className="mb-2"
              />
              {errors.otp && <p className="text-sm text-red-600 text-center">{errors.otp.message}</p>}
              <p className="text-xs text-gray-500 text-center">
                Enter the 6-digit code sent to your {verificationMethod}
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading || otpValue.length !== 6}>
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>

          {/* Resend Options */}
          <div className="space-y-4">
            <div className="text-center">
              <Button
                variant="outline"
                onClick={resendCode}
                disabled={resendCooldown > 0 || isLoading}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend verification code"}
              </Button>
            </div>

            {/* Alternative Verification Method */}
            <div className="text-center">
              <button
                type="button"
                onClick={switchVerificationMethod}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                {verificationMethod === "email" ? "Send code via SMS instead" : "Send code via email instead"}
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">Didn't receive the code? Check your spam folder or try resending.</p>
            <p className="text-xs text-gray-500">
              Need help?{" "}
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
