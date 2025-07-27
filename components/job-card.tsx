"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface JobCardProps {
  job: {
    id: number
    title: string
    company: string
    location: string
    salary: string
    type: string
    remote: boolean
    experience: string
    industry: string
    postedDate: string
    description: string
    skills: string[]
    logo: string
  }
  onSave?: (jobId: number) => void
  isSaved?: boolean
}

export function JobCard({ job, onSave, isSaved = false }: JobCardProps) {
  const [saved, setSaved] = useState(isSaved)

  const handleSave = () => {
    setSaved(!saved)
    onSave?.(job.id)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            <Image
              src={job.logo || "/placeholder.svg"}
              alt={`${job.company} logo`}
              width={50}
              height={50}
              className="rounded-lg flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">
                <Link href={`/jobs/${job.id}`} className="hover:text-primary">
                  {job.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-2 text-sm sm:text-base line-clamp-1">{job.company}</p>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm line-clamp-1">{job.location}</span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <div className="flex items-center text-gray-500 mb-2 justify-end">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{job.postedDate}</span>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              <Badge variant="secondary" className="text-xs">{job.type}</Badge>
              {job.remote && <Badge variant="outline" className="text-xs">Remote</Badge>}
              <Badge variant="outline" className="text-xs">{job.experience}</Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-2 text-sm sm:text-base flex-1">{job.description}</p>

        {/* Bottom Section - Fixed Layout */}
        <div className="mt-auto">
          {/* Salary and Skills Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center text-green-600 font-semibold text-sm sm:text-base">
              <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{job.salary}</span>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              {job.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave} 
              className="p-2 bg-transparent flex-shrink-0 min-h-[36px] min-w-[36px]"
            >
              {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Link href={`/jobs/${job.id}`} className="flex-1">
              <Button size="sm" className="w-full min-h-[36px]">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
