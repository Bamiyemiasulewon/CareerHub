"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  error?: boolean
  className?: string
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className = "",
}: OTPInputProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value)
    }
  }, [value, length, onComplete])

  const handleChange = (index: number, digit: string) => {
    if (disabled) return

    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return

    const newValue = value.split("")
    newValue[index] = digit
    const updatedValue = newValue.join("")

    onChange(updatedValue)

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === "Backspace") {
      e.preventDefault()
      const newValue = value.split("")

      if (newValue[index]) {
        // Clear current digit
        newValue[index] = ""
        onChange(newValue.join(""))
      } else if (index > 0) {
        // Move to previous input and clear it
        newValue[index - 1] = ""
        onChange(newValue.join(""))
        setActiveIndex(index - 1)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleFocus = (index: number) => {
    setActiveIndex(index)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    if (disabled) return

    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, length)
    onChange(pastedData)

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, length - 1)
    setActiveIndex(nextIndex)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold",
            "focus:ring-2 focus:ring-primary focus:border-primary",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            disabled && "opacity-50 cursor-not-allowed",
            activeIndex === index && "ring-2 ring-primary border-primary",
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
