"use client"

import { Progress } from "@/components/ui/progress"
import { calculatePasswordStrength } from "@/lib/auth-utils"
import { CheckCircle, XCircle } from "lucide-react"

interface PasswordStrengthIndicatorProps {
  password: string
  className?: string
}

export function PasswordStrengthIndicator({ password, className = "" }: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password)

  if (!password) return null

  const progressValue = (strength.score / 6) * 100

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Password Strength</span>
        <span
          className={`text-sm font-medium ${
            strength.score >= 5 ? "text-green-600" : strength.score >= 3 ? "text-yellow-600" : "text-red-600"
          }`}
        >
          {strength.label}
        </span>
      </div>

      <Progress
        value={progressValue}
        className="h-2"
        style={{
          background: "#f3f4f6",
        }}
      />

      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((feedback, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <XCircle className="h-3 w-3 text-red-500 mr-2 flex-shrink-0" />
              {feedback}
            </div>
          ))}
        </div>
      )}

      {strength.score >= 5 && (
        <div className="flex items-center text-sm text-green-600">
          <CheckCircle className="h-3 w-3 mr-2" />
          Strong password!
        </div>
      )}
    </div>
  )
}
