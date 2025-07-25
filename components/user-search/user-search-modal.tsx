"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter, Users, Clock, Verified } from "lucide-react"
import { useUIStore, useUserDiscoveryStore, useAuthStore } from "@/lib/store"
import { UserCard } from "./user-card"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"

export function UserSearchModal() {
  const { searchModalOpen, setSearchModalOpen } = useUIStore()
  const {
    searchResults,
    searchQuery,
    searchFilters,
    recentSearches,
    suggestedUsers,
    featuredUsers,
    setSearchQuery,
    updateSearchFilters,
    addRecentSearch,
    clearRecentSearches,
  } = useUserDiscoveryStore()
  const { user } = useAuthStore()

  const [localQuery, setLocalQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search input when modal opens
  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchModalOpen])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery.trim() !== searchQuery) {
        setSearchQuery(localQuery.trim())
        if (localQuery.trim()) {
          performSearch(localQuery.trim())
        }
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localQuery, searchQuery, setSearchQuery])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    try {
      // TODO: Implement actual search API call
      await new Promise((resolve) => setTimeout(resolve, 500)) // Mock delay

      // Mock search results
      const mockResults: User[] = [
        {
          id: "1",
          username: "johndoe",
          displayName: "John Doe",
          realName: "John Doe",
          email: "john@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "job-seeker",
          verified: true,
          premium: false,
          online: true,
          lastSeen: new Date().toISOString(),
          profileComplete: 85,
          createdAt: new Date().toISOString(),
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
            preferredJobTypes: ["full-time"],
            locationPreferences: {
              remote: true,
              onSite: false,
              hybrid: true,
              locations: ["San Francisco, CA"],
            },
            skills: [],
            experience: [],
            education: [],
            certifications: [],
            portfolio: [],
            references: [],
            profileViews: 150,
            searchAppearances: 45,
          },
        },
      ]

      // TODO: Set actual search results
      addRecentSearch(query)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    updateSearchFilters({ [key]: value })
    if (searchQuery) {
      performSearch(searchQuery)
    }
  }

  const clearFilters = () => {
    updateSearchFilters({
      userType: undefined,
      location: undefined,
      skills: undefined,
      experience: undefined,
      availability: undefined,
      verified: undefined,
      online: undefined,
    })
  }

  const handleUserSelect = (selectedUser: User) => {
    // TODO: Handle user selection (e.g., start conversation, view profile)
    console.log("Selected user:", selectedUser)
  }

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Searching...</span>
        </div>
      )
    }

    if (searchQuery && searchResults.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search terms or filters</p>
        </div>
      )
    }

    return (
      <div className="grid gap-4">
        {searchResults.map((searchUser) => (
          <UserCard
            key={searchUser.id}
            user={searchUser}
            onMessage={() => handleUserSelect(searchUser)}
            onConnect={() => console.log("Connect to", searchUser.username)}
            onViewProfile={() => console.log("View profile", searchUser.username)}
            showActions={true}
          />
        ))}
      </div>
    )
  }

  const renderRecentSearches = () => {
    if (recentSearches.length === 0) return null

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentSearches}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((search, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                setLocalQuery(search)
                setSearchQuery(search)
                performSearch(search)
              }}
              className="text-xs"
            >
              <Clock className="h-3 w-3 mr-1" />
              {search}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const renderSuggestedUsers = () => {
    if (suggestedUsers.length === 0) return null

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested for You</h3>
        <div className="grid gap-3">
          {suggestedUsers.slice(0, 3).map((suggestedUser) => (
            <UserCard
              key={suggestedUser.id}
              user={suggestedUser}
              onMessage={() => handleUserSelect(suggestedUser)}
              onConnect={() => console.log("Connect to", suggestedUser.username)}
              onViewProfile={() => console.log("View profile", suggestedUser.username)}
              showActions={true}
              compact={true}
            />
          ))}
        </div>
      </div>
    )
  }

  const renderFeaturedUsers = () => {
    if (featuredUsers.length === 0) return null

    return (
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Featured Professionals</h3>
        <div className="grid gap-3">
          {featuredUsers.slice(0, 5).map((featuredUser) => (
            <UserCard
              key={featuredUser.id}
              user={featuredUser}
              onMessage={() => handleUserSelect(featuredUser)}
              onConnect={() => console.log("Connect to", featuredUser.username)}
              onViewProfile={() => console.log("View profile", featuredUser.username)}
              showActions={true}
              compact={true}
              featured={true}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Find People</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Search by name, username, or skills..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {localQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocalQuery("")
                  setSearchQuery("")
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn("flex items-center space-x-2", showFilters && "bg-gray-100")}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {Object.values(searchFilters).some((v) => v !== undefined && v !== "") && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>

            {Object.values(searchFilters).some((v) => v !== undefined && v !== "") && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">User Type</label>
                <Select
                  value={searchFilters.userType || "all"}
                  onValueChange={(value) => handleFilterChange("userType", value || undefined)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="job-seeker">Job Seekers</SelectItem>
                    <SelectItem value="employer">Employers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
                <Input
                  placeholder="Any location"
                  value={searchFilters.location || ""}
                  onChange={(e) => handleFilterChange("location", e.target.value || undefined)}
                  className="h-8"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Experience</label>
                <Select
                  value={searchFilters.experience || "any"}
                  onValueChange={(value) => handleFilterChange("experience", value || undefined)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                <div className="flex space-x-2">
                  <Button
                    variant={searchFilters.verified ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("verified", !searchFilters.verified)}
                    className="h-8 text-xs"
                  >
                    <Verified className="h-3 w-3 mr-1" />
                    Verified
                  </Button>
                  <Button
                    variant={searchFilters.online ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("online", !searchFilters.online)}
                    className="h-8 text-xs"
                  >
                    Online
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 px-6 pb-6">
          {!searchQuery ? (
            <div className="space-y-6">
              {renderRecentSearches()}
              {renderSuggestedUsers()}
              {renderFeaturedUsers()}
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="job-seekers">Job Seekers</TabsTrigger>
                <TabsTrigger value="employers">Employers</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {renderSearchResults()}
              </TabsContent>

              <TabsContent value="job-seekers" className="mt-4">
                {renderSearchResults()}
              </TabsContent>

              <TabsContent value="employers" className="mt-4">
                {renderSearchResults()}
              </TabsContent>
            </Tabs>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
