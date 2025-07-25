"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  Briefcase,
  Users,
  PlusCircle,
  Menu,
  X,
} from "lucide-react"
import { useAuthStore, useUIStore, useMessagingStore, useNotificationsStore, useUserDiscoveryStore } from "@/lib/store"
import { UserSearchModal } from "@/components/user-search/user-search-modal"
import { ChatPanel } from "@/components/messaging/chat-panel"
import { NotificationsPanel } from "@/components/notifications/notifications-panel"

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const {
    chatPanelOpen,
    setChatPanelOpen,
    searchModalOpen,
    setSearchModalOpen,
    notificationsPanelOpen,
    setNotificationsPanelOpen,
  } = useUIStore()
  const { unreadCount: messageUnreadCount } = useMessagingStore()
  const { unreadCount: notificationUnreadCount } = useNotificationsStore()
  const { loadSuggestedUsers, loadFeaturedUsers } = useUserDiscoveryStore()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Load user discovery data on mount
  useEffect(() => {
    loadSuggestedUsers()
    loadFeaturedUsers()
  }, [loadSuggestedUsers, loadFeaturedUsers])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchModalOpen(true)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleProfileClick = () => {
    if (user) {
      router.push(`/profile/@${user.username}`)
    }
  }

  const navigation = [
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Companies", href: "/companies", icon: Users },
    { name: "People", href: "/people", icon: Users },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/images/careerhub-logo.png"
                  alt="CareerHub"
                  className="h-8 w-8"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=CH"
                  }}
                />
                <span className="text-xl font-bold text-gray-900">CareerHub</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search people, jobs, companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  {/* Post Job Button (for employers) */}
                  {(user.role === "employer" || user.role === "both") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/post-job")}
                      className="hidden md:flex items-center space-x-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Post Job</span>
                    </Button>
                  )}

                  {/* Search Button (Mobile) */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchModalOpen(true)}
                    className="md:hidden h-9 w-9 p-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>

                  {/* Messages */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setChatPanelOpen(!chatPanelOpen)}
                    className="relative h-9 w-9 p-0"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {messageUnreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                      >
                        {messageUnreadCount > 99 ? "99+" : messageUnreadCount}
                      </Badge>
                    )}
                  </Button>

                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
                    className="relative h-9 w-9 p-0"
                  >
                    <Bell className="h-4 w-4" />
                    {notificationUnreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                      >
                        {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                      </Badge>
                    )}
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                          <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {user.online && (
                          <div className="absolute -bottom-0 -right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                          {user.verified && (
                            <Badge variant="secondary" className="text-xs w-fit">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Menu Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden h-9 w-9 p-0"
                  >
                    {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </Button>
                </>
              ) : (
                <>
                  {/* Guest Actions */}
                  <Button variant="ghost" size="sm" onClick={() => router.push("/auth/login")}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => router.push("/auth/register")}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && user && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-2 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search people, jobs, companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 w-full"
                    />
                  </div>
                </form>

                {/* Mobile Navigation Links */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Post Job (Mobile) */}
                {(user.role === "employer" || user.role === "both") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push("/post-job")
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals and Panels */}
      <UserSearchModal />
      <ChatPanel />
      <NotificationsPanel />
    </>
  )
}
