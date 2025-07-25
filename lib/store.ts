import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "jobseeker" | "employer"
  username?: string
}

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary?: string
  description: string
  requirements: string[]
  benefits: string[]
  postedAt: string
  applicationDeadline?: string
  isRemote: boolean
  experienceLevel: string
}

interface Notification {
  id: string
  type: "job_match" | "application_update" | "message" | "system"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
  type: "text" | "file" | "image"
  attachments?: Array<{
    name: string
    url: string
    type: string
  }>
}

interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

// Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: Partial<User> & { password: string }) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // Mock login - replace with actual API call
          const mockUser: User = {
            id: "1",
            name: "John Doe",
            email,
            role: "jobseeker",
            username: "johndoe",
            avatar: "/placeholder-user.jpg",
          }
          set({ user: mockUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      register: async (userData) => {
        set({ isLoading: true })
        try {
          // Mock registration - replace with actual API call
          const newUser: User = {
            id: Date.now().toString(),
            name: userData.name || "",
            email: userData.email || "",
            role: userData.role || "jobseeker",
            username: userData.username,
            avatar: "/placeholder-user.jpg",
          }
          set({ user: newUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      updateProfile: async (userData) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...userData } })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)

// Job Store
interface JobState {
  jobs: Job[]
  savedJobs: string[]
  appliedJobs: string[]
  isLoading: boolean
  searchQuery: string
  filters: {
    location: string
    type: string
    salary: string
    remote: boolean
    experienceLevel: string
  }
  fetchJobs: () => Promise<void>
  searchJobs: (query: string) => Promise<void>
  saveJob: (jobId: string) => void
  unsaveJob: (jobId: string) => void
  applyToJob: (jobId: string) => Promise<void>
  setFilters: (filters: Partial<JobState["filters"]>) => void
  setSearchQuery: (query: string) => void
}

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: [],
      savedJobs: [],
      appliedJobs: [],
      isLoading: false,
      searchQuery: "",
      filters: {
        location: "",
        type: "",
        salary: "",
        remote: false,
        experienceLevel: "",
      },
      fetchJobs: async () => {
        set({ isLoading: true })
        try {
          // Mock jobs data
          const mockJobs: Job[] = [
            {
              id: "1",
              title: "Senior Frontend Developer",
              company: "TechCorp",
              location: "San Francisco, CA",
              type: "Full-time",
              salary: "$120,000 - $150,000",
              description: "We are looking for a senior frontend developer...",
              requirements: ["React", "TypeScript", "5+ years experience"],
              benefits: ["Health insurance", "Remote work", "401k"],
              postedAt: "2024-01-15",
              isRemote: true,
              experienceLevel: "Senior",
            },
            {
              id: "2",
              title: "Product Manager",
              company: "StartupXYZ",
              location: "New York, NY",
              type: "Full-time",
              salary: "$100,000 - $130,000",
              description: "Join our product team...",
              requirements: ["Product management", "Agile", "3+ years experience"],
              benefits: ["Equity", "Flexible hours", "Health insurance"],
              postedAt: "2024-01-14",
              isRemote: false,
              experienceLevel: "Mid-level",
            },
          ]
          set({ jobs: mockJobs, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      searchJobs: async (query: string) => {
        set({ searchQuery: query, isLoading: true })
        // Mock search - filter existing jobs
        const { jobs } = get()
        const filteredJobs = jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(query.toLowerCase()) ||
            job.company.toLowerCase().includes(query.toLowerCase()),
        )
        set({ jobs: filteredJobs, isLoading: false })
      },
      saveJob: (jobId: string) => {
        const { savedJobs } = get()
        if (!savedJobs.includes(jobId)) {
          set({ savedJobs: [...savedJobs, jobId] })
        }
      },
      unsaveJob: (jobId: string) => {
        const { savedJobs } = get()
        set({ savedJobs: savedJobs.filter((id) => id !== jobId) })
      },
      applyToJob: async (jobId: string) => {
        const { appliedJobs } = get()
        if (!appliedJobs.includes(jobId)) {
          set({ appliedJobs: [...appliedJobs, jobId] })
        }
      },
      setFilters: (newFilters) => {
        const { filters } = get()
        set({ filters: { ...filters, ...newFilters } })
      },
      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },
    }),
    {
      name: "job-storage",
      partialize: (state) => ({
        savedJobs: state.savedJobs,
        appliedJobs: state.appliedJobs,
        filters: state.filters,
        searchQuery: state.searchQuery,
      }),
    },
  ),
)

// Notification Store
interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
  removeNotification: (notificationId: string) => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      fetchNotifications: async () => {
        set({ isLoading: true })
        try {
          // Mock notifications
          const mockNotifications: Notification[] = [
            {
              id: "1",
              type: "job_match",
              title: "New Job Match",
              message: "A new job matching your profile is available",
              read: false,
              createdAt: new Date().toISOString(),
              actionUrl: "/jobs/1",
            },
            {
              id: "2",
              type: "application_update",
              title: "Application Update",
              message: "Your application for Frontend Developer has been reviewed",
              read: false,
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              actionUrl: "/dashboard",
            },
          ]
          const unreadCount = mockNotifications.filter((n) => !n.read).length
          set({ notifications: mockNotifications, unreadCount, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      markAsRead: (notificationId: string) => {
        const { notifications } = get()
        const updatedNotifications = notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        )
        const unreadCount = updatedNotifications.filter((n) => !n.read).length
        set({ notifications: updatedNotifications, unreadCount })
      },
      markAllAsRead: () => {
        const { notifications } = get()
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          read: true,
        }))
        set({ notifications: updatedNotifications, unreadCount: 0 })
      },
      addNotification: (notificationData) => {
        const { notifications } = get()
        const newNotification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        const updatedNotifications = [newNotification, ...notifications]
        const unreadCount = updatedNotifications.filter((n) => !n.read).length
        set({ notifications: updatedNotifications, unreadCount })
      },
      removeNotification: (notificationId: string) => {
        const { notifications } = get()
        const updatedNotifications = notifications.filter((n) => n.id !== notificationId)
        const unreadCount = updatedNotifications.filter((n) => !n.read).length
        set({ notifications: updatedNotifications, unreadCount })
      },
    }),
    {
      name: "notification-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    },
  ),
)

// Messaging Store
interface MessagingState {
  conversations: Conversation[]
  messages: { [conversationId: string]: Message[] }
  activeConversation: string | null
  isLoading: boolean
  fetchConversations: () => Promise<void>
  fetchMessages: (conversationId: string) => Promise<void>
  sendMessage: (conversationId: string, content: string, type?: Message["type"]) => Promise<void>
  markMessagesAsRead: (conversationId: string) => void
  setActiveConversation: (conversationId: string | null) => void
  startConversation: (userId: string) => Promise<string>
}

export const useMessagingStore = create<MessagingState>()((set, get) => ({
  conversations: [],
  messages: {},
  activeConversation: null,
  isLoading: false,
  fetchConversations: async () => {
    set({ isLoading: true })
    try {
      // Mock conversations
      const mockConversations: Conversation[] = [
        {
          id: "1",
          participants: [
            { id: "1", name: "John Doe", email: "john@example.com", role: "jobseeker" },
            { id: "2", name: "Jane Smith", email: "jane@example.com", role: "employer" },
          ],
          lastMessage: {
            id: "1",
            senderId: "2",
            receiverId: "1",
            content: "Thanks for your application!",
            timestamp: new Date().toISOString(),
            read: false,
            type: "text",
          },
          unreadCount: 1,
          updatedAt: new Date().toISOString(),
        },
      ]
      set({ conversations: mockConversations, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  fetchMessages: async (conversationId: string) => {
    const { messages } = get()
    if (messages[conversationId]) return

    try {
      // Mock messages
      const mockMessages: Message[] = [
        {
          id: "1",
          senderId: "2",
          receiverId: "1",
          content: "Hi! I saw your application for the Frontend Developer position.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true,
          type: "text",
        },
        {
          id: "2",
          senderId: "1",
          receiverId: "2",
          content: "Thank you for reaching out! I'm very interested in the position.",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          read: true,
          type: "text",
        },
        {
          id: "3",
          senderId: "2",
          receiverId: "1",
          content: "Thanks for your application!",
          timestamp: new Date().toISOString(),
          read: false,
          type: "text",
        },
      ]
      set({ messages: { ...messages, [conversationId]: mockMessages } })
    } catch (error) {
      throw error
    }
  },
  sendMessage: async (conversationId: string, content: string, type = "text") => {
    const { messages } = get()
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "1", // Current user
      receiverId: "2", // Other participant
      content,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    }

    const conversationMessages = messages[conversationId] || []
    set({
      messages: {
        ...messages,
        [conversationId]: [...conversationMessages, newMessage],
      },
    })
  },
  markMessagesAsRead: (conversationId: string) => {
    const { messages, conversations } = get()
    const conversationMessages = messages[conversationId] || []
    const updatedMessages = conversationMessages.map((msg) => ({ ...msg, read: true }))
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
    )

    set({
      messages: { ...messages, [conversationId]: updatedMessages },
      conversations: updatedConversations,
    })
  },
  setActiveConversation: (conversationId: string | null) => {
    set({ activeConversation: conversationId })
  },
  startConversation: async (userId: string) => {
    const conversationId = `conv_${Date.now()}`
    const newConversation: Conversation = {
      id: conversationId,
      participants: [
        { id: "1", name: "Current User", email: "current@example.com", role: "jobseeker" },
        { id: userId, name: "Other User", email: "other@example.com", role: "employer" },
      ],
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    }

    const { conversations } = get()
    set({ conversations: [...conversations, newConversation] })
    return conversationId
  },
}))
