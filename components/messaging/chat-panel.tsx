"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, Phone, Video, MoreVertical, Search, MessageSquare, Minimize2, Maximize2 } from "lucide-react"
import { useMessagingStore, useAuthStore, useUIStore } from "@/lib/store"
import { useWebSocket } from "@/lib/websocket"
import { MessageBubble } from "./message-bubble"
import { ConversationList } from "./conversation-list"
import { TypingIndicator } from "./typing-indicator"
import { MessageComposer } from "./message-composer"
import { cn } from "@/lib/utils"

export function ChatPanel() {
  const { chatPanelOpen, setChatPanelOpen } = useUIStore()
  const {
    conversations,
    activeConversation,
    messages,
    setActiveConversation,
    typingIndicators,
    onlineUsers,
    unreadCount,
  } = useMessagingStore()
  const { user } = useAuthStore()
  const { joinConversation, leaveConversation } = useWebSocket()

  const [isMinimized, setIsMinimized] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find((conv) => conv.id === activeConversation)
  const conversationMessages = activeConversation ? messages[activeConversation] || [] : []
  const conversationTyping = activeConversation ? typingIndicators[activeConversation] || [] : []

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationMessages])

  // Join/leave conversations when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      joinConversation(activeConversation)
      return () => leaveConversation(activeConversation)
    }
  }, [activeConversation, joinConversation, leaveConversation])

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId)
  }

  const handleBackToList = () => {
    setActiveConversation(null)
  }

  const getOtherParticipant = (conversation: any) => {
    return conversation.participants.find((p: any) => p.id !== user?.id)
  }

  if (!chatPanelOpen) return null

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-xl z-50 transition-all duration-300",
        isMinimized ? "w-80" : "w-96 lg:w-[28rem]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-gray-900">Messages</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 p-0">
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setChatPanelOpen(false)} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {!activeConversation ? (
            // Conversation List View
            <div className="flex flex-col h-full">
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                <ConversationList
                  conversations={conversations}
                  searchQuery={searchQuery}
                  onConversationSelect={handleConversationSelect}
                  onlineUsers={onlineUsers}
                />
              </ScrollArea>
            </div>
          ) : (
            // Active Conversation View
            <div className="flex flex-col h-full">
              {/* Conversation Header */}
              {activeConv && (
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" onClick={handleBackToList} className="h-8 w-8 p-0 lg:hidden">
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={getOtherParticipant(activeConv)?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{getOtherParticipant(activeConv)?.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {onlineUsers[getOtherParticipant(activeConv)?.id] && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getOtherParticipant(activeConv)?.displayName}</p>
                        <p className="text-sm text-gray-500">@{getOtherParticipant(activeConv)?.username}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversationMessages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.senderId === user?.id}
                      showAvatar={message.senderId !== user?.id}
                    />
                  ))}

                  {/* Typing Indicator */}
                  {conversationTyping.length > 0 && (
                    <TypingIndicator
                      users={conversationTyping.map((t) => ({
                        id: t.userId,
                        name: "User", // You'd get this from user data
                        avatar: "",
                      }))}
                    />
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Composer */}
              {activeConversation && (
                <div className="border-t border-gray-100">
                  <MessageComposer
                    conversationId={activeConversation}
                    recipientId={getOtherParticipant(activeConv)?.id}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
