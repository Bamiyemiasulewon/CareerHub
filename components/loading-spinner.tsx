import type React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  color?: "primary" | "secondary" | "white" | "gray"
}

export function LoadingSpinner({ size = "md", className, color = "primary" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  }

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    white: "text-white",
    gray: "text-gray-500",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Alternative pulse loading animation
export function LoadingPulse({
  size = "md",
  className,
  count = 3,
}: {
  size?: "sm" | "md" | "lg"
  className?: string
  count?: number
}) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  return (
    <div className={cn("flex space-x-1", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("animate-pulse rounded-full bg-current", sizeClasses[size])}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  )
}

// Skeleton loading component
export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} {...props} />
}

// Card skeleton for job listings
export function JobCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <LoadingSkeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <LoadingSkeleton className="h-5 w-48" />
            <LoadingSkeleton className="h-4 w-32" />
            <LoadingSkeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-20" />
          <div className="flex gap-2">
            <LoadingSkeleton className="h-6 w-16 rounded-full" />
            <LoadingSkeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <LoadingSkeleton className="h-5 w-24" />
          <div className="flex gap-2">
            <LoadingSkeleton className="h-5 w-16 rounded-full" />
            <LoadingSkeleton className="h-5 w-16 rounded-full" />
            <LoadingSkeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <LoadingSkeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  )
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <LoadingSkeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="space-y-4">
        <LoadingSkeleton className="h-5 w-32" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-24" />
          <LoadingSkeleton className="h-32 w-full" />
        </div>
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-24" />
          <LoadingSkeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-5 w-full" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
