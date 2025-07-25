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
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <Image
              src={job.logo || "/placeholder.svg"}
              alt={`${job.company} logo`}
              width={50}
              height={50}
              className="rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-lg mb-1">
                <Link href={`/jobs/${job.id}`} className="hover:text-primary">
                  {job.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{job.location}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-gray-500 mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{job.postedDate}</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{job.type}</Badge>
              {job.remote && <Badge variant="outline">Remote</Badge>}
              <Badge variant="outline">{job.experience}</Badge>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-green-600 font-semibold">
              <DollarSign className="h-4 w-4 mr-1" />
              {job.salary}
            </div>
            <div className="flex gap-2">
              {job.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave} className="p-2 bg-transparent">
              {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Link href={`/jobs/${job.id}`}>
              <Button size="sm">View Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
