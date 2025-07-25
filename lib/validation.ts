import { z } from "zod"

// Phone number regex for basic validation
const phoneRegex = /^[+]?[1-9][\d]{0,15}$/

// Password strength validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")

// Login validation
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

// Registration validation - Step 1
export const registrationStep1Schema = z.object({
  accountType: z.enum(["job-seeker", "employer", "both"], {
    required_error: "Please select an account type",
  }),
})

// Registration validation - Step 2
export const registrationStep2Schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    identifier: z.string().min(1, "Email or phone is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Forgot password validation
export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
})

// Reset password validation
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
    token: z.string().min(1, "Reset token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// OTP verification validation
export const otpVerificationSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  token: z.string().min(1, "Verification token is required"),
})

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

// Job posting validation
export const jobPostingSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship"]),
  workType: z.enum(["On-site", "Remote", "Hybrid"]),
  experienceLevel: z.enum(["Entry-level", "Mid-level", "Senior", "Executive"]),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  currency: z.string().default("USD"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is required"),
  requirements: z.array(z.string()).min(1, "At least one requirement is required"),
  benefits: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  applicationDeadline: z.string().optional(),
  applicationUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1, "Job category is required"),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  urgent: z.boolean().default(false),
})

// Profile validation
export const profileSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  }),
  summary: z.string().max(500, "Summary must be less than 500 characters").optional(),
  experience: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(2, "Job title is required"),
      company: z.string().min(2, "Company name is required"),
      location: z.string().optional(),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      current: z.boolean(),
      description: z.string().optional(),
    }),
  ),
  education: z.array(
    z.object({
      id: z.string(),
      degree: z.string().min(2, "Degree is required"),
      school: z.string().min(2, "School name is required"),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      gpa: z.string().optional(),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string(),
      level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
      yearsOfExperience: z.number().min(0).max(50).optional(),
    }),
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(2, "Certification name is required"),
      issuer: z.string().min(2, "Issuer is required"),
      issueDate: z.string().min(1, "Issue date is required"),
      expiryDate: z.string().optional(),
      credentialId: z.string().optional(),
      credentialUrl: z.string().url().optional().or(z.literal("")),
    }),
  ),
  preferences: z.object({
    salary: z.object({
      min: z.number().min(0),
      max: z.number().min(0),
    }),
    jobType: z.array(z.string()),
    remote: z.boolean(),
    locations: z.array(z.string()),
    industries: z.array(z.string()),
  }),
  visibility: z.object({
    profilePublic: z.boolean().default(true),
    contactInfoVisible: z.boolean().default(false),
    salaryVisible: z.boolean().default(false),
    availableForWork: z.boolean().default(true),
  }),
})

// Application validation
export const applicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z.string().max(2000, "Cover letter must be less than 2000 characters").optional(),
  customAnswers: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.string().max(1000, "Answer must be less than 1000 characters"),
      }),
    )
    .optional(),
  portfolioItems: z.array(z.string()).optional(),
})

// Message validation
export const messageSchema = z.object({
  recipientId: z.string().min(1, "Recipient is required"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  content: z.string().min(1, "Message content is required").max(5000, "Message is too long"),
  attachments: z.array(z.string()).optional(),
})

// Search validation
export const searchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  jobType: z.array(z.string()).optional(),
  workType: z.array(z.string()).optional(),
  experienceLevel: z.array(z.string()).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  datePosted: z.enum(["24h", "7d", "30d", "all"]).optional(),
  sortBy: z.enum(["relevance", "date", "salary", "company"]).default("relevance"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
})

// Saved search validation
export const savedSearchSchema = z.object({
  name: z.string().min(1, "Search name is required").max(100, "Name is too long"),
  searchParams: searchSchema,
  emailAlerts: z.boolean().default(false),
  alertFrequency: z.enum(["immediate", "daily", "weekly"]).default("daily"),
})

// Company profile validation
export const companyProfileSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  industry: z.string().min(1, "Industry is required"),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]),
  founded: z.number().min(1800).max(new Date().getFullYear()),
  website: z.string().url("Please enter a valid website URL"),
  location: z.string().min(2, "Location is required"),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      facebook: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  benefits: z.array(z.string()).optional(),
  culture: z.string().max(1000, "Culture description is too long").optional(),
  verified: z.boolean().default(false),
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine(
      (file) =>
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(file.type),
      "File type not supported",
    ),
  type: z.enum(["resume", "cover-letter", "portfolio", "company-logo", "company-cover"]),
})

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  preferences: z
    .object({
      jobAlerts: z.boolean().default(true),
      companyUpdates: z.boolean().default(true),
      industryNews: z.boolean().default(false),
      weeklyDigest: z.boolean().default(true),
    })
    .optional(),
})

// Interview scheduling validation
export const interviewSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  type: z.enum(["phone", "video", "in-person"]),
  scheduledAt: z.string().min(1, "Interview date and time is required"),
  duration: z.number().min(15).max(480), // 15 minutes to 8 hours
  location: z.string().optional(),
  meetingLink: z.string().url().optional().or(z.literal("")),
  notes: z.string().max(1000, "Notes are too long").optional(),
  interviewers: z.array(z.string()).min(1, "At least one interviewer is required"),
})

// Utility functions
export const isEmail = (value: string): boolean => {
  return z.string().email().safeParse(value).success
}

export const isPhone = (value: string): boolean => {
  return phoneRegex.test(value.replace(/\s/g, ""))
}

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return value
}

export const getPasswordStrength = (
  password: string,
): {
  score: number
  feedback: string
  color: string
} => {
  let score = 0
  let feedback = "Very weak"
  let color = "bg-red-500"

  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  switch (score) {
    case 0:
    case 1:
      feedback = "Very weak"
      color = "bg-red-500"
      break
    case 2:
      feedback = "Weak"
      color = "bg-orange-500"
      break
    case 3:
      feedback = "Fair"
      color = "bg-yellow-500"
      break
    case 4:
      feedback = "Good"
      color = "bg-blue-500"
      break
    case 5:
      feedback = "Strong"
      color = "bg-green-500"
      break
  }

  return { score, feedback, color }
}

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "")
}

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

export type LoginData = z.infer<typeof loginSchema>
export type RegistrationStep1Data = z.infer<typeof registrationStep1Schema>
export type RegistrationStep2Data = z.infer<typeof registrationStep2Schema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type OtpVerificationData = z.infer<typeof otpVerificationSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type JobPostingData = z.infer<typeof jobPostingSchema>
export type ProfileData = z.infer<typeof profileSchema>
export type ApplicationData = z.infer<typeof applicationSchema>
export type MessageData = z.infer<typeof messageSchema>
export type SearchData = z.infer<typeof searchSchema>
export type SavedSearchData = z.infer<typeof savedSearchSchema>
export type CompanyProfileData = z.infer<typeof companyProfileSchema>
export type FileUploadData = z.infer<typeof fileUploadSchema>
export type NewsletterData = z.infer<typeof newsletterSchema>
export type InterviewData = z.infer<typeof interviewSchema>
