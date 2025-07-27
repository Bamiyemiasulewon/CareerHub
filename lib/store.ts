import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { subscribeWithSelector } from "zustand/middleware"

// Types
interface User {
  id: string
  email: string
  name: string
  role: "job-seeker" | "employer"
  avatar?: string
  username?: string
  bio?: string
  location?: string
  skills?: string[]
  experience?: string
  education?: string
  website?: string
  linkedin?: string
  github?: string
  isOnline?: boolean
  lastSeen?: Date
}

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "remote"
  salary?: string
  description: string
  requirements: string[]
  benefits?: string[]
  postedAt: Date
  expiresAt?: Date
  applicants?: number
  status: "active" | "closed" | "draft"
  companyLogo?: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  type: "text" | "file" | "image"
  fileUrl?: string
  fileName?: string
  reactions?: { emoji: string; userId: string }[]
}

interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: Date
  type: "direct" | "group"
  name?: string
  avatar?: string
}

interface Notification {
  id: string
  userId: string
  type: "message" | "job_application" | "job_match" | "system"
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
  metadata?: Record<string, any>
}

// Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: (user) =>
      set((state) => {
        state.user = user
        state.isAuthenticated = true
        state.isLoading = false
      }),
    logout: () =>
      set((state) => {
        state.user = null
        state.isAuthenticated = false
        state.isLoading = false
      }),
    updateUser: (updates) =>
      set((state) => {
        if (state.user) {
          Object.assign(state.user, updates)
        }
      }),
    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),
  })),
)

// Job Store
interface JobState {
  jobs: Job[]
  filteredJobs: Job[]
  searchQuery: string
  filters: {
    location: string
    type: string[]
    salary: string
    company: string
  }
  isLoading: boolean
  currentJob: Job | null
  applications: string[] // job IDs
  savedJobs: string[] // job IDs
  setJobs: (jobs: Job[]) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<JobState["filters"]>) => void
  setCurrentJob: (job: Job | null) => void
  applyToJob: (jobId: string) => void
  saveJob: (jobId: string) => void
  unsaveJob: (jobId: string) => void
  searchJobs: () => void
  setLoading: (loading: boolean) => void
}

export const useJobStore = create<JobState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      jobs: [],
      filteredJobs: [],
      searchQuery: "",
      filters: {
        location: "",
        type: [],
        salary: "",
        company: "",
      },
      isLoading: false,
      currentJob: null,
      applications: [],
      savedJobs: [],
      setJobs: (jobs) =>
        set((state) => {
          state.jobs = jobs
          state.filteredJobs = jobs
        }),
      setSearchQuery: (query) =>
        set((state) => {
          state.searchQuery = query
        }),
      setFilters: (filters) =>
        set((state) => {
          Object.assign(state.filters, filters)
        }),
      setCurrentJob: (job) =>
        set((state) => {
          state.currentJob = job
        }),
      applyToJob: (jobId) =>
        set((state) => {
          if (!state.applications.includes(jobId)) {
            state.applications.push(jobId)
          }
        }),
      saveJob: (jobId) =>
        set((state) => {
          if (!state.savedJobs.includes(jobId)) {
            state.savedJobs.push(jobId)
          }
        }),
      unsaveJob: (jobId) =>
        set((state) => {
          state.savedJobs = state.savedJobs.filter((id) => id !== jobId)
        }),
      searchJobs: () =>
        set((state) => {
          const { searchQuery, filters, jobs } = get()
          let filtered = jobs

          // Search by query
          if (searchQuery) {
            filtered = filtered.filter(
              (job) =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          }

          // Filter by location
          if (filters.location) {
            filtered = filtered.filter((job) => job.location.toLowerCase().includes(filters.location.toLowerCase()))
          }

          // Filter by type
          if (filters.type.length > 0) {
            filtered = filtered.filter((job) => filters.type.includes(job.type))
          }

          // Filter by company
          if (filters.company) {
            filtered = filtered.filter((job) => job.company.toLowerCase().includes(filters.company.toLowerCase()))
          }

          state.filteredJobs = filtered
        }),
      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading
        }),
    })),
  ),
)

// Messaging Store
interface MessagingState {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  activeConversation: string | null
  isTyping: Record<string, boolean>
  onlineUsers: string[]
  setConversations: (conversations: Conversation[]) => void
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessage: (conversationId: string, message: Message) => void
  setActiveConversation: (conversationId: string | null) => void
  setTyping: (conversationId: string, isTyping: boolean) => void
  setOnlineUsers: (userIds: string[]) => void
  markAsRead: (conversationId: string, messageId: string) => void
  addReaction: (conversationId: string, messageId: string, emoji: string, userId: string) => void
}

export const useMessagingStore = create<MessagingState>()(
  immer((set) => ({
    conversations: [],
    messages: {},
    activeConversation: null,
    isTyping: {},
    onlineUsers: [],
    setConversations: (conversations) =>
      set((state) => {
        state.conversations = conversations
      }),
    setMessages: (conversationId, messages) =>
      set((state) => {
        state.messages[conversationId] = messages
      }),
    addMessage: (conversationId, message) =>
      set((state) => {
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = []
        }
        state.messages[conversationId].push(message)

        // Update conversation last message
        const conversation = state.conversations.find((c) => c.id === conversationId)
        if (conversation) {
          conversation.lastMessage = message
          conversation.updatedAt = message.timestamp
          if (message.senderId !== useAuthStore.getState().user?.id) {
            conversation.unreadCount += 1
          }
        }
      }),
    setActiveConversation: (conversationId) =>
      set((state) => {
        state.activeConversation = conversationId
      }),
    setTyping: (conversationId, isTyping) =>
      set((state) => {
        state.isTyping[conversationId] = isTyping
      }),
    setOnlineUsers: (userIds) =>
      set((state) => {
        state.onlineUsers = userIds
      }),
    markAsRead: (conversationId, messageId) =>
      set((state) => {
        const messages = state.messages[conversationId]
        if (messages) {
          const message = messages.find((m) => m.id === messageId)
          if (message) {
            message.read = true
          }
        }

        // Update conversation unread count
        const conversation = state.conversations.find((c) => c.id === conversationId)
        if (conversation && conversation.unreadCount > 0) {
          conversation.unreadCount -= 1
        }
      }),
    addReaction: (conversationId, messageId, emoji, userId) =>
      set((state) => {
        const messages = state.messages[conversationId]
        if (messages) {
          const message = messages.find((m) => m.id === messageId)
          if (message) {
            if (!message.reactions) {
              message.reactions = []
            }

            // Remove existing reaction from this user
            message.reactions = message.reactions.filter((r) => r.userId !== userId)

            // Add new reaction
            message.reactions.push({ emoji, userId })
          }
        }
      }),
  })),
)

// Notifications Store
interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  removeNotification: (notificationId: string) => void
  setLoading: (loading: boolean) => void
}

export const useNotificationsStore = create<NotificationsState>()(
  immer((set) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    setNotifications: (notifications) =>
      set((state) => {
        state.notifications = notifications
        state.unreadCount = notifications.filter((n) => !n.read).length
      }),
    addNotification: (notification) =>
      set((state) => {
        state.notifications.unshift(notification)
        if (!notification.read) {
          state.unreadCount += 1
        }
      }),
    markAsRead: (notificationId) =>
      set((state) => {
        const notification = state.notifications.find((n) => n.id === notificationId)
        if (notification && !notification.read) {
          notification.read = true
          state.unreadCount -= 1
        }
      }),
    markAllAsRead: () =>
      set((state) => {
        state.notifications.forEach((n) => (n.read = true))
        state.unreadCount = 0
      }),
    removeNotification: (notificationId) =>
      set((state) => {
        const index = state.notifications.findIndex((n) => n.id === notificationId)
        if (index !== -1) {
          const notification = state.notifications[index]
          if (!notification.read) {
            state.unreadCount -= 1
          }
          state.notifications.splice(index, 1)
        }
      }),
    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),
  })),
)

// UI Store
interface UIState {
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  searchModalOpen: boolean
  notificationsOpen: boolean
  messagesOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: "light" | "dark" | "system") => void
  setSearchModalOpen: (open: boolean) => void
  setNotificationsOpen: (open: boolean) => void
  setMessagesOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    sidebarOpen: true,
    theme: "system",
    searchModalOpen: false,
    notificationsOpen: false,
    messagesOpen: false,
    setSidebarOpen: (open) =>
      set((state) => {
        state.sidebarOpen = open
      }),
    setTheme: (theme) =>
      set((state) => {
        state.theme = theme
      }),
    setSearchModalOpen: (open) =>
      set((state) => {
        state.searchModalOpen = open
      }),
    setNotificationsOpen: (open) =>
      set((state) => {
        state.notificationsOpen = open
      }),
    setMessagesOpen: (open) =>
      set((state) => {
        state.messagesOpen = open
      }),
    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen
      }),
  })),
)

// User Discovery Store
interface UserDiscoveryState {
  users: User[]
  filteredUsers: User[]
  searchQuery: string
  filters: {
    role: string
    location: string
    skills: string[]
    experience: string
  }
  isLoading: boolean
  suggestedUsers: User[]
  recentSearches: string[]
  setUsers: (users: User[]) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<UserDiscoveryState["filters"]>) => void
  searchUsers: () => void
  setSuggestedUsers: (users: User[]) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  setLoading: (loading: boolean) => void
}

export const useUserDiscoveryStore = create<UserDiscoveryState>()(
  immer((set, get) => ({
    users: [],
    filteredUsers: [],
    searchQuery: "",
    filters: {
      role: "",
      location: "",
      skills: [],
      experience: "",
    },
    isLoading: false,
    suggestedUsers: [],
    recentSearches: [],
    setUsers: (users) =>
      set((state) => {
        state.users = users
        state.filteredUsers = users
      }),
    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query
      }),
    setFilters: (filters) =>
      set((state) => {
        Object.assign(state.filters, filters)
      }),
    searchUsers: () =>
      set((state) => {
        const { searchQuery, filters, users } = get()
        let filtered = users

        // Search by query
        if (searchQuery) {
          filtered = filtered.filter(
            (user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.skills?.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
          )
        }

        // Filter by role
        if (filters.role) {
          filtered = filtered.filter((user) => user.role === filters.role)
        }

        // Filter by location
        if (filters.location) {
          filtered = filtered.filter((user) => user.location?.toLowerCase().includes(filters.location.toLowerCase()))
        }

        // Filter by skills
        if (filters.skills.length > 0) {
          filtered = filtered.filter((user) =>
            user.skills?.some((skill) =>
              filters.skills.some((filterSkill) => skill.toLowerCase().includes(filterSkill.toLowerCase())),
            ),
          )
        }

        // Filter by experience
        if (filters.experience) {
          filtered = filtered.filter((user) =>
            user.experience?.toLowerCase().includes(filters.experience.toLowerCase()),
          )
        }

        state.filteredUsers = filtered
      }),
    setSuggestedUsers: (users) =>
      set((state) => {
        state.suggestedUsers = users
      }),
    addRecentSearch: (query) =>
      set((state) => {
        if (query.trim() && !state.recentSearches.includes(query)) {
          state.recentSearches.unshift(query)
          // Keep only last 10 searches
          if (state.recentSearches.length > 10) {
            state.recentSearches = state.recentSearches.slice(0, 10)
          }
        }
      }),
    clearRecentSearches: () =>
      set((state) => {
        state.recentSearches = []
      }),
    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),
  })),
)

// Aliases for backward compatibility
export const useNotificationStore = useNotificationsStore

// Subscribe to auth changes to clear other stores on logout
useAuthStore.subscribe(
  (state) => state.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated) {
      useJobStore.getState().setJobs([])
      useMessagingStore.setState({
        conversations: [],
        messages: {},
        activeConversation: null,
        isTyping: {},
        onlineUsers: [],
      })
      useNotificationsStore.getState().setNotifications([])
      useUserDiscoveryStore.getState().setUsers([])
    }
  },
)
