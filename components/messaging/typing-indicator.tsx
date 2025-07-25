"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface TypingUser {
  id: string
  name: string
  avatar?: string
}

interface TypingIndicatorProps {
  users: TypingUser[]
  className?: string
}

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
  if (users.length === 0) return null

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].name} is typing...`
    } else if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing...`
    } else {
      return `${users[0].name} and ${users.length - 1} others are typing...`
    }
  }

  return (
    <div className={cn("flex items-center space-x-2 p-2", className)}>
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-white">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">{getTypingText()}</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
