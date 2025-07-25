"use client"

import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  description?: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function ProgressIndicator({ steps, currentStep, className = "" }: ProgressIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1
          const isCurrent = index === currentStep - 1
          const isUpcoming = index > currentStep - 1

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    {
                      "bg-primary border-primary text-white": isCompleted,
                      "bg-primary border-primary text-white ring-4 ring-primary/20": isCurrent,
                      "bg-gray-100 border-gray-300 text-gray-400": isUpcoming,
                    },
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <div
                    className={cn("text-sm font-medium", {
                      "text-primary": isCompleted || isCurrent,
                      "text-gray-400": isUpcoming,
                    })}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div
                      className={cn("text-xs mt-1", {
                        "text-gray-600": isCompleted || isCurrent,
                        "text-gray-400": isUpcoming,
                      })}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn("flex-1 h-0.5 mx-4 transition-all duration-300", {
                    "bg-primary": index < currentStep - 1,
                    "bg-gray-300": index >= currentStep - 1,
                  })}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
