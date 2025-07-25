"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  MessageSquare,
  UserPlus,
  Share2,
  MoreHorizontal,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  Verified,
  Globe,
  Edit,
  Camera,
  Users,
  Eye,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuthStore, useUIStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"

interface ProfileHeaderProps {
  user: User
  isOwnProfile?: boolean
  onMessage?: () => void
  onConnect?: () => void
  onEdit?: () => void
}

export function ProfileHeader({ user, isOwnProfile = false, onMessage, onConnect, onEdit }: ProfileHeaderProps) {
  const { user: currentUser } = useAuthStore()
  const { setChatPanelOpen } = useUIStore()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMessaging, setIsMessaging] = useState(false)

  const handleMessage = async () => {
    setIsMessaging(true)
    try {
      if (onMessage) {
        await onMessage()
      }
      setChatPanelOpen(true)
    } finally {
      setIsMessaging(false)
    }
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      if (onConnect) {
        await onConnect()
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const getAvailabilityBadge = () => {
    if (user.role !== "job-seeker" || !user.jobSeekerProfile) return null

    const availability = user.jobSeekerProfile.availability
    const colors = {
      "actively-looking": "bg-green-100 text-green-800 border-green-200",
      "open-to-offers": "bg-blue-100 text-blue-800 border-blue-200",
      "not-available": "bg-gray-100 text-gray-800 border-gray-200",
    }

    const labels = {
      "actively-looking": "Actively Looking",
      "open-to-offers": "Open to Offers",
      "not-available": "Not Available",
    }

    return <Badge className={cn("border", colors[availability])}>{labels[availability]}</Badge>
  }

  const getSalaryRange = () => {
    if (user.role !== "job-seeker" || !user.jobSeekerProfile?.salaryExpectation) return null

    const { min, max, currency } = user.jobSeekerProfile.salaryExpectation
    return `${currency} ${(min / 1000).toFixed(0)}k - ${(max / 1000).toFixed(0)}k`
  }

  const getTopSkills = () => {
    if (user.role !== "job-seeker" || !user.jobSeekerProfile?.skills) return []
    return user.jobSeekerProfile.skills.slice(0, 5)
  }

  const getCurrentPosition = () => {
    if (user.role !== "job-seeker" || !user.jobSeekerProfile?.experience) return null
    const currentJob = user.jobSeekerProfile.experience.find((exp) => exp.current)
    return currentJob ? `${currentJob.title} at ${currentJob.company}` : null
  }

  const getEducation = () => {
    if (user.role !== "job-seeker" || !user.jobSeekerProfile?.education) return null
    const latestEducation = user.jobSeekerProfile.education[0]
    return latestEducation ? `${latestEducation.degree} from ${latestEducation.school}` : null
  }

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
        {user.coverImage && (
          <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        )}
        {isOwnProfile && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => console.log("Edit cover")}
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative -mt-20 px-6">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">{user.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            {user.online && (
              <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 border-4 border-white rounded-full" />
            )}
            {isOwnProfile && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                onClick={() => console.log("Edit avatar")}
              >
                <Camera className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.displayName}</h1>
                  {user.verified && <Verified className="h-6 w-6 text-blue-500" />}
                  {user.premium && <Star className="h-6 w-6 text-yellow-500" />}
                </div>

                <p className="text-lg text-gray-600 mb-2">@{user.username}</p>

                {getCurrentPosition() && <p className="text-gray-700 font-medium mb-2">{getCurrentPosition()}</p>}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  {user.jobSeekerProfile?.locationPreferences.locations[0] && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.jobSeekerProfile.locationPreferences.locations[0]}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                  </div>

                  {user.jobSeekerProfile && (
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{user.jobSeekerProfile.profileViews} profile views</span>
                    </div>
                  )}
                </div>

                {/* Availability & Salary */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {getAvailabilityBadge()}
                  {getSalaryRange() && (
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <span>{getSalaryRange()}</span>
                    </Badge>
                  )}
                  {user.role === "employer" && (
                    <Badge variant="secondary">
                      <Briefcase className="h-3 w-3 mr-1" />
                      Employer
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwnProfile && currentUser && (
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <Button onClick={handleMessage} disabled={isMessaging}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" onClick={handleConnect} disabled={isConnecting}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {isOwnProfile && (
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <Button onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mt-6">
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Quick Stats for Job Seekers */}
        {user.role === "job-seeker" && user.jobSeekerProfile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.jobSeekerProfile.profileViews}</div>
                <div className="text-sm text-gray-600">Profile Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.jobSeekerProfile.searchAppearances}</div>
                <div className="text-sm text-gray-600">Search Results</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.jobSeekerProfile.skills.length}</div>
                <div className="text-sm text-gray-600">Skills</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.profileComplete}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Stats for Employers */}
        {user.role === "employer" && user.employerProfile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.employerProfile.jobsPosted}</div>
                <div className="text-sm text-gray-600">Jobs Posted</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.employerProfile.successfulHires}</div>
                <div className="text-sm text-gray-600">Successful Hires</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.employerProfile.responseRate}%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.employerProfile.averageResponseTime}h</div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Skills Preview */}
        {getTopSkills().length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
              {getTopSkills().map((skill) => (
                <Badge key={skill.id} variant="secondary" className="flex items-center space-x-1">
                  <span>{skill.name}</span>
                  {skill.verified && <Verified className="h-3 w-3 text-blue-500" />}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Company Info for Employers */}
        {user.role === "employer" && user.employerProfile && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Briefcase className="h-4 w-4" />
                <span>{user.employerProfile.industry}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{user.employerProfile.companySize} employees</span>
              </div>
              {user.employerProfile.website && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Globe className="h-4 w-4" />
                  <a
                    href={user.employerProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {user.employerProfile.website}
                  </a>
                </div>
              )}
              {user.employerProfile.foundedYear && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Founded {user.employerProfile.foundedYear}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Completion (for own profile) */}
        {isOwnProfile && user.profileComplete < 100 && (
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-orange-900">Complete your profile</h3>
                <span className="text-sm font-medium text-orange-700">{user.profileComplete}%</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2 mb-3">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${user.profileComplete}%` }}
                />
              </div>
              <p className="text-sm text-orange-700">A complete profile gets 5x more views and better job matches.</p>
              <Button size="sm" className="mt-3" onClick={onEdit}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
