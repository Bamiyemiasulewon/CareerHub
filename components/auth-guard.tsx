"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { LoadingSpinner } from "@/components/loading-spinner"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: "job-seeker" | "employer" | "both"
  redirectTo?: string
}

export function AuthGuard({ children, requireAuth = true, requiredRole, redirectTo = "/auth/login" }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth state to be loaded from storage
      if (isLoading) return

      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && user && user.role !== requiredRole && user.role !== "both") {
        router.push("/dashboard") // Redirect to dashboard if wrong role
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [isAuthenticated, user, requireAuth, requiredRole, router, redirectTo, isLoading])

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null // Will redirect
  }

  if (requiredRole && user && user.role !== requiredRole && user.role !== "both") {
    return null // Will redirect
  }

  return <>{children}</>
}
