"use client"

import type React from "react"
import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  onComplete?: (otp: string) => void
  autoFocus?: boolean
  disabled?: boolean
  value?: string
  onChange?: (otp: string) => void
  inputClassName?: string
  containerClassName?: string
  isError?: boolean
}

export const OtpInput = ({
  length = 6,
  onComplete,
  autoFocus = true,
  disabled = false,
  value = "",
  onChange,
  inputClassName,
  containerClassName,
  isError = false,
}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(
    value.split("").slice(0, length).concat(Array(length).fill("")).slice(0, length),
  )
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  useEffect(() => {
    const newOtp = value.split("").slice(0, length).concat(Array(length).fill("")).slice(0, length)
    setOtp(newOtp)
  }, [value, length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value
    if (newValue === "" || /^\d$/.test(newValue)) {
      const newOtp = [...otp]
      newOtp[index] = newValue
      setOtp(newOtp)

      if (onChange) {
        onChange(newOtp.join(""))
      }

      // Auto-focus next input if value is entered
      if (newValue !== "" && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus()
      }

      // Check if OTP is complete
      const otpValue = newOtp.join("")
      if (otpValue.length === length && !otpValue.includes("") && onComplete) {
        onComplete(otpValue)
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0 && inputRefs.current[index - 1]) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1].focus()
    } else if (e.key === "ArrowLeft" && index > 0 && inputRefs.current[index - 1]) {
      // Move to previous input on left arrow
      inputRefs.current[index - 1].focus()
    } else if (e.key === "ArrowRight" && index < length - 1 && inputRefs.current[index + 1]) {
      // Move to next input on right arrow
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newOtp[i] = pastedData[i]
    }

    setOtp(newOtp)

    if (onChange) {
      onChange(newOtp.join(""))
    }

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => val === "")
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus()
    }

    // Check if OTP is complete
    const otpValue = newOtp.join("")
    if (otpValue.length === length && !otpValue.includes("") && onComplete) {
      onComplete(otpValue)
    }
  }

  return (
    <div className={cn("flex gap-2 items-center justify-center", containerClassName)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className={cn(
            "w-10 h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1",
            isError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500",
            disabled && "bg-gray-100 cursor-not-allowed opacity-70",
            inputClassName,
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}

// Alias for OtpInput to fix the export name issue
export const OTPInput = OtpInput

// Enhanced version with verification functionality
export const VerificationCodeInput = ({
  length = 6,
  onVerify,
  isLoading = false,
  error = "",
  ...props
}: OTPInputProps & {
  onVerify?: (code: string) => void
  isLoading?: boolean
  error?: string
}) => {
  const [code, setCode] = useState("")

  const handleComplete = (otp: string) => {
    setCode(otp)
    if (onVerify) {
      onVerify(otp)
    }
  }

  return (
    <div className="space-y-4">
      <OtpInput
        length={length}
        onComplete={handleComplete}
        onChange={setCode}
        value={code}
        disabled={isLoading}
        isError={!!error}
        {...props}
      />
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  )
}
