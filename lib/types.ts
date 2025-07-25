// Core user types
export interface User {
  id: string
  username: string // @username format
  displayName: string
  realName: string
  email: string
  phone?: string
  avatar?: string
  coverImage?: string
  bio?: string
  role: "job-seeker" | "employer" | "both"
  verified: boolean
  premium: boolean
  online: boolean
  lastSeen: string
  profileComplete: number
  createdAt: string
  updatedAt: string

  // Privacy settings
  privacy: {
    profilePublic: boolean
    showEmail: boolean
    showPhone: boolean
    allowMessages: "everyone" | "connections" | "none"
    showOnlineStatus: boolean
    showLastSeen: boolean
  }

  // Job seeker specific
  jobSeekerProfile?: JobSeekerProfile

  // Employer specific
  employerProfile?: EmployerProfile
}

export interface JobSeekerProfile {
  availability: "actively-looking" | "open-to-offers" | "not-available"
  salaryExpectation: {
    min: number
    max: number
    currency: string
  }
  preferredJobTypes: string[]
  locationPreferences: {
    remote: boolean
    onSite: boolean
    hybrid: boolean
    locations: string[]
  }
  skills: Skill[]
  experience: Experience[]
  education: Education[]
  certifications: Certification[]
  portfolio: PortfolioItem[]
  resume?: {
    url: string
    filename: string
    uploadedAt: string
  }
  references: Reference[]
  profileViews: number
  searchAppearances: number
}

export interface EmployerProfile {
  companyName: string
  companySize: string
  industry: string
  website?: string
  description: string
  culture?: string
  benefits: string[]
  locations: string[]
  foundedYear?: number
  socialLinks: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  jobsPosted: number
  successfulHires: number
  responseRate: number
  averageResponseTime: number
}

export interface Skill {
  id: string
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
  yearsOfExperience: number
  endorsements: Endorsement[]
  verified: boolean
}

export interface Experience {
  id: string
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  achievements: string[]
  skills: string[]
}

export interface Education {
  id: string
  degree: string
  school: string
  location?: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
  achievements: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  verified: boolean
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  type: "image" | "document" | "video" | "link"
  url: string
  thumbnail?: string
  tags: string[]
  createdAt: string
}

export interface Reference {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone?: string
  relationship: string
  status: "pending" | "approved" | "declined"
}

export interface Endorsement {
  id: string
  endorserId: string
  endorserName: string
  endorserAvatar?: string
  message?: string
  createdAt: string
}

// Job types
export interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  jobType: "full-time" | "part-time" | "contract" | "freelance" | "internship"
  workType: "remote" | "on-site" | "hybrid"
  experienceLevel: "entry" | "mid" | "senior" | "executive"
  location: string
  category: string
  tags: string[]
  postedBy: string
  companyId?: string
  applicationDeadline?: string
  featured: boolean
  urgent: boolean
  status: "active" | "paused" | "closed" | "draft"
  views: number
  applications: number
  saves: number
  createdAt: string
  updatedAt: string

  // Custom application questions
  customQuestions: ApplicationQuestion[]
}

export interface ApplicationQuestion {
  id: string
  question: string
  type: "text" | "textarea" | "select" | "multiselect" | "file"
  required: boolean
  options?: string[]
}

// Messaging types
export interface Message {
  id: string
  conversationId: string
  senderId: string
  recipientId: string
  content: string
  type: "text" | "file" | "voice" | "system"
  attachments: MessageAttachment[]
  replyTo?: string
  reactions: MessageReaction[]
  edited: boolean
  editedAt?: string
  read: boolean
  readAt?: string
  delivered: boolean
  deliveredAt?: string
  createdAt: string

  // Context for job-related messages
  context?: {
    type: "job-inquiry" | "application" | "interview" | "general"
    jobId?: string
    applicationId?: string
  }
}

export interface MessageAttachment {
  id: string
  type: "image" | "document" | "video" | "audio"
  url: string
  filename: string
  size: number
  mimeType: string
}

export interface MessageReaction {
  id: string
  userId: string
  emoji: string
  createdAt: string
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  archived: boolean
  muted: boolean
  pinned: boolean
  createdAt: string
  updatedAt: string

  // Job context
  jobContext?: {
    jobId: string
    jobTitle: string
  }
}

// Application types
export interface Application {
  id: string
  jobId: string
  applicantId: string
  status: "pending" | "reviewed" | "interview" | "rejected" | "accepted" | "withdrawn"
  coverLetter?: string
  customAnswers: ApplicationAnswer[]
  attachments: string[]
  appliedAt: string
  updatedAt: string

  // Interview details
  interviews: Interview[]

  // Feedback
  feedback?: {
    rating: number
    comments: string
    providedBy: string
    providedAt: string
  }
}

export interface ApplicationAnswer {
  questionId: string
  answer: string | string[]
}

export interface Interview {
  id: string
  type: "phone" | "video" | "in-person"
  scheduledAt: string
  duration: number
  location?: string
  meetingLink?: string
  notes?: string
  interviewers: string[]
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  feedback?: string
}

// Search and discovery types
export interface SearchFilters {
  query?: string
  userType?: "job-seeker" | "employer" | "both"
  location?: string
  skills?: string[]
  experience?: string
  availability?: string
  verified?: boolean
  online?: boolean
}

export interface UserSearchResult {
  user: User
  matchScore: number
  commonConnections: number
  mutualSkills: string[]
  distance?: number
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: "message" | "application" | "interview" | "connection" | "endorsement" | "job-match" | "system"
  title: string
  message: string
  data?: any
  read: boolean
  actionUrl?: string
  createdAt: string
}

// Connection types
export interface Connection {
  id: string
  requesterId: string
  recipientId: string
  status: "pending" | "accepted" | "declined" | "blocked"
  message?: string
  createdAt: string
  updatedAt: string
}

// Activity types
export interface Activity {
  id: string
  userId: string
  type: "profile-update" | "job-post" | "application" | "connection" | "endorsement"
  description: string
  data?: any
  createdAt: string
}

// Analytics types
export interface UserAnalytics {
  profileViews: number
  searchAppearances: number
  messagesSent: number
  messagesReceived: number
  connectionsCount: number
  endorsementsReceived: number
  jobsApplied: number
  responseRate: number
  averageResponseTime: number
}

export interface JobAnalytics {
  views: number
  applications: number
  saves: number
  shares: number
  clickThroughRate: number
  conversionRate: number
  averageTimeToApply: number
  topSources: Array<{ source: string; count: number }>
}

// Real-time types
export interface TypingIndicator {
  conversationId: string
  userId: string
  isTyping: boolean
}

export interface OnlineStatus {
  userId: string
  online: boolean
  lastSeen: string
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

// Form types
export interface MessageDraft {
  conversationId: string
  content: string
  attachments: File[]
  replyTo?: string
  savedAt: string
}

export interface JobPostDraft {
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  jobType: string
  workType: string
  experienceLevel: string
  location: string
  category: string
  tags: string[]
  customQuestions: ApplicationQuestion[]
  savedAt: string
}

// WebSocket event types
export interface WebSocketEvent {
  type: string
  data: any
  timestamp: string
}

export interface MessageEvent extends WebSocketEvent {
  type: "message"
  data: Message
}

export interface TypingEvent extends WebSocketEvent {
  type: "typing"
  data: TypingIndicator
}

export interface OnlineStatusEvent extends WebSocketEvent {
  type: "online-status"
  data: OnlineStatus
}

export interface NotificationEvent extends WebSocketEvent {
  type: "notification"
  data: Notification
}
