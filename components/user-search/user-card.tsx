"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, UserPlus, Eye, MapPin, Briefcase, Star, Verified, Clock, DollarSign, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"

interface UserCardProps {
  user: User
  onMessage: () => void
  onConnect: () => void
  onViewProfile: () => void
  showActions?: boolean
  compact?: boolean
  featured?: boolean
  className?: string
}

export function UserCard({
  user,
  onMessage,
  onConnect,
  onViewProfile,
  showActions = true,
  compact = false,
  featured = false,
  className,
}: UserCardProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMessaging, setIsMessaging] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await onConnect()
    } finally {
      setIsConnecting(false)
    }
  }

  const handleMessage = async () => {
    setIsMessaging(true)
    try {
      await onMessage()
    } finally {
      setIsMessaging(false)
    }
  }

  const getAvailabilityBadge = () => {
    if (user.role !== "job-seeker" || !user.jobSeekerProfile) return null

    const availability = user.jobSeekerProfile.availability
    const colors = {
      "actively-looking": "bg-green-100 text-green-800",
      "open-to-offers": "bg-blue-100 text-blue-800",
      "not-available": "bg-gray-100 text-gray-800",
    }

    const labels = {
      "actively-looking": "Actively Looking",
      "open-to-offers": "Open to Offers",
      "not-available": "Not Available",
    }

    return <Badge className={cn("text-xs", colors[availability])}>{labels[availability]}</Badge>
  }

  const getSkillsPreview = () => {
    if (user.role !== "job-seeker" || !user.jobSeekerProfile?.skills) return null

    const topSkills = user.jobSeekerProfile.skills.slice(0, 3)
    return topSkills.map((skill) => skill.name).join(", ")
  }

  const getSalaryRange = () => {
    if (user.role !== "job-seeker" || !user.jobSeekerProfile?.salaryExpectation) return null

    const { min, max, currency } = user.jobSeekerProfile.salaryExpectation
    return `${currency} ${(min / 1000).toFixed(0)}k - ${(max / 1000).toFixed(0)}k`
  }

  const getCompanyInfo = () => {
    if (user.role !== "employer" || !user.employerProfile) return null

    return {
      company: user.employerProfile.companyName,
      industry: user.employerProfile.industry,
      size: user.employerProfile.companySize,
    }
  }

  if (compact) {
    return (
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              {user.online && (
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900 truncate">{user.displayName}</p>
                {user.verified && <Verified className="h-4 w-4 text-blue-500" />}
                {featured && <Star className="h-4 w-4 text-yellow-500" />}
              </div>
              <p className="text-sm text-gray-500">@{user.username}</p>
              {user.role === "job-seeker" && getSkillsPreview() && (
                <p className="text-xs text-gray-400 truncate">{getSkillsPreview()}</p>
              )}
            </div>

            {showActions && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMessage}
                  disabled={isMessaging}
                  className="h-8 w-8 p-0 bg-transparent"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="h-8 w-8 p-0 bg-transparent"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar and Online Status */}
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">{user.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            {user.online && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
            )}
            {user.premium && (
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{user.displayName}</h3>
              {user.verified && <Verified className="h-5 w-5 text-blue-500" />}
              {featured && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <p className="text-gray-600 mb-2">@{user.username}</p>

            {/* Bio */}
            {user.bio && <p className="text-gray-700 text-sm mb-3 line-clamp-2">{user.bio}</p>}

            {/* Role-specific info */}
            {user.role === "job-seeker" && user.jobSeekerProfile && (
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  {getAvailabilityBadge()}
                  {getSalaryRange() && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {getSalaryRange()}
                    </div>
                  )}
                </div>

                {user.jobSeekerProfile.locationPreferences.locations.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {user.jobSeekerProfile.locationPreferences.locations[0]}
                    {user.jobSeekerProfile.locationPreferences.remote && " • Remote OK"}
                  </div>
                )}

                {getSkillsPreview() && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {getSkillsPreview()}
                  </div>
                )}
              </div>
            )}

            {user.role === "employer" && user.employerProfile && (
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {user.employerProfile.companyName}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  {user.employerProfile.industry} • {user.employerProfile.companySize} employees
                </div>
              </div>
            )}

            {/* Last seen */}
            {!user.online && (
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Clock className="h-3 w-3 mr-1" />
                Last seen {formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true })}
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex flex-col space-y-2">
              <Button onClick={handleMessage} disabled={isMessaging} size="sm" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Message</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleConnect}
                disabled={isConnecting}
                size="sm"
                className="flex items-center space-x-2 bg-transparent"
              >
                <UserPlus className="h-4 w-4" />
                <span>Connect</span>
              </Button>
              <Button variant="ghost" onClick={onViewProfile} size="sm" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </Button>
            </div>
          )}
        </div>

        {/* Profile completion for job seekers */}
        {user.role === "job-seeker" && user.profileComplete < 100 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Profile completion</span>
              <span className="font-medium">{user.profileComplete}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${user.profileComplete}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
