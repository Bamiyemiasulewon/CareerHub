"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Send, Paperclip, Smile, ImageIcon, FileText, Mic, Calendar, Briefcase, Plus } from "lucide-react"
import { useWebSocket } from "@/lib/websocket"
import { useMessagingStore, useAuthStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"

interface MessageComposerProps {
  conversationId: string
  recipientId?: string
  jobContext?: {
    jobId: string
    jobTitle: string
  }
  placeholder?: string
  className?: string
}

export function MessageComposer({
  conversationId,
  recipientId,
  jobContext,
  placeholder = "Type a message...",
  className,
}: MessageComposerProps) {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const { user } = useAuthStore()
  const { saveDraft, clearDraft, messageDrafts } = useMessagingStore()
  const { sendMessage, startTyping, stopTyping } = useWebSocket()

  // Load draft on mount
  useEffect(() => {
    const draft = messageDrafts[conversationId]
    if (draft) {
      setMessage(draft.content)
      setAttachments(draft.attachments)
    }
  }, [conversationId, messageDrafts])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Handle typing indicators
  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true)
      startTyping(conversationId)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        stopTyping(conversationId)
      }
    }, 2000)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [message, conversationId, isTyping, startTyping, stopTyping])

  // Save draft when message changes
  useEffect(() => {
    if (message.trim() || attachments.length > 0) {
      saveDraft(conversationId, {
        conversationId,
        content: message,
        attachments,
        savedAt: new Date().toISOString(),
      })
    } else {
      clearDraft(conversationId)
    }
  }, [message, attachments, conversationId, saveDraft, clearDraft])

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return
    if (!user || !recipientId) return

    const newMessage: Omit<Message, "id" | "createdAt" | "delivered" | "read"> = {
      conversationId,
      senderId: user.id,
      recipientId,
      content: message.trim(),
      type: "text",
      attachments: [], // TODO: Handle file attachments
      reactions: [],
      edited: false,
      context: jobContext
        ? {
            type: "job-inquiry",
            jobId: jobContext.jobId,
          }
        : undefined,
    }

    sendMessage(newMessage)
    setMessage("")
    setAttachments([])
    clearDraft(conversationId)

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false)
      stopTyping(conversationId)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const insertEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
    textareaRef.current?.focus()
  }

  const handleVoiceRecord = () => {
    // TODO: Implement voice recording
    setIsRecording(!isRecording)
  }

  const insertTemplate = (template: string) => {
    setMessage(template)
    textareaRef.current?.focus()
  }

  const commonTemplates = [
    "Hi! I'm interested in the position you posted.",
    "Thank you for your time. I look forward to hearing from you.",
    "Could we schedule a call to discuss this opportunity?",
    "I'd love to learn more about your company culture.",
    "When would be a good time for an interview?",
  ]

  return (
    <div className={cn("p-4 space-y-3", className)}>
      {/* Job Context Banner */}
      {jobContext && (
        <div className="flex items-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Briefcase className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm text-blue-700">
            Regarding: <strong>{jobContext.jobTitle}</strong>
          </span>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 truncate max-w-32">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-gray-500 hover:text-red-500"
                onClick={() => removeAttachment(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="min-h-[40px] max-h-32 resize-none pr-12"
            rows={1}
          />

          {/* Quick Actions */}
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            {/* Emoji Picker */}
            <DropdownMenu open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <div className="grid grid-cols-8 gap-1">
                  {["😊", "😂", "❤️", "👍", "👎", "😢", "😮", "😡", "🎉", "🔥", "💯", "👏", "🙏", "💪", "✨", "⭐"].map(
                    (emoji) => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </Button>
                    ),
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          {/* Attachment Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-4 w-4 mr-2" />
                Attach File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Send Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleVoiceRecord}>
                <Mic className="h-4 w-4 mr-2" />
                {isRecording ? "Stop Recording" : "Voice Message"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Templates Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileText className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="p-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates</p>
                {commonTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2 whitespace-normal"
                    onClick={() => insertTemplate(template)}
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() && attachments.length === 0}
            size="sm"
            className={cn(
              "h-8 w-8 p-0 transition-all",
              message.trim() || attachments.length > 0 ? "bg-primary hover:bg-primary/90" : "bg-gray-300",
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  )
}
