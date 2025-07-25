"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Chrome, Briefcase, Search, Phone, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { api } from "@/lib/api"
import { AuthLayout } from "@/components/auth/auth-layout"
import { ProgressIndicator } from "@/components/auth/progress-indicator"
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator"
import {
  registrationStep1Schema,
  registrationStep2Schema,
  type RegistrationStep1Data,
  type RegistrationStep2Data,
  isEmail,
  formatPhoneNumber,
} from "@/lib/validation"
import { checkRateLimit, AUTH_ERRORS } from "@/lib/auth-utils"
import { cn } from "@/lib/auth-utils"

const REGISTRATION_STEPS = ["Account Type", "Information", "Verification"]

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inputType, setInputType] = useState<"email" | "phone">("email")
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationStep1Data & RegistrationStep2Data>>({})

  const { login } = useAuthStore()
  const router = useRouter()

  // Step 1 Form
  const step1Form = useForm<RegistrationStep1Data>({
    resolver: zodResolver(registrationStep1Schema),
    defaultValues: {
      accountType: undefined,
    },
  })

  // Step 2 Form
  const step2Form = useForm<RegistrationStep2Data>({
    resolver: zodResolver(registrationStep2Schema),
    defaultValues: {
      name: "",
      identifier: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  const passwordValue = step2Form.watch("password")
  const identifierValue = step2Form.watch("identifier")

  // Auto-detect input type and format
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (isEmail(value)) {
      setInputType("email")
      step2Form.setValue("identifier", value)
    } else {
      setInputType("phone")
      step2Form.setValue("identifier", formatPhoneNumber(value))
    }
  }

  const onStep1Submit = (data: RegistrationStep1Data) => {
    setRegistrationData({ ...registrationData, ...data })
    setCurrentStep(2)
  }

  const onStep2Submit = async (data: RegistrationStep2Data) => {
    const fullData = { ...registrationData, ...data }

    // Check rate limiting
    if (!checkRateLimit(data.identifier)) {
      step2Form.setError("root", { message: AUTH_ERRORS.RATE_LIMITED })
      return
    }

    setIsLoading(true)

    try {
      const response = await api.auth.register({
        name: data.name,
        email: data.identifier,
        password: data.password,
        role: fullData.accountType!,
      })

      // Redirect to verification
      router.push(`/auth/verify?identifier=${encodeURIComponent(data.identifier)}&type=registration`)
    } catch (error: any) {
      step2Form.setError("root", {
        message: error.message || AUTH_ERRORS.SERVER_ERROR,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    if (currentStep === 1) {
      step1Form.setError("root", { message: "Please select an account type first" })
      return
    }

    setIsLoading(true)
    try {
      // Mock social login - replace with actual implementation
      const mockUser = {
        id: "1",
        email: "user@example.com",
        name: "John Doe",
        role: registrationData.accountType || "job-seeker",
        avatar: "/placeholder.svg?height=40&width=40",
      }
      login(mockUser)
      router.push("/dashboard")
    } catch (error) {
      const form = currentStep === 1 ? step1Form : step2Form
      form.setError("root", { message: AUTH_ERRORS.SERVER_ERROR })
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
      showBackButton={currentStep > 1}
      backHref="#"
    >
      <div onClick={currentStep > 1 ? goBack : undefined}>
        <ProgressIndicator steps={REGISTRATION_STEPS} currentStep={currentStep} />

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            {currentStep === 1 && (
              <>
                {/* Step 1: Account Type Selection */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">What brings you to CareerHub?</h2>
                  <p className="text-sm text-gray-600">Choose the option that best describes your goal</p>
                </div>

                <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
                  {step1Form.formState.errors.root && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{step1Form.formState.errors.root.message}</span>
                    </div>
                  )}

                  <div>
                    <RadioGroup
                      value={step1Form.watch("accountType")}
                      onValueChange={(value: "job-seeker" | "employer") => step1Form.setValue("accountType", value)}
                      className="grid gap-4"
                    >
                      <div
                        className={cn(
                          "flex items-center space-x-4 border-2 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-50",
                          step1Form.watch("accountType") === "job-seeker"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200",
                        )}
                      >
                        <RadioGroupItem value="job-seeker" id="job-seeker" />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Search className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <Label htmlFor="job-seeker" className="text-base font-medium cursor-pointer">
                              I'm looking for a job
                            </Label>
                            <p className="text-sm text-gray-600">Find your next career opportunity</p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "flex items-center space-x-4 border-2 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-50",
                          step1Form.watch("accountType") === "employer"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200",
                        )}
                      >
                        <RadioGroupItem value="employer" id="employer" />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Briefcase className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <Label htmlFor="employer" className="text-base font-medium cursor-pointer">
                              I'm hiring talent
                            </Label>
                            <p className="text-sm text-gray-600">Find the perfect candidates for your team</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                    {step1Form.formState.errors.accountType && (
                      <p className="mt-2 text-sm text-red-600">{step1Form.formState.errors.accountType.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={!step1Form.watch("accountType")}>
                    Continue
                  </Button>
                </form>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* Step 2: Registration Form */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Create your account</h2>
                  <p className="text-sm text-gray-600">Join thousands of professionals on CareerHub</p>
                </div>

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
                    <span className="bg-white px-2 text-gray-500">Or register with email</span>
                  </div>
                </div>

                <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
                  {step2Form.formState.errors.root && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{step2Form.formState.errors.root.message}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        className={cn(
                          "pl-10",
                          step2Form.formState.errors.name && "border-red-500 focus:border-red-500",
                        )}
                        placeholder="Enter your full name"
                        {...step2Form.register("name")}
                        disabled={isLoading}
                      />
                    </div>
                    {step2Form.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.name.message}</p>
                    )}
                  </div>

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
                        className={cn(
                          "pl-10",
                          step2Form.formState.errors.identifier && "border-red-500 focus:border-red-500",
                        )}
                        placeholder="Enter your email or phone"
                        {...step2Form.register("identifier")}
                        onChange={handleIdentifierChange}
                        disabled={isLoading}
                      />
                    </div>
                    {step2Form.formState.errors.identifier && (
                      <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.identifier.message}</p>
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
                        autoComplete="new-password"
                        className={cn(
                          "pl-10 pr-10",
                          step2Form.formState.errors.password && "border-red-500 focus:border-red-500",
                        )}
                        placeholder="Create a strong password"
                        {...step2Form.register("password")}
                        disabled={isLoading}
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
                    {step2Form.formState.errors.password && (
                      <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.password.message}</p>
                    )}
                    <PasswordStrengthIndicator password={passwordValue} className="mt-2" />
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className={cn(
                          "pl-10",
                          step2Form.formState.errors.confirmPassword && "border-red-500 focus:border-red-500",
                        )}
                        placeholder="Confirm your password"
                        {...step2Form.register("confirmPassword")}
                        disabled={isLoading}
                      />
                    </div>
                    {step2Form.formState.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms Acceptance */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      {...step2Form.register("acceptTerms")}
                      disabled={isLoading}
                      className="mt-0.5"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {step2Form.formState.errors.acceptTerms && (
                    <p className="text-sm text-red-600">{step2Form.formState.errors.acceptTerms.message}</p>
                  )}

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}
