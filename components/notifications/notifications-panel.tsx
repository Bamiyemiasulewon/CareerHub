"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  X,
  Bell,
  MessageSquare,
  UserPlus,
  Briefcase,
  Star,
  Settings,
  MoreVertical,
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useUIStore, useNotificationsStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { Notification } from "@/lib/types"

export function NotificationsPanel() {
  const { notificationsPanelOpen, setNotificationsPanelOpen } = useUIStore()
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useNotificationsStore()

  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = notifications.filter((notification) => filter === "all" || !notification.read)

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "connection":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "job-match":
        return <Briefcase className="h-4 w-4 text-purple-500" />
      case "endorsement":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "interview":
        return <Briefcase className="h-4 w-4 text-orange-500" />
      case "application":
        return <Briefcase className="h-4 w-4 text-indigo-500" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  if (!notificationsPanelOpen) return null

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-l border-gray-200 shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setNotificationsPanelOpen(false)} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-100">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
          className="flex-1 rounded-none"
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("unread")}
          className="flex-1 rounded-none"
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Actions */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="text-xs">
            <CheckCheck className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-red-600 hover:text-red-700">
            <Trash2 className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <Bell className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="text-gray-500 text-sm">
              {filter === "unread" ? "You're all caught up!" : "We'll notify you when something happens"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group",
                  !notification.read && "bg-blue-50 hover:bg-blue-100",
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 h-2 w-2 bg-blue-500 rounded-full" />
                )}

                {/* Icon */}
                <div className="flex-shrink-0 mr-3 mt-1">{getNotificationIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={cn("text-sm font-medium text-gray-900", !notification.read && "font-semibold")}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {!notification.read && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Mark as read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
