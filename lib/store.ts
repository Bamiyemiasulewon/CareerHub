"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Message, Conversation, Notification, SearchFilters, UserSearchResult, MessageDraft } from "./types"

// Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  setUser: (user: User) => void
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
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const mockUser: User = {
            id: "user-1",
            username: "johndoe",
            displayName: "John Doe",
            realName: "John Doe",
            email: email,
            avatar: "https://picsum.photos/100/100?random=1",
            bio: "Senior Frontend Developer passionate about creating amazing user experiences",
            role: "job-seeker",
            verified: true,
            premium: false,
            online: true,
            lastSeen: new Date().toISOString(),
            profileComplete: 85,
            createdAt: "2023-01-15T00:00:00Z",
            updatedAt: new Date().toISOString(),
            privacy: {
              profilePublic: true,
              showEmail: false,
              showPhone: false,
              allowMessages: "everyone",
              showOnlineStatus: true,
              showLastSeen: true,
            },
            jobSeekerProfile: {
              availability: "actively-looking",
              salaryExpectation: { min: 80000, max: 120000, currency: "USD" },
              preferredJobTypes: ["full-time", "contract"],
              locationPreferences: {
                remote: true,
                onSite: false,
                hybrid: true,
                locations: ["San Francisco, CA", "New York, NY"],
              },
              skills: [
                { id: "1", name: "React", level: "expert", yearsOfExperience: 5, endorsements: [], verified: true },
                {
                  id: "2",
                  name: "TypeScript",
                  level: "advanced",
                  yearsOfExperience: 4,
                  endorsements: [],
                  verified: true,
                },
                {
                  id: "3",
                  name: "Node.js",
                  level: "intermediate",
                  yearsOfExperience: 3,
                  endorsements: [],
                  verified: false,
                },
              ],
              experience: [
                {
                  id: "1",
                  title: "Senior Frontend Developer",
                  company: "TechCorp Inc.",
                  location: "San Francisco, CA",
                  startDate: "2022-01-01",
                  current: true,
                  description: "Leading frontend development for enterprise applications",
                  achievements: ["Improved app performance by 40%", "Led team of 5 developers"],
                  skills: ["React", "TypeScript", "GraphQL"],
                },
              ],
              education: [
                {
                  id: "1",
                  degree: "Bachelor of Computer Science",
                  school: "Stanford University",
                  location: "Stanford, CA",
                  startDate: "2016-09-01",
                  endDate: "2020-06-01",
                  gpa: "3.8",
                  achievements: ["Magna Cum Laude", "Dean's List"],
                },
              ],
              certifications: [],
              portfolio: [
                {
                  id: "1",
                  title: "E-commerce Platform",
                  description: "Full-stack e-commerce solution built with React and Node.js",
                  type: "link",
                  url: "https://example.com/portfolio/ecommerce",
                  thumbnail: "https://picsum.photos/300/200?random=10",
                  tags: ["React", "Node.js", "MongoDB"],
                  createdAt: "2023-06-01T00:00:00Z",
                },
              ],
              references: [],
              profileViews: 245,
              searchAppearances: 89,
            },
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

      updateProfile: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates, updatedAt: new Date().toISOString() } })
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)

// Messaging Store
interface MessagingState {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  activeConversation: string | null
  typingIndicators: Record<string, Array<{ userId: string; isTyping: boolean }>>
  onlineUsers: Record<string, boolean>
  unreadCount: number
  messageDrafts: Record<string, MessageDraft>

  // Actions
  setActiveConversation: (conversationId: string | null) => void
  addMessage: (message: Message) => void
  updateMessage: (messageId: string, updates: Partial<Message>) => void
  deleteMessage: (messageId: string) => void
  markAsRead: (conversationId: string) => void
  archiveConversation: (conversationId: string) => void
  muteConversation: (conversationId: string) => void
  pinConversation: (conversationId: string) => void
  saveDraft: (conversationId: string, draft: MessageDraft) => void
  clearDraft: (conversationId: string) => void
  setTypingIndicator: (conversationId: string, userId: string, isTyping: boolean) => void
  setUserOnlineStatus: (userId: string, online: boolean) => void
  loadConversations: () => void
}

export const useMessagingStore = create<MessagingState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversation: null,
      typingIndicators: {},
      onlineUsers: {},
      unreadCount: 0,
      messageDrafts: {},

      setActiveConversation: (conversationId) => {
        set({ activeConversation: conversationId })
        if (conversationId) {
          get().markAsRead(conversationId)
        }
      },

      addMessage: (message) => {
        const { messages, conversations } = get()
        const conversationMessages = messages[message.conversationId] || []

        set({
          messages: {
            ...messages,
            [message.conversationId]: [...conversationMessages, message],
          },
        })

        // Update conversation last message
        const updatedConversations = conversations.map((conv) =>
          conv.id === message.conversationId ? { ...conv, lastMessage: message, updatedAt: message.createdAt } : conv,
        )
        set({ conversations: updatedConversations })

        // Update unread count if not active conversation
        if (get().activeConversation !== message.conversationId) {
          const conversation = conversations.find((c) => c.id === message.conversationId)
          if (conversation) {
            const updatedConv = { ...conversation, unreadCount: conversation.unreadCount + 1 }
            set({
              conversations: conversations.map((c) => (c.id === message.conversationId ? updatedConv : c)),
              unreadCount: get().unreadCount + 1,
            })
          }
        }
      },

      updateMessage: (messageId, updates) => {
        const { messages } = get()
        const updatedMessages = { ...messages }

        Object.keys(updatedMessages).forEach((conversationId) => {
          updatedMessages[conversationId] = updatedMessages[conversationId].map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg,
          )
        })

        set({ messages: updatedMessages })
      },

      deleteMessage: (messageId) => {
        const { messages } = get()
        const updatedMessages = { ...messages }

        Object.keys(updatedMessages).forEach((conversationId) => {
          updatedMessages[conversationId] = updatedMessages[conversationId].filter((msg) => msg.id !== messageId)
        })

        set({ messages: updatedMessages })
      },

      markAsRead: (conversationId) => {
        const { conversations, messages } = get()
        const conversation = conversations.find((c) => c.id === conversationId)

        if (conversation && conversation.unreadCount > 0) {
          const updatedConversations = conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
          )

          set({
            conversations: updatedConversations,
            unreadCount: get().unreadCount - conversation.unreadCount,
          })

          // Mark messages as read
          const conversationMessages = messages[conversationId] || []
          const updatedMessages = conversationMessages.map((msg) => ({
            ...msg,
            read: true,
            readAt: new Date().toISOString(),
          }))

          set({
            messages: {
              ...messages,
              [conversationId]: updatedMessages,
            },
          })
        }
      },

      archiveConversation: (conversationId) => {
        const { conversations } = get()
        const updatedConversations = conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, archived: !conv.archived } : conv,
        )
        set({ conversations: updatedConversations })
      },

      muteConversation: (conversationId) => {
        const { conversations } = get()
        const updatedConversations = conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, muted: !conv.muted } : conv,
        )
        set({ conversations: updatedConversations })
      },

      pinConversation: (conversationId) => {
        const { conversations } = get()
        const updatedConversations = conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, pinned: !conv.pinned } : conv,
        )
        set({ conversations: updatedConversations })
      },

      saveDraft: (conversationId, draft) => {
        const { messageDrafts } = get()
        set({
          messageDrafts: {
            ...messageDrafts,
            [conversationId]: draft,
          },
        })
      },

      clearDraft: (conversationId) => {
        const { messageDrafts } = get()
        const { [conversationId]: removed, ...rest } = messageDrafts
        set({ messageDrafts: rest })
      },

      setTypingIndicator: (conversationId, userId, isTyping) => {
        const { typingIndicators } = get()
        const indicators = typingIndicators[conversationId] || []

        if (isTyping) {
          const existingIndex = indicators.findIndex((i) => i.userId === userId)
          if (existingIndex === -1) {
            set({
              typingIndicators: {
                ...typingIndicators,
                [conversationId]: [...indicators, { userId, isTyping }],
              },
            })
          }
        } else {
          set({
            typingIndicators: {
              ...typingIndicators,
              [conversationId]: indicators.filter((i) => i.userId !== userId),
            },
          })
        }
      },

      setUserOnlineStatus: (userId, online) => {
        const { onlineUsers } = get()
        set({
          onlineUsers: {
            ...onlineUsers,
            [userId]: online,
          },
        })
      },

      loadConversations: () => {
        // Mock conversations data
        const mockConversations: Conversation[] = [
          {
            id: "conv-1",
            participants: ["user-1", "user-2"],
            lastMessage: {
              id: "msg-1",
              conversationId: "conv-1",
              senderId: "user-2",
              recipientId: "user-1",
              content: "Hi! I saw your profile and I'm interested in discussing a frontend position at our company.",
              type: "text",
              attachments: [],
              reactions: [],
              edited: false,
              read: false,
              delivered: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              context: {
                type: "job-inquiry",
                jobId: "job-1",
              },
            },
            unreadCount: 1,
            archived: false,
            muted: false,
            pinned: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            jobContext: {
              jobId: "job-1",
              jobTitle: "Senior Frontend Developer",
            },
          },
          {
            id: "conv-2",
            participants: ["user-1", "user-3"],
            lastMessage: {
              id: "msg-2",
              conversationId: "conv-2",
              senderId: "user-1",
              recipientId: "user-3",
              content: "Thanks for the interview opportunity. Looking forward to hearing back from you!",
              type: "text",
              attachments: [],
              reactions: [],
              edited: false,
              read: true,
              delivered: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            },
            unreadCount: 0,
            archived: false,
            muted: false,
            pinned: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
        ]

        const mockMessages: Record<string, Message[]> = {
          "conv-1": [
            {
              id: "msg-1-1",
              conversationId: "conv-1",
              senderId: "user-2",
              recipientId: "user-1",
              content: "Hi John! I came across your profile and I'm really impressed with your React expertise.",
              type: "text",
              attachments: [],
              reactions: [],
              edited: false,
              read: true,
              delivered: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            },
            {
              id: "msg-1-2",
              conversationId: "conv-1",
              senderId: "user-2",
              recipientId: "user-1",
              content:
                "We have an exciting Senior Frontend Developer position that I think would be perfect for you. Would you be interested in learning more?",
              type: "text",
              attachments: [],
              reactions: [{ id: "reaction-1", userId: "user-1", emoji: "👍", createdAt: new Date().toISOString() }],
              edited: false,
              read: true,
              delivered: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
              context: {
                type: "job-inquiry",
                jobId: "job-1",
              },
            },
            {
              id: "msg-1-3",
              conversationId: "conv-1",
              senderId: "user-1",
              recipientId: "user-2",
              content:
                "Hi Sarah! Thank you for reaching out. I'm definitely interested in learning more about the position. Could you share more details about the role and the company?",
              type: "text",
              attachments: [],
              reactions: [],
              edited: false,
              read: true,
              delivered: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
            },
            {
              id: "msg-1-4",
              conversationId: "conv-1",
              senderId: "user-2",
              recipientId: "user-1",
              content: "Hi! I saw your profile and I'm interested in discussing a frontend position at our company.",
              type: "text",
              attachments: [],
              reactions: [],
              edited: false,
              read: false,
              delivered: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              context: {
                type: "job-inquiry",
                jobId: "job-1",
              },
            },
          ],
          "conv-2": [
            {
              id: "msg-2-1",
              conversationId: "conv-2",
              senderId: "user-3",
              recipientId: "user-1",
              content:
                "Hi John, I'd like to schedule an interview for the React Developer position. Are you available this week?",
              type: "text",
              attachments: [],
              reactions: [],
              edited: false,
              read: true,
              delivered: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
              context: {
                type: "interview",
                jobId: "job-2",
              },
            },
            {
              id: "msg-2-2",
              conversationId: "conv-2",
              senderId: "user-1",
              recipientId: "user-3",
              content: "Thanks for the interview opportunity. Looking forward to hearing back from you!",
              type: "text",
              attachments: [],
              reactions: [],
              edited: false,
              read: true,
              delivered: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            },
          ],
        }

        set({
          conversations: mockConversations,
          messages: mockMessages,
          unreadCount: mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
          onlineUsers: {
            "user-2": true,
            "user-3": false,
            "user-4": true,
          },
        })
      },
    }),
    {
      name: "messaging-storage",
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
        messageDrafts: state.messageDrafts,
      }),
    },
  ),
)

// User Discovery Store
interface UserDiscoveryState {
  searchResults: UserSearchResult[]
  searchQuery: string
  searchFilters: SearchFilters
  recentSearches: string[]
  suggestedUsers: User[]
  featuredUsers: User[]
  isSearching: boolean

  // Actions
  setSearchQuery: (query: string) => void
  updateSearchFilters: (filters: Partial<SearchFilters>) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  loadSuggestedUsers: () => void
  loadFeaturedUsers: () => void
}

export const useUserDiscoveryStore = create<UserDiscoveryState>()(
  persist(
    (set, get) => ({
      searchResults: [],
      searchQuery: "",
      searchFilters: {},
      recentSearches: [],
      suggestedUsers: [],
      featuredUsers: [],
      isSearching: false,

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      updateSearchFilters: (filters) => {
        const { searchFilters } = get()
        set({ searchFilters: { ...searchFilters, ...filters } })
      },

      addRecentSearch: (query) => {
        const { recentSearches } = get()
        const filtered = recentSearches.filter((s) => s !== query)
        set({ recentSearches: [query, ...filtered].slice(0, 10) })
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] })
      },

      loadSuggestedUsers: () => {
        const mockSuggestedUsers: User[] = [
          {
            id: "user-4",
            username: "sarahchen",
            displayName: "Sarah Chen",
            realName: "Sarah Chen",
            email: "sarah@example.com",
            avatar: "https://picsum.photos/100/100?random=4",
            bio: "Product Manager at TechStart. Passionate about user experience and product strategy.",
            role: "employer",
            verified: true,
            premium: true,
            online: true,
            lastSeen: new Date().toISOString(),
            profileComplete: 95,
            createdAt: "2023-02-01T00:00:00Z",
            updatedAt: new Date().toISOString(),
            privacy: {
              profilePublic: true,
              showEmail: false,
              showPhone: false,
              allowMessages: "everyone",
              showOnlineStatus: true,
              showLastSeen: true,
            },
            employerProfile: {
              companyName: "TechStart Inc.",
              companySize: "50-100",
              industry: "Technology",
              website: "https://techstart.com",
              description: "We're building the future of work with innovative SaaS solutions.",
              culture: "Fast-paced, collaborative, and innovation-driven environment.",
              benefits: ["Health Insurance", "Remote Work", "Stock Options", "Learning Budget"],
              locations: ["San Francisco, CA", "Remote"],
              foundedYear: 2020,
              socialLinks: {
                linkedin: "https://linkedin.com/company/techstart",
                twitter: "https://twitter.com/techstart",
              },
              jobsPosted: 15,
              successfulHires: 8,
              responseRate: 95,
              averageResponseTime: 4,
            },
          },
          {
            id: "user-5",
            username: "mikejohnson",
            displayName: "Mike Johnson",
            realName: "Michael Johnson",
            email: "mike@example.com",
            avatar: "https://picsum.photos/100/100?random=5",
            bio: "Full-stack developer with 8 years of experience. Love working with React, Node.js, and AWS.",
            role: "job-seeker",
            verified: false,
            premium: false,
            online: false,
            lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            profileComplete: 78,
            createdAt: "2023-03-15T00:00:00Z",
            updatedAt: new Date().toISOString(),
            privacy: {
              profilePublic: true,
              showEmail: false,
              showPhone: false,
              allowMessages: "everyone",
              showOnlineStatus: true,
              showLastSeen: true,
            },
            jobSeekerProfile: {
              availability: "open-to-offers",
              salaryExpectation: { min: 90000, max: 130000, currency: "USD" },
              preferredJobTypes: ["full-time", "contract"],
              locationPreferences: {
                remote: true,
                onSite: true,
                hybrid: true,
                locations: ["Austin, TX", "Remote"],
              },
              skills: [
                {
                  id: "1",
                  name: "JavaScript",
                  level: "expert",
                  yearsOfExperience: 8,
                  endorsements: [],
                  verified: true,
                },
                { id: "2", name: "React", level: "expert", yearsOfExperience: 6, endorsements: [], verified: true },
                {
                  id: "3",
                  name: "Node.js",
                  level: "advanced",
                  yearsOfExperience: 5,
                  endorsements: [],
                  verified: false,
                },
                {
                  id: "4",
                  name: "AWS",
                  level: "intermediate",
                  yearsOfExperience: 3,
                  endorsements: [],
                  verified: false,
                },
              ],
              experience: [],
              education: [],
              certifications: [],
              portfolio: [],
              references: [],
              profileViews: 189,
              searchAppearances: 67,
            },
          },
        ]

        set({ suggestedUsers: mockSuggestedUsers })
      },

      loadFeaturedUsers: () => {
        const mockFeaturedUsers: User[] = [
          {
            id: "user-6",
            username: "alexwilson",
            displayName: "Alex Wilson",
            realName: "Alexandra Wilson",
            email: "alex@example.com",
            avatar: "https://picsum.photos/100/100?random=6",
            bio: "Senior Engineering Manager at Google. Building scalable systems and leading high-performing teams.",
            role: "employer",
            verified: true,
            premium: true,
            online: true,
            lastSeen: new Date().toISOString(),
            profileComplete: 100,
            createdAt: "2022-08-01T00:00:00Z",
            updatedAt: new Date().toISOString(),
            privacy: {
              profilePublic: true,
              showEmail: false,
              showPhone: false,
              allowMessages: "everyone",
              showOnlineStatus: true,
              showLastSeen: true,
            },
            employerProfile: {
              companyName: "Google",
              companySize: "10000+",
              industry: "Technology",
              website: "https://google.com",
              description: "Organizing the world's information and making it universally accessible.",
              culture: "Innovation, collaboration, and making a global impact.",
              benefits: ["Health Insurance", "Stock Options", "Learning Budget", "Flexible Hours"],
              locations: ["Mountain View, CA", "New York, NY", "Remote"],
              foundedYear: 1998,
              socialLinks: {
                linkedin: "https://linkedin.com/company/google",
                twitter: "https://twitter.com/google",
              },
              jobsPosted: 45,
              successfulHires: 32,
              responseRate: 98,
              averageResponseTime: 2,
            },
          },
          {
            id: "user-7",
            username: "emilydavis",
            displayName: "Emily Davis",
            realName: "Emily Davis",
            email: "emily@example.com",
            avatar: "https://picsum.photos/100/100?random=7",
            bio: "UX Designer with a passion for creating intuitive and beautiful user experiences. 6 years in the industry.",
            role: "job-seeker",
            verified: true,
            premium: false,
            online: false,
            lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            profileComplete: 92,
            createdAt: "2023-01-20T00:00:00Z",
            updatedAt: new Date().toISOString(),
            privacy: {
              profilePublic: true,
              showEmail: false,
              showPhone: false,
              allowMessages: "everyone",
              showOnlineStatus: true,
              showLastSeen: true,
            },
            jobSeekerProfile: {
              availability: "actively-looking",
              salaryExpectation: { min: 75000, max: 105000, currency: "USD" },
              preferredJobTypes: ["full-time"],
              locationPreferences: {
                remote: true,
                onSite: false,
                hybrid: true,
                locations: ["Seattle, WA", "Portland, OR", "Remote"],
              },
              skills: [
                { id: "1", name: "Figma", level: "expert", yearsOfExperience: 6, endorsements: [], verified: true },
                {
                  id: "2",
                  name: "User Research",
                  level: "advanced",
                  yearsOfExperience: 5,
                  endorsements: [],
                  verified: true,
                },
                {
                  id: "3",
                  name: "Prototyping",
                  level: "expert",
                  yearsOfExperience: 6,
                  endorsements: [],
                  verified: false,
                },
              ],
              experience: [],
              education: [],
              certifications: [],
              portfolio: [
                {
                  id: "1",
                  title: "Mobile Banking App Redesign",
                  description: "Complete UX overhaul of a mobile banking application",
                  type: "image",
                  url: "https://picsum.photos/400/300?random=20",
                  thumbnail: "https://picsum.photos/200/150?random=20",
                  tags: ["UX Design", "Mobile", "Fintech"],
                  createdAt: "2023-08-01T00:00:00Z",
                },
              ],
              references: [],
              profileViews: 312,
              searchAppearances: 98,
            },
          },
        ]

        set({ featuredUsers: mockFeaturedUsers })
      },
    }),
    {
      name: "user-discovery-storage",
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        searchFilters: state.searchFilters,
      }),
    },
  ),
)

// UI Store
interface UIState {
  chatPanelOpen: boolean
  searchModalOpen: boolean
  notificationsPanelOpen: boolean
  sidebarCollapsed: boolean
  theme: "light" | "dark"

  // Actions
  setChatPanelOpen: (open: boolean) => void
  setSearchModalOpen: (open: boolean) => void
  setNotificationsPanelOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: "light" | "dark") => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      chatPanelOpen: false,
      searchModalOpen: false,
      notificationsPanelOpen: false,
      sidebarCollapsed: false,
      theme: "light",

      setChatPanelOpen: (open) => set({ chatPanelOpen: open }),
      setSearchModalOpen: (open) => set({ searchModalOpen: open }),
      setNotificationsPanelOpen: (open) => set({ notificationsPanelOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "ui-storage",
    },
  ),
)

// Notifications Store
interface NotificationsState {
  notifications: Notification[]
  unreadCount: number

  // Actions
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  deleteNotification: (notificationId: string) => void
  clearAll: () => void
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "notif-1",
          userId: "user-1",
          type: "message",
          title: "New message from Sarah Chen",
          message: "Hi! I saw your profile and I'm interested in discussing a frontend position...",
          data: { conversationId: "conv-1", senderId: "user-2" },
          read: false,
          actionUrl: "/messages/conv-1",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: "notif-2",
          userId: "user-1",
          type: "connection",
          title: "New connection request",
          message: "Mike Johnson wants to connect with you",
          data: { userId: "user-5" },
          read: false,
          actionUrl: "/profile/mikejohnson",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: "notif-3",
          userId: "user-1",
          type: "job-match",
          title: "New job match",
          message: "Senior React Developer at TechCorp matches your profile",
          data: { jobId: "job-3" },
          read: true,
          actionUrl: "/jobs/job-3",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
      ],
      unreadCount: 2,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }

        const { notifications } = get()
        set({
          notifications: [newNotification, ...notifications],
          unreadCount: get().unreadCount + 1,
        })
      },

      markAsRead: (notificationId) => {
        const { notifications } = get()
        const notification = notifications.find((n) => n.id === notificationId)

        if (notification && !notification.read) {
          const updatedNotifications = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))

          set({
            notifications: updatedNotifications,
            unreadCount: get().unreadCount - 1,
          })
        }
      },

      markAllAsRead: () => {
        const { notifications } = get()
        const updatedNotifications = notifications.map((n) => ({ ...n, read: true }))

        set({
          notifications: updatedNotifications,
          unreadCount: 0,
        })
      },

      deleteNotification: (notificationId) => {
        const { notifications } = get()
        const notification = notifications.find((n) => n.id === notificationId)
        const updatedNotifications = notifications.filter((n) => n.id !== notificationId)

        set({
          notifications: updatedNotifications,
          unreadCount: notification && !notification.read ? get().unreadCount - 1 : get().unreadCount,
        })
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 })
      },
    }),
    {
      name: "notifications-storage",
    },
  ),
)
