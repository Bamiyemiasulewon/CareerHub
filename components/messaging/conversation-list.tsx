"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Pin, Archive, VolumeX, Trash2, MessageSquare, Briefcase } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { useAuthStore, useMessagingStore } from "@/lib/store"
import type { Conversation } from "@/lib/types"

interface ConversationListProps {
  conversations: Conversation[]
  searchQuery: string
  onConversationSelect: (conversationId: string) => void
  onlineUsers: Record<string, boolean>
}

export function ConversationList({
  conversations,
  searchQuery,
  onConversationSelect,
  onlineUsers,
}: ConversationListProps) {
  const { user } = useAuthStore()
  const { archiveConversation, muteConversation, pinConversation } = useMessagingStore()

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true

    const otherParticipant = conv.participants.find((p) => p !== user?.id)
    const lastMessage = conv.lastMessage?.content || ""

    return (
      otherParticipant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Sort conversations: pinned first, then by last message time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1

    const aTime = new Date(a.updatedAt).getTime()
    const bTime = new Date(b.updatedAt).getTime()
    return bTime - aTime
  })

  const getOtherParticipantInfo = (conversation: Conversation) => {
    // In a real app, you'd fetch user info from the participants array
    const otherParticipantId = conversation.participants.find((p) => p !== user?.id)
    return {
      id: otherParticipantId,
      displayName: "John Doe", // Mock data
      username: "johndoe",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "job-seeker" as const,
    }
  }

  const handleArchive = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    archiveConversation(conversationId)
  }

  const handleMute = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    muteConversation(conversationId)
  }

  const handlePin = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    pinConversation(conversationId)
  }

  const handleDelete = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement delete conversation
    console.log("Delete conversation:", conversationId)
  }

  const getJobContextBadge = (conversation: Conversation) => {
    if (!conversation.jobContext) return null

    return (
      <Badge variant="outline" className="text-xs">
        <Briefcase className="h-3 w-3 mr-1" />
        Job
      </Badge>
    )
  }

  if (sortedConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations</h3>
        <p className="text-gray-500 text-sm">
          {searchQuery ? "No conversations match your search" : "Start a conversation by messaging someone"}
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {sortedConversations.map((conversation) => {
        const otherParticipant = getOtherParticipantInfo(conversation)
        const isOnline = onlineUsers[otherParticipant.id || ""]
        const lastMessage = conversation.lastMessage

        return (
          <div
            key={conversation.id}
            className={cn(
              "flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors relative",
              conversation.unreadCount > 0 && "bg-blue-50 hover:bg-blue-100",
            )}
            onClick={() => onConversationSelect(conversation.id)}
          >
            {/* Pinned indicator */}
            {conversation.pinned && <Pin className="absolute top-2 right-2 h-3 w-3 text-gray-400" />}

            {/* Avatar with online status */}
            <div className="relative mr-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={otherParticipant.avatar || "/placeholder.svg"} />
                <AvatarFallback>{otherParticipant.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Conversation info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900 truncate">{otherParticipant.displayName}</p>
                  <p className="text-sm text-gray-500">@{otherParticipant.username}</p>
                  {otherParticipant.role === "employer" && (
                    <Badge variant="secondary" className="text-xs">
                      Employer
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {getJobContextBadge(conversation)}
                  {conversation.muted && <VolumeX className="h-3 w-3 text-gray-400" />}
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    "text-sm truncate",
                    conversation.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-500",
                  )}
                >
                  {lastMessage?.content || "No messages yet"}
                </p>
                <p className="text-xs text-gray-400 ml-2">
                  {lastMessage && formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                </p>
              </div>

              {/* Job context info */}
              {conversation.jobContext && (
                <p className="text-xs text-blue-600 mt-1">Re: {conversation.jobContext.jobTitle}</p>
              )}
            </div>

            {/* More options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => handlePin(conversation.id, e)}>
                  <Pin className="h-4 w-4 mr-2" />
                  {conversation.pinned ? "Unpin" : "Pin"} conversation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleMute(conversation.id, e)}>
                  <VolumeX className="h-4 w-4 mr-2" />
                  {conversation.muted ? "Unmute" : "Mute"} conversation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleArchive(conversation.id, e)}>
                  <Archive className="h-4 w-4 mr-2" />
                  {conversation.archived ? "Unarchive" : "Archive"} conversation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleDelete(conversation.id, e)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      })}
    </div>
  )
}
