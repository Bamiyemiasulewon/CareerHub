"use client"

import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
  placeholder?: string
  className?: string
  inputClassName?: string
  error?: boolean
  size?: "sm" | "md" | "lg"
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  disabled = false,
  autoFocus = false,
  placeholder = "○",
  className,
  inputClassName,
  error = false,
  size = "md",
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Size variants
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
  }

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      const newOtp = value.split("").slice(0, length)
      while (newOtp.length < length) {
        newOtp.push("")
      }
      setOtp(newOtp)
    }
  }, [value, length])

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const handleChange = (index: number, digit: string) => {
    if (disabled) return

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

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete if all digits filled
    if (otpValue.length === length && !otpValue.includes("")) {
      onComplete?.(otpValue)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    switch (e.key) {
      case "Backspace":
        e.preventDefault()
        if (otp[index]) {
          // Clear current input
          handleChange(index, "")
        } else if (index > 0) {
          // Move to previous input and clear it
          inputRefs.current[index - 1]?.focus()
          handleChange(index - 1, "")
        }
        break

      case "Delete":
        e.preventDefault()
        handleChange(index, "")
        break

      case "ArrowLeft":
        e.preventDefault()
        if (index > 0) {
          inputRefs.current[index - 1]?.focus()
        }
        break

      case "ArrowRight":
        e.preventDefault()
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus()
        }
        break

      case "Home":
        e.preventDefault()
        inputRefs.current[0]?.focus()
        break

      case "End":
        e.preventDefault()
        inputRefs.current[length - 1]?.focus()
        break

      default:
        // Allow only numeric input
        if (!/^\d$/.test(e.key) && !["Tab", "Shift"].includes(e.key)) {
          e.preventDefault()
        }
        break
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain")
    const digits = pastedData.replace(/\D/g, "").slice(0, length)

    if (digits) {
      const newOtp = Array(length).fill("")
      for (let i = 0; i < digits.length; i++) {
        newOtp[i] = digits[i]
      }
      setOtp(newOtp)

      const otpValue = newOtp.join("")
      onChange?.(otpValue)

      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1
      inputRefs.current[focusIndex]?.focus()

      // Call onComplete if all digits filled
      if (otpValue.length === length && !otpValue.includes("")) {
        onComplete?.(otpValue)
      }
    }
  }

  const handleFocus = (index: number) => {
    // Select all text when input is focused
    inputRefs.current[index]?.select()
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
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
          placeholder={!digit ? placeholder : ""}
          className={cn(
            "text-center font-mono font-semibold border rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200",
            sizeClasses[size],
            error
              ? "border-red-500 bg-red-50 text-red-900"
              : "border-gray-300 bg-white text-gray-900 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100",
            inputClassName,
          )}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  )
}

// Export alias for backward compatibility
export { OTPInput as OtpInput }

// Additional utility component for common use cases
export function VerificationCodeInput({
  onVerify,
  loading = false,
  error,
  ...props
}: Omit<OTPInputProps, "onComplete"> & {
  onVerify?: (code: string) => void | Promise<void>
  loading?: boolean
  error?: string
}) {
  const [isVerifying, setIsVerifying] = useState(false)

  const handleComplete = async (code: string) => {
    if (onVerify && !isVerifying) {
      setIsVerifying(true)
      try {
        await onVerify(code)
      } finally {
        setIsVerifying(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      <OTPInput
        {...props}
        onComplete={handleComplete}
        disabled={props.disabled || loading || isVerifying}
        error={!!error}
      />
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      {(loading || isVerifying) && <p className="text-sm text-gray-600 text-center">Verifying...</p>}
    </div>
  )
}
