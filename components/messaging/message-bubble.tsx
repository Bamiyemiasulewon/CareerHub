"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Reply, Copy, Trash2, Edit, Download, ExternalLink, Check, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
}

export function MessageBubble({ message, isOwn, showAvatar = true, showTimestamp = true }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false)

  const handleReaction = (emoji: string) => {
    // TODO: Implement reaction functionality
    console.log("React with:", emoji)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  const handleReply = () => {
    // TODO: Implement reply functionality
    console.log("Reply to message:", message.id)
  }

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit message:", message.id)
  }

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete message:", message.id)
  }

  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border">
            {attachment.type === "image" ? (
              <img
                src={attachment.url || "/placeholder.svg"}
                alt={attachment.filename}
                className="max-w-xs max-h-48 rounded-lg object-cover"
              />
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{attachment.filename}</p>
                  <p className="text-xs text-gray-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null

    const reactionCounts = message.reactions.reduce(
      (acc, reaction) => {
        acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <Badge
            key={emoji}
            variant="secondary"
            className="text-xs cursor-pointer hover:bg-gray-200"
            onClick={() => handleReaction(emoji)}
          >
            {emoji} {count}
          </Badge>
        ))}
      </div>
    )
  }

  const renderJobContext = () => {
    if (!message.context || message.context.type === "general") return null

    return (
      <div className="mb-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
        <p className="text-xs text-blue-700 font-medium">
          {message.context.type === "job-inquiry" && "Job Inquiry"}
          {message.context.type === "application" && "Job Application"}
          {message.context.type === "interview" && "Interview"}
        </p>
        {message.context.jobId && <p className="text-xs text-blue-600">Job ID: {message.context.jobId}</p>}
      </div>
    )
  }

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[80%]", isOwn ? "flex-row-reverse" : "flex-row")}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <Avatar className="h-8 w-8 mr-2 mt-1">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-xs">U</AvatarFallback>
          </Avatar>
        )}

        {/* Message Content */}
        <div
          className={cn("group relative", isOwn ? "mr-2" : "ml-0")}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {/* Job Context */}
          {renderJobContext()}

          {/* Message Bubble */}
          <div
            className={cn(
              "px-4 py-2 rounded-2xl relative",
              isOwn ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-900",
              message.type === "system" && "bg-yellow-50 text-yellow-800 border border-yellow-200",
            )}
          >
            {/* Reply indicator */}
            {message.replyTo && (
              <div className="mb-2 p-2 bg-black/10 rounded-lg text-sm opacity-75">
                <p className="text-xs">Replying to:</p>
                <p className="truncate">Previous message content...</p>
              </div>
            )}

            {/* Message content */}
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

            {/* Edited indicator */}
            {message.edited && <span className="text-xs opacity-75 ml-2">(edited)</span>}

            {/* Attachments */}
            {renderAttachments()}

            {/* Reactions */}
            {renderReactions()}

            {/* Message status (for own messages) */}
            {isOwn && (
              <div className="flex items-center justify-end mt-1 space-x-1">
                {message.delivered ? (
                  message.read ? (
                    <CheckCheck className="h-3 w-3 text-blue-400" />
                  ) : (
                    <CheckCheck className="h-3 w-3 opacity-50" />
                  )
                ) : (
                  <Check className="h-3 w-3 opacity-50" />
                )}
              </div>
            )}
          </div>

          {/* Timestamp */}
          {showTimestamp && (
            <p className={cn("text-xs text-gray-500 mt-1", isOwn ? "text-right" : "text-left")}>
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              {message.readAt && isOwn && <span className="ml-1">• Read</span>}
            </p>
          )}

          {/* Quick reactions (show on hover) */}
          {showReactions && (
            <div
              className={cn(
                "absolute -top-8 flex items-center space-x-1 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-lg z-10",
                isOwn ? "right-0" : "left-0",
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => handleReaction("👍")}
              >
                👍
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => handleReaction("❤️")}
              >
                ❤️
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => handleReaction("😊")}
              >
                😊
              </Button>

              {/* More options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={handleReply}>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </DropdownMenuItem>
                  {isOwn && (
                    <>
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
