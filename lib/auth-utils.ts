import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

// Rate limiting utilities
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export const checkRateLimit = (
  identifier: string,
  maxAttempts = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
): { allowed: boolean; remainingAttempts: number; resetTime: number } => {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    // First attempt or window expired
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      allowed: true,
      remainingAttempts: maxAttempts - 1,
      resetTime: now + windowMs,
    }
  }

  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment count
  entry.count += 1
  rateLimitStore.set(identifier, entry)

  return {
    allowed: true,
    remainingAttempts: maxAttempts - entry.count,
    resetTime: entry.resetTime,
  }
}

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
}

// Email/phone detection
export const detectInputType = (input: string): "email" | "phone" | "unknown" => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/

  if (emailRegex.test(input)) return "email"
  if (phoneRegex.test(input)) return "phone"
  return "unknown"
}

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "")

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }

  return phone
}

// Generate secure tokens
export const generateSecureToken = (length = 32): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

// Generate OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
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

// Security headers for API responses
export const getSecurityHeaders = () => ({
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self'; object-src 'none'; child-src 'none'; worker-src 'none'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; manifest-src 'self';",
})

// Error logging utility
export const logError = (error: Error, context?: Record<string, any>) => {
  // In production, this would send to a logging service like Sentry
  console.error("Application Error:", {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
  })
}

// Success tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // In production, this would send to analytics service
  console.log("Event:", eventName, properties)
}

// Local storage utilities with error handling
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  },
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
}

// Session storage utilities
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      sessionStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  },
  removeItem: (key: string): boolean => {
    try {
      sessionStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
}
