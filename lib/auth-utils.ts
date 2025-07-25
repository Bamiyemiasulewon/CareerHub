import { z } from "zod"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Auth error constants
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  WEAK_PASSWORD: "Password must be at least 8 characters long",
  INVALID_EMAIL: "Please enter a valid email address",
  ACCOUNT_LOCKED: "Account temporarily locked due to too many failed attempts",
  TOKEN_EXPIRED: "Session expired, please login again",
  VERIFICATION_REQUIRED: "Please verify your email address",
  RATE_LIMIT_EXCEEDED: "Too many requests, please try again later",
  NETWORK_ERROR: "Network error, please check your connection",
  SERVER_ERROR: "Server error, please try again later",
} as const

// Password strength calculation
export interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
  label: string
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
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

  if (!/[@$!%*?&]/.test(password)) {
    feedback.push("Add special characters (@$!%*?&)")
  } else {
    score += 1
  }

  if (password.length >= 12) {
    score += 1
  }

  let color = "bg-red-500"
  let label = "Weak"

  if (score >= 4) {
    color = "bg-yellow-500"
    label = "Fair"
  }
  if (score >= 5) {
    color = "bg-green-500"
    label = "Good"
  }
  if (score >= 6) {
    color = "bg-green-600"
    label = "Strong"
  }

  return { score, feedback, color, label }
}

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email(AUTH_ERRORS.INVALID_EMAIL),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email(AUTH_ERRORS.INVALID_EMAIL),
    password: z.string().min(8, AUTH_ERRORS.WEAK_PASSWORD),
    confirmPassword: z.string(),
    role: z.enum(["jobseeker", "employer"]),
    username: z.string().min(3, "Username must be at least 3 characters").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email(AUTH_ERRORS.INVALID_EMAIL),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, AUTH_ERRORS.WEAK_PASSWORD),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Rate limiting utilities
const rateLimitStore = new Map<string, { attempts: number; lastAttempt: number; lockedUntil?: number }>()

export const MAX_LOGIN_ATTEMPTS = 5
export const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes
export const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

export function checkRateLimit(identifier: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record) {
    rateLimitStore.set(identifier, { attempts: 1, lastAttempt: now })
    return { allowed: true }
  }

  // Check if account is locked
  if (record.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      remainingTime: record.lockedUntil - now,
    }
  }

  // Reset attempts if window has passed
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    record.attempts = 1
    record.lastAttempt = now
    delete record.lockedUntil
    return { allowed: true }
  }

  // Increment attempts
  record.attempts++
  record.lastAttempt = now

  // Lock account if max attempts exceeded
  if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION
    return {
      allowed: false,
      remainingTime: LOCKOUT_DURATION,
    }
  }

  return { allowed: true }
}

export function getRemainingCooldown(identifier: string): number {
  const record = rateLimitStore.get(identifier)
  if (!record?.lockedUntil) return 0

  const remaining = record.lockedUntil - Date.now()
  return Math.max(0, remaining)
}

export function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

// Token utilities
export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateOTP(length = 6): string {
  const digits = "0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length))
  }
  return result
}

// Validate file upload
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only PDF, DOC, and DOCX files are allowed" }
  }

  return { valid: true }
}

// Password utilities
export function validatePasswordStrength(password: string): {
  score: number
  feedback: string[]
  isValid: boolean
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push("Use at least 8 characters")

  if (/[a-z]/.test(password)) score++
  else feedback.push("Include lowercase letters")

  if (/[A-Z]/.test(password)) score++
  else feedback.push("Include uppercase letters")

  if (/\d/.test(password)) score++
  else feedback.push("Include numbers")

  if (/[^a-zA-Z\d]/.test(password)) score++
  else feedback.push("Include special characters")

  return {
    score,
    feedback,
    isValid: score >= 3,
  }
}

// Session utilities
export function createSession(
  userId: string,
  expiresIn: number = 24 * 60 * 60 * 1000,
): {
  token: string
  expiresAt: number
} {
  const token = generateToken(64)
  const expiresAt = Date.now() + expiresIn

  // In a real app, store this in a database or secure storage
  return { token, expiresAt }
}

export function validateSession(token: string): { valid: boolean; userId?: string } {
  // In a real app, validate against stored sessions
  // This is a mock implementation
  if (!token || token.length < 32) {
    return { valid: false }
  }

  return { valid: true, userId: "mock-user-id" }
}

// Email utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

// Username utilities
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

export function sanitizeUsername(username: string): string {
  return username.toLowerCase().trim()
}

// Error handling utilities
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return AUTH_ERRORS.SERVER_ERROR
}

export function isAuthError(error: unknown): error is { code: keyof typeof AUTH_ERRORS } {
  return typeof error === "object" && error !== null && "code" in error
}

// Mock API utilities (replace with real API calls)
export async function mockLogin(
  email: string,
  password: string,
): Promise<{
  success: boolean
  user?: { id: string; email: string; name: string; role: string }
  error?: string
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock validation
  if (email === "test@example.com" && password === "password123") {
    return {
      success: true,
      user: {
        id: "1",
        email,
        name: "Test User",
        role: "jobseeker",
      },
    }
  }

  return {
    success: false,
    error: AUTH_ERRORS.INVALID_CREDENTIALS,
  }
}

export async function mockRegister(userData: {
  name: string
  email: string
  password: string
  role: string
  username?: string
}): Promise<{
  success: boolean
  user?: { id: string; email: string; name: string; role: string }
  error?: string
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock email existence check
  if (userData.email === "existing@example.com") {
    return {
      success: false,
      error: AUTH_ERRORS.EMAIL_ALREADY_EXISTS,
    }
  }

  return {
    success: true,
    user: {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
    },
  }
}
