"use client"

import { useEffect, useRef, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { useAuthStore, useMessagingStore, useNotificationStore } from "./store"
import type {
  Message,
  TypingIndicator,
  Notification,
  WebSocketEvent,
  MessageEvent,
  TypingEvent,
  OnlineStatusEvent,
  NotificationEvent,
} from "./types"

interface WebSocketHook {
  sendMessage: (message: Omit<Message, "id" | "createdAt" | "delivered" | "read">) => void
  startTyping: (conversationId: string) => void
  stopTyping: (conversationId: string) => void
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  isConnected: boolean
}

class WebSocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect() {
    const { user } = useAuthStore.getState()
    if (!user || this.socket?.connected) return

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001", {
      auth: {
        token: localStorage.getItem("auth-token"),
        userId: user.id,
      },
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    })

    this.setupEventListeners()
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  private setupEventListeners() {
    if (!this.socket) return

    // Connection events
    this.socket.on("connect", () => {
      console.log("WebSocket connected")
      this.reconnectAttempts = 0
      this.emitUserOnline()
    })

    this.socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason)
      if (reason === "io server disconnect") {
        // Server initiated disconnect, reconnect manually
        this.handleReconnect()
      }
    })

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error)
      this.handleReconnect()
    })

    // Message events
    this.socket.on("message", (message: Message) => {
      const { addMessage } = useMessagingStore.getState()
      addMessage(message)

      // Show notification if not in active conversation
      const { activeConversation } = useMessagingStore.getState()
      if (activeConversation !== message.conversationId) {
        this.showMessageNotification(message)
      }
    })

    this.socket.on("message-read", ({ messageId, readAt }: { messageId: string; readAt: string }) => {
      const { updateMessage } = useMessagingStore.getState()
      updateMessage(messageId, { read: true, readAt })
    })

    this.socket.on("message-delivered", ({ messageId, deliveredAt }: { messageId: string; deliveredAt: string }) => {
      const { updateMessage } = useMessagingStore.getState()
      updateMessage(messageId, { delivered: true, deliveredAt })
    })

    // Typing events
    this.socket.on("typing", (indicator: TypingIndicator) => {
      const { setTypingIndicator } = useMessagingStore.getState()
      setTypingIndicator(indicator)
    })

    this.socket.on("stop-typing", (indicator: TypingIndicator) => {
      const { removeTypingIndicator } = useMessagingStore.getState()
      removeTypingIndicator(indicator.conversationId, indicator.userId)
    })

    // Online status events
    this.socket.on("user-online", ({ userId }: { userId: string }) => {
      const { setUserOnlineStatus } = useMessagingStore.getState()
      setUserOnlineStatus(userId, true)
    })

    this.socket.on("user-offline", ({ userId }: { userId: string }) => {
      const { setUserOnlineStatus } = useMessagingStore.getState()
      setUserOnlineStatus(userId, false)
    })

    // Notification events
    this.socket.on("notification", (notification: Notification) => {
      const { addNotification } = useNotificationStore.getState()
      addNotification(notification)
      this.showBrowserNotification(notification)
    })

    // Conversation events
    this.socket.on("conversation-updated", ({ conversationId, updates }: { conversationId: string; updates: any }) => {
      const { updateConversation } = useMessagingStore.getState()
      updateConversation(conversationId, updates)
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.connect()
    }, delay)
  }

  private emitUserOnline() {
    const { user } = useAuthStore.getState()
    if (this.socket && user) {
      this.socket.emit("user-online", { userId: user.id })
    }
  }

  private showMessageNotification(message: Message) {
    // Show browser notification if permission granted
    if (Notification.permission === "granted") {
      const { user } = useAuthStore.getState()
      if (message.senderId !== user?.id) {
        new Notification("New Message", {
          body: message.content,
          icon: "/images/careerhub-logo.png",
          tag: message.conversationId,
        })
      }
    }
  }

  private showBrowserNotification(notification: Notification) {
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/images/careerhub-logo.png",
        tag: notification.id,
      })
    }
  }

  // Public methods for emitting events
  sendMessage(message: Omit<Message, "id" | "createdAt" | "delivered" | "read">) {
    if (this.socket) {
      this.socket.emit("send-message", message)
    }
  }

  markMessageAsRead(messageId: string, conversationId: string) {
    if (this.socket) {
      this.socket.emit("mark-read", { messageId, conversationId })
    }
  }

  startTyping(conversationId: string) {
    if (this.socket) {
      const { user } = useAuthStore.getState()
      this.socket.emit("typing", {
        conversationId,
        userId: user?.id,
        isTyping: true,
      })
    }
  }

  stopTyping(conversationId: string) {
    if (this.socket) {
      const { user } = useAuthStore.getState()
      this.socket.emit("stop-typing", {
        conversationId,
        userId: user?.id,
        isTyping: false,
      })
    }
  }

  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit("join-conversation", { conversationId })
    }
  }

  leaveConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit("leave-conversation", { conversationId })
    }
  }

  updateOnlineStatus(online: boolean) {
    if (this.socket) {
      const { user } = useAuthStore.getState()
      this.socket.emit("update-status", {
        userId: user?.id,
        online,
        lastSeen: new Date().toISOString(),
      })
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export function useWebSocket(): WebSocketHook {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>()
  const isConnectedRef = useRef(false)

  const { user } = useAuthStore()
  const { addMessage, setTypingIndicator, setUserOnlineStatus, loadConversations } = useMessagingStore()
  const { addNotification } = useNotificationStore()

  const connect = useCallback(() => {
    if (!user || wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      // In a real app, this would be your WebSocket server URL
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"
      wsRef.current = new WebSocket(`${wsUrl}?userId=${user.id}&token=${user.id}`)

      wsRef.current.onopen = () => {
        console.log("WebSocket connected")
        isConnectedRef.current = true

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "ping" }))
          }
        }, 30000)

        // Load initial data
        loadConversations()
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason)
        isConnectedRef.current = false

        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current)
        }

        // Attempt to reconnect after delay
        if (event.code !== 1000) {
          // Not a normal closure
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, 5000)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error)
      }
    } catch (error) {
      console.error("Failed to connect WebSocket:", error)
    }
  }, [user, addMessage, setTypingIndicator, setUserOnlineStatus, loadConversations])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected")
      wsRef.current = null
    }

    isConnectedRef.current = false
  }, [])

  const handleWebSocketMessage = useCallback(
    (event: WebSocketEvent) => {
      switch (event.type) {
        case "message":
          const messageEvent = event as MessageEvent
          addMessage(messageEvent.data)

          // Add notification if message is not from current user
          if (messageEvent.data.senderId !== user?.id) {
            addNotification({
              userId: user?.id || "",
              type: "message",
              title: "New message",
              message: messageEvent.data.content,
              data: {
                conversationId: messageEvent.data.conversationId,
                senderId: messageEvent.data.senderId,
              },
              read: false,
              actionUrl: `/messages/${messageEvent.data.conversationId}`,
            })
          }
          break

        case "typing":
          const typingEvent = event as TypingEvent
          setTypingIndicator(typingEvent.data.conversationId, typingEvent.data.userId, typingEvent.data.isTyping)
          break

        case "online-status":
          const statusEvent = event as OnlineStatusEvent
          setUserOnlineStatus(statusEvent.data.userId, statusEvent.data.online)
          break

        case "notification":
          const notificationEvent = event as NotificationEvent
          addNotification(notificationEvent.data)
          break

        case "pong":
          // Heartbeat response
          break

        default:
          console.log("Unknown WebSocket event type:", event.type)
      }
    },
    [user, addMessage, setTypingIndicator, setUserOnlineStatus, addNotification],
  )

  const sendMessage = useCallback(
    (message: Omit<Message, "id" | "createdAt" | "delivered" | "read">) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const fullMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          delivered: false,
          read: false,
        }

        wsRef.current.send(
          JSON.stringify({
            type: "message",
            data: fullMessage,
            timestamp: new Date().toISOString(),
          }),
        )

        // Optimistically add message to local state
        addMessage(fullMessage)
      } else {
        // Queue message for when connection is restored
        console.warn("WebSocket not connected, message queued")
        // In a real app, you'd implement message queuing
      }
    },
    [addMessage],
  )

  const startTyping = useCallback(
    (conversationId: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && user) {
        wsRef.current.send(
          JSON.stringify({
            type: "typing",
            data: {
              conversationId,
              userId: user.id,
              isTyping: true,
            },
            timestamp: new Date().toISOString(),
          }),
        )
      }
    },
    [user],
  )

  const stopTyping = useCallback(
    (conversationId: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && user) {
        wsRef.current.send(
          JSON.stringify({
            type: "typing",
            data: {
              conversationId,
              userId: user.id,
              isTyping: false,
            },
            timestamp: new Date().toISOString(),
          }),
        )
      }
    },
    [user],
  )

  const joinConversation = useCallback(
    (conversationId: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && user) {
        wsRef.current.send(
          JSON.stringify({
            type: "join-conversation",
            data: { conversationId, userId: user.id },
            timestamp: new Date().toISOString(),
          }),
        )
      }
    },
    [user],
  )

  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && user) {
        wsRef.current.send(
          JSON.stringify({
            type: "leave-conversation",
            data: { conversationId, userId: user.id },
            timestamp: new Date().toISOString(),
          }),
        )
      }
    },
    [user],
  )

  // Connect when user is authenticated
  useEffect(() => {
    if (user) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [user, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    sendMessage,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
    isConnected: isConnectedRef.current,
  }
}

// Mock WebSocket server simulation for development
export class MockWebSocketServer {
  private clients: Map<string, WebSocket> = new Map()
  private conversations: Map<string, Set<string>> = new Map()

  constructor() {
    // Simulate other users being online
    setTimeout(() => {
      this.simulateUserActivity()
    }, 2000)
  }

  private simulateUserActivity() {
    // Simulate typing indicators
    setInterval(() => {
      const mockTyping = Math.random() > 0.8
      if (mockTyping) {
        this.broadcastToConversation("conv-1", {
          type: "typing",
          data: {
            conversationId: "conv-1",
            userId: "user-2",
            isTyping: true,
          },
          timestamp: new Date().toISOString(),
        })

        // Stop typing after 2 seconds
        setTimeout(() => {
          this.broadcastToConversation("conv-1", {
            type: "typing",
            data: {
              conversationId: "conv-1",
              userId: "user-2",
              isTyping: false,
            },
            timestamp: new Date().toISOString(),
          })
        }, 2000)
      }
    }, 10000)

    // Simulate online status changes
    setInterval(() => {
      const users = ["user-2", "user-3", "user-4", "user-5"]
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const online = Math.random() > 0.3

      this.broadcast({
        type: "online-status",
        data: {
          userId: randomUser,
          online,
          lastSeen: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      })
    }, 30000)
  }

  private broadcastToConversation(conversationId: string, message: WebSocketEvent) {
    const participants = this.conversations.get(conversationId)
    if (participants) {
      participants.forEach((userId) => {
        const client = this.clients.get(userId)
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message))
        }
      })
    }
  }

  private broadcast(message: WebSocketEvent) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }
}
