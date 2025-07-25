"use client"

import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/auth-utils"

interface OtpInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  error?: boolean
  className?: string
  inputClassName?: string
  autoFocus?: boolean
}

export function OtpInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className,
  inputClassName,
  autoFocus = true,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== otp.join("")) {
      const newOtp = value.split("").slice(0, length)
      while (newOtp.length < length) {
        newOtp.push("")
      }
      setOtp(newOtp)
    }
  }, [value, length, otp])

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const handleChange = (index: number, digit: string) => {
    // Only allow single digits
    if (digit.length > 1) {
      digit = digit.slice(-1)
    }

    // Only allow numbers
    if (digit && !/^\d$/.test(digit)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    const otpValue = newOtp.join("")
    onChange?.(otpValue)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete when all digits are filled
    if (otpValue.length === length && !otpValue.includes("")) {
      onComplete?.(otpValue)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const newOtp = [...otp]

      if (newOtp[index]) {
        // Clear current input
        newOtp[index] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    } else if (e.key === "Delete") {
      e.preventDefault()
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
      onChange?.(newOtp.join(""))
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "")

    if (pastedData) {
      const newOtp = [...otp]
      const startIndex = inputRefs.current.findIndex((ref) => ref === e.target)

      for (let i = 0; i < Math.min(pastedData.length, length - startIndex); i++) {
        newOtp[startIndex + i] = pastedData[i]
      }

      setOtp(newOtp)
      onChange?.(newOtp.join(""))

      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((digit, idx) => idx > startIndex && !digit)
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(startIndex + pastedData.length, length - 1)
      inputRefs.current[focusIndex]?.focus()

      // Call onComplete if all digits are filled
      const otpValue = newOtp.join("")
      if (otpValue.length === length && !otpValue.includes("")) {
        onComplete?.(otpValue)
      }
    }
  }

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select()
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold",
            "border-2 rounded-lg",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            disabled && "opacity-50 cursor-not-allowed",
            inputClassName,
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}

// Enhanced version with verification handling
interface VerificationCodeInputProps extends OtpInputProps {
  isVerifying?: boolean
  onResend?: () => void
  resendDisabled?: boolean
  resendCountdown?: number
  title?: string
  description?: string
  errorMessage?: string
}

export function VerificationCodeInput({
  isVerifying = false,
  onResend,
  resendDisabled = false,
  resendCountdown = 0,
  title = "Enter verification code",
  description = "We've sent a 6-digit code to your email",
  errorMessage,
  ...otpProps
}: VerificationCodeInputProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="space-y-4">
        <OtpInput {...otpProps} disabled={otpProps.disabled || isVerifying} error={!!errorMessage} />

        {errorMessage && <p className="text-sm text-red-600 text-center">{errorMessage}</p>}

        {isVerifying && <p className="text-sm text-gray-600 text-center">Verifying code...</p>}
      </div>

      {onResend && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <Button
            variant="ghost"
            onClick={onResend}
            disabled={resendDisabled || isVerifying}
            className="text-primary hover:text-primary/80"
          >
            {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend code"}
          </Button>
        </div>
      )}
    </div>
  )
}

// Export alias for backward compatibility
export const OTPInput = OtpInput
