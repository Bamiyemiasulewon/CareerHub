import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Auth error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email/phone or password",
  ACCOUNT_NOT_VERIFIED: "Please verify your account before signing in",
  ACCOUNT_LOCKED: "Account temporarily locked due to too many failed attempts",
  RATE_LIMITED: "Too many attempts. Please try again later",
  SERVER_ERROR: "Something went wrong. Please try again",
  WEAK_PASSWORD: "Password must be at least 8 characters with uppercase, lowercase, number and special character",
  PASSWORDS_DONT_MATCH: "Passwords don't match",
  INVALID_TOKEN: "Invalid or expired verification token",
  TOKEN_EXPIRED: "Verification token has expired",
  USER_EXISTS: "An account with this email/phone already exists",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  REQUIRED_FIELD: "This field is required",
} as const

// Rate limiting storage
const rateLimitStore = new Map<string, { attempts: number; lastAttempt: number; lockedUntil?: number }>()

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  lockoutMs: 30 * 60 * 1000, // 30 minutes lockout
}

// Check if user is rate limited
export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const userAttempts = rateLimitStore.get(identifier)

  if (!userAttempts) {
    rateLimitStore.set(identifier, { attempts: 1, lastAttempt: now })
    return true
  }

  // Check if user is currently locked out
  if (userAttempts.lockedUntil && now < userAttempts.lockedUntil) {
    return false
  }

  // Reset if window has passed
  if (now - userAttempts.lastAttempt > RATE_LIMIT_CONFIG.windowMs) {
    rateLimitStore.set(identifier, { attempts: 1, lastAttempt: now })
    return true
  }

  // Check if max attempts reached
  if (userAttempts.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
    rateLimitStore.set(identifier, {
      ...userAttempts,
      lockedUntil: now + RATE_LIMIT_CONFIG.lockoutMs,
    })
    return false
  }

  // Increment attempts
  rateLimitStore.set(identifier, {
    ...userAttempts,
    attempts: userAttempts.attempts + 1,
    lastAttempt: now,
  })

  return true
}

// Get remaining cooldown time in milliseconds
export function getRemainingCooldown(identifier: string): number {
  const now = Date.now()
  const userAttempts = rateLimitStore.get(identifier)

  if (!userAttempts?.lockedUntil) return 0

  const remaining = userAttempts.lockedUntil - now
  return Math.max(0, remaining)
}

// Generate secure token
export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Password strength calculation
export function calculatePasswordStrength(password: string): {
  score: number
  feedback: string[]
  strength: "weak" | "fair" | "good" | "strong"
} {
  let score = 0
  const feedback: string[] = []

  if (password.length < 8) {
    feedback.push("Use at least 8 characters")
  } else {
    score += 1
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("Add lowercase letters")
  } else {
    score += 1
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push("Add uppercase letters")
  } else {
    score += 1
  }

  if (!/\d/.test(password)) {
    feedback.push("Add numbers")
  } else {
    score += 1
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push("Add special characters")
  } else {
    score += 1
  }

  if (password.length >= 12) {
    score += 1
  }

  let strength: "weak" | "fair" | "good" | "strong"
  if (score <= 2) strength = "weak"
  else if (score <= 3) strength = "fair"
  else if (score <= 4) strength = "good"
  else strength = "strong"

  return { score, feedback, strength }
}

// File upload validation
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {},
): { isValid: boolean; error?: string } {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"],
    allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"],
  } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    }
  }

  // Check file extension
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File extension not allowed. Allowed extensions: ${allowedExtensions.join(", ")}`,
    }
  }

  return { isValid: true }
}

// Session management
export function setSession(token: string, expiresIn: number = 24 * 60 * 60 * 1000) {
  const expiresAt = Date.now() + expiresIn
  localStorage.setItem("auth_token", token)
  localStorage.setItem("auth_expires", expiresAt.toString())
}

export function getSession(): { token: string; isValid: boolean } | null {
  const token = localStorage.getItem("auth_token")
  const expires = localStorage.getItem("auth_expires")

  if (!token || !expires) return null

  const isValid = Date.now() < Number.parseInt(expires)
  return { token, isValid }
}

export function clearSession() {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("auth_expires")
}

// Mock API functions for development
export const mockApi = {
  login: async (identifier: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    if (identifier === "demo@example.com" && password === "password123") {
      return {
        user: {
          id: "1",
          email: identifier,
          name: "Demo User",
          role: "job-seeker" as const,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        token: generateToken(),
      }
    }

    throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS)
  },

  register: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      user: {
        id: generateToken(8),
        email: data.email,
        name: data.name,
        role: data.role,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      token: generateToken(),
    }
  },

  forgotPassword: async (identifier: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Reset link sent to your email" }
  },

  resetPassword: async (token: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Password reset successfully" }
  },

  verifyAccount: async (token: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Account verified successfully" }
  },
}
