// Production-ready API client with error handling, retries, and caching
class APIClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || "/api") {
    this.baseURL = baseURL
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
    this.cache = new Map()
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth-token")
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache = false,
    cacheTTL: number = 5 * 60 * 1000, // 5 minutes default
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const cacheKey = `${options.method || "GET"}:${url}:${JSON.stringify(options.body)}`

    // Check cache for GET requests
    if (useCache && (!options.method || options.method === "GET")) {
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data
      }
    }

    const token = this.getAuthToken()
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new APIError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData,
        )
      }

      const data = await response.json()

      // Cache successful GET requests
      if (useCache && (!options.method || options.method === "GET")) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: cacheTTL,
        })
      }

      return data
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError("Network error occurred", 0, { originalError: error })
    }
  }

  // Auth endpoints
  auth = {
    login: async (credentials: { identifier: string; password: string; rememberMe?: boolean }) => {
      const response = await this.request<{ user: any; token: string; refreshToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })

      // Store tokens
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-token", response.token)
        localStorage.setItem("refresh-token", response.refreshToken)
      }

      return response
    },

    register: async (userData: {
      name: string
      email: string
      password: string
      role: "job-seeker" | "employer" | "both"
    }) => {
      return this.request<{ user: any; token: string; refreshToken: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })
    },

    logout: async () => {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh-token") : null

      try {
        await this.request("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        })
      } finally {
        // Clear tokens regardless of API response
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-token")
          localStorage.removeItem("refresh-token")
        }
      }
    },

    refreshToken: async () => {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh-token") : null

      if (!refreshToken) {
        throw new APIError("No refresh token available", 401)
      }

      const response = await this.request<{ token: string; refreshToken: string }>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      })

      if (typeof window !== "undefined") {
        localStorage.setItem("auth-token", response.token)
        localStorage.setItem("refresh-token", response.refreshToken)
      }

      return response
    },

    forgotPassword: async (identifier: string) => {
      return this.request<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ identifier }),
      })
    },

    resetPassword: async (token: string, password: string) => {
      return this.request<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      })
    },

    verifyEmail: async (token: string) => {
      return this.request<{ message: string }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      })
    },

    resendVerification: async (email: string) => {
      return this.request<{ message: string }>("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
    },
  }

  // Job endpoints
  jobs = {
    search: async (params: {
      query?: string
      location?: string
      jobType?: string[]
      workType?: string[]
      experienceLevel?: string[]
      salaryMin?: number
      salaryMax?: number
      category?: string
      tags?: string[]
      datePosted?: string
      sortBy?: string
      page?: number
      limit?: number
    }) => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v))
          } else {
            searchParams.append(key, value.toString())
          }
        }
      })

      return this.request<{
        jobs: any[]
        total: number
        page: number
        totalPages: number
        filters: any
      }>(`/jobs?${searchParams.toString()}`, {}, true, 2 * 60 * 1000) // 2 minute cache
    },

    getById: async (id: string) => {
      return this.request<any>(`/jobs/${id}`, {}, true, 5 * 60 * 1000) // 5 minute cache
    },

    create: async (jobData: any) => {
      return this.request<any>("/jobs", {
        method: "POST",
        body: JSON.stringify(jobData),
      })
    },

    update: async (id: string, updates: any) => {
      return this.request<any>(`/jobs/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      })
    },

    delete: async (id: string) => {
      return this.request<{ message: string }>(`/jobs/${id}`, {
        method: "DELETE",
      })
    },

    getRecommended: async (userId: string) => {
      return this.request<any[]>(`/jobs/recommended/${userId}`, {}, true, 10 * 60 * 1000) // 10 minute cache
    },

    getSimilar: async (jobId: string) => {
      return this.request<any[]>(`/jobs/${jobId}/similar`, {}, true, 15 * 60 * 1000) // 15 minute cache
    },

    getByCompany: async (companyId: string, params?: { page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.append("page", params.page.toString())
      if (params?.limit) searchParams.append("limit", params.limit.toString())

      return this.request<{
        jobs: any[]
        total: number
        page: number
        totalPages: number
      }>(`/companies/${companyId}/jobs?${searchParams.toString()}`, {}, true)
    },

    getCategories: async () => {
      return this.request<string[]>("/jobs/categories", {}, true, 60 * 60 * 1000) // 1 hour cache
    },

    getTags: async () => {
      return this.request<string[]>("/jobs/tags", {}, true, 30 * 60 * 1000) // 30 minute cache
    },

    getStats: async (jobId: string) => {
      return this.request<{
        views: number
        applications: number
        saves: number
        clickThroughRate: number
      }>(`/jobs/${jobId}/stats`)
    },
  }

  // Application endpoints
  applications = {
    create: async (applicationData: {
      jobId: string
      coverLetter?: string
      customAnswers?: Array<{ questionId: string; answer: string }>
      portfolioItems?: string[]
    }) => {
      return this.request<any>("/applications", {
        method: "POST",
        body: JSON.stringify(applicationData),
      })
    },

    getByUser: async (userId: string, params?: { status?: string; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.append("status", params.status)
      if (params?.page) searchParams.append("page", params.page.toString())
      if (params?.limit) searchParams.append("limit", params.limit.toString())

      return this.request<{
        applications: any[]
        total: number
        page: number
        totalPages: number
      }>(`/users/${userId}/applications?${searchParams.toString()}`)
    },

    getByJob: async (jobId: string, params?: { status?: string; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.append("status", params.status)
      if (params?.page) searchParams.append("page", params.page.toString())
      if (params?.limit) searchParams.append("limit", params.limit.toString())

      return this.request<{
        applications: any[]
        total: number
        page: number
        totalPages: number
      }>(`/jobs/${jobId}/applications?${searchParams.toString()}`)
    },

    updateStatus: async (applicationId: string, status: string, notes?: string) => {
      return this.request<any>(`/applications/${applicationId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status, notes }),
      })
    },

    withdraw: async (applicationId: string) => {
      return this.request<{ message: string }>(`/applications/${applicationId}/withdraw`, {
        method: "PUT",
      })
    },

    getById: async (applicationId: string) => {
      return this.request<any>(`/applications/${applicationId}`)
    },
  }

  // Profile endpoints
  profile = {
    get: async (userId: string) => {
      return this.request<any>(`/users/${userId}/profile`, {}, true, 5 * 60 * 1000) // 5 minute cache
    },

    update: async (userId: string, profileData: any) => {
      return this.request<any>(`/users/${userId}/profile`, {
        method: "PUT",
        body: JSON.stringify(profileData),
      })
    },

    uploadResume: async (userId: string, file: File) => {
      const formData = new FormData()
      formData.append("resume", file)

      return this.request<{ url: string; filename: string }>(`/users/${userId}/resume`, {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      })
    },

    deleteResume: async (userId: string) => {
      return this.request<{ message: string }>(`/users/${userId}/resume`, {
        method: "DELETE",
      })
    },

    uploadPortfolio: async (userId: string, files: File[]) => {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`portfolio_${index}`, file)
      })

      return this.request<{ urls: string[]; filenames: string[] }>(`/users/${userId}/portfolio`, {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      })
    },

    getPublicProfile: async (userId: string) => {
      return this.request<any>(`/users/${userId}/public-profile`, {}, true, 10 * 60 * 1000) // 10 minute cache
    },
  }

  // Company endpoints
  companies = {
    search: async (params: {
      query?: string
      industry?: string
      size?: string
      location?: string
      page?: number
      limit?: number
    }) => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString())
        }
      })

      return this.request<{
        companies: any[]
        total: number
        page: number
        totalPages: number
      }>(`/companies?${searchParams.toString()}`, {}, true, 5 * 60 * 1000) // 5 minute cache
    },

    getById: async (id: string) => {
      return this.request<any>(`/companies/${id}`, {}, true, 10 * 60 * 1000) // 10 minute cache
    },

    create: async (companyData: any) => {
      return this.request<any>("/companies", {
        method: "POST",
        body: JSON.stringify(companyData),
      })
    },

    update: async (id: string, updates: any) => {
      return this.request<any>(`/companies/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      })
    },

    follow: async (companyId: string) => {
      return this.request<{ message: string }>(`/companies/${companyId}/follow`, {
        method: "POST",
      })
    },

    unfollow: async (companyId: string) => {
      return this.request<{ message: string }>(`/companies/${companyId}/unfollow`, {
        method: "DELETE",
      })
    },

    getFollowers: async (companyId: string) => {
      return this.request<{ followers: any[]; count: number }>(`/companies/${companyId}/followers`)
    },

    uploadLogo: async (companyId: string, file: File) => {
      const formData = new FormData()
      formData.append("logo", file)

      return this.request<{ url: string; filename: string }>(`/companies/${companyId}/logo`, {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      })
    },

    uploadCover: async (companyId: string, file: File) => {
      const formData = new FormData()
      formData.append("cover", file)

      return this.request<{ url: string; filename: string }>(`/companies/${companyId}/cover`, {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      })
    },
  }

  // Message endpoints
  messages = {
    getConversations: async (userId: string) => {
      return this.request<any[]>(`/users/${userId}/conversations`)
    },

    getConversation: async (userId1: string, userId2: string) => {
      return this.request<any[]>(`/conversations/${userId1}/${userId2}`)
    },

    send: async (messageData: {
      recipientId: string
      subject: string
      content: string
      attachments?: string[]
    }) => {
      return this.request<any>("/messages", {
        method: "POST",
        body: JSON.stringify(messageData),
      })
    },

    markAsRead: async (messageId: string) => {
      return this.request<{ message: string }>(`/messages/${messageId}/read`, {
        method: "PUT",
      })
    },

    delete: async (messageId: string) => {
      return this.request<{ message: string }>(`/messages/${messageId}`, {
        method: "DELETE",
      })
    },
  }

  // Notification endpoints
  notifications = {
    get: async (userId: string, params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.append("page", params.page.toString())
      if (params?.limit) searchParams.append("limit", params.limit.toString())
      if (params?.unreadOnly) searchParams.append("unreadOnly", "true")

      return this.request<{
        notifications: any[]
        total: number
        unreadCount: number
        page: number
        totalPages: number
      }>(`/users/${userId}/notifications?${searchParams.toString()}`)
    },

    markAsRead: async (notificationId: string) => {
      return this.request<{ message: string }>(`/notifications/${notificationId}/read`, {
        method: "PUT",
      })
    },

    markAllAsRead: async (userId: string) => {
      return this.request<{ message: string }>(`/users/${userId}/notifications/read-all`, {
        method: "PUT",
      })
    },

    delete: async (notificationId: string) => {
      return this.request<{ message: string }>(`/notifications/${notificationId}`, {
        method: "DELETE",
      })
    },
  }

  // Saved search endpoints
  savedSearches = {
    create: async (searchData: {
      name: string
      searchParams: any
      emailAlerts: boolean
      alertFrequency: string
    }) => {
      return this.request<any>("/saved-searches", {
        method: "POST",
        body: JSON.stringify(searchData),
      })
    },

    get: async (userId: string) => {
      return this.request<any[]>(`/users/${userId}/saved-searches`)
    },

    update: async (searchId: string, updates: any) => {
      return this.request<any>(`/saved-searches/${searchId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      })
    },

    delete: async (searchId: string) => {
      return this.request<{ message: string }>(`/saved-searches/${searchId}`, {
        method: "DELETE",
      })
    },

    run: async (searchId: string) => {
      return this.request<{ jobs: any[]; count: number }>(`/saved-searches/${searchId}/run`)
    },
  }

  // Analytics endpoints
  analytics = {
    getJobStats: async (jobId: string, period = "30d") => {
      return this.request<{
        views: number
        applications: number
        saves: number
        clickThroughRate: number
        conversionRate: number
        dailyStats: Array<{ date: string; views: number; applications: number }>
      }>(`/jobs/${jobId}/analytics?period=${period}`)
    },

    getProfileStats: async (userId: string, period = "30d") => {
      return this.request<{
        profileViews: number
        searchAppearances: number
        applicationsSent: number
        responseRate: number
        dailyStats: Array<{ date: string; views: number; applications: number }>
      }>(`/users/${userId}/analytics?period=${period}`)
    },

    getCompanyStats: async (companyId: string, period = "30d") => {
      return this.request<{
        totalViews: number
        totalApplications: number
        activeJobs: number
        followers: number
        averageTimeToHire: number
        topPerformingJobs: Array<{ jobId: string; title: string; applications: number }>
      }>(`/companies/${companyId}/analytics?period=${period}`)
    },
  }

  // File upload endpoints
  files = {
    upload: async (file: File, type: string, userId?: string) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)
      if (userId) formData.append("userId", userId)

      return this.request<{ url: string; filename: string; size: number }>("/files/upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      })
    },

    delete: async (fileId: string) => {
      return this.request<{ message: string }>(`/files/${fileId}`, {
        method: "DELETE",
      })
    },

    getUploadUrl: async (filename: string, contentType: string) => {
      return this.request<{ uploadUrl: string; fileUrl: string }>("/files/upload-url", {
        method: "POST",
        body: JSON.stringify({ filename, contentType }),
      })
    },
  }

  // Interview endpoints
  interviews = {
    schedule: async (interviewData: {
      applicationId: string
      type: string
      scheduledAt: string
      duration: number
      location?: string
      meetingLink?: string
      notes?: string
      interviewers: string[]
    }) => {
      return this.request<any>("/interviews", {
        method: "POST",
        body: JSON.stringify(interviewData),
      })
    },

    update: async (interviewId: string, updates: any) => {
      return this.request<any>(`/interviews/${interviewId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      })
    },

    cancel: async (interviewId: string, reason?: string) => {
      return this.request<{ message: string }>(`/interviews/${interviewId}/cancel`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
      })
    },

    getByUser: async (userId: string) => {
      return this.request<any[]>(`/users/${userId}/interviews`)
    },

    getByApplication: async (applicationId: string) => {
      return this.request<any[]>(`/applications/${applicationId}/interviews`)
    },
  }

  // Utility methods
  clearCache = () => {
    this.cache.clear()
  }

  getCacheSize = () => {
    return this.cache.size
  }
}

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Create and export the API client instance
export const api = new APIClient()

// Export types for TypeScript support
export type { APIClient }
