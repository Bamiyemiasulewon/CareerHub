"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MapPin, Filter, Map, List, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    remote: true,
    experience: "Senior",
    industry: "Technology",
    postedDate: "2 days ago",
    description: "We're looking for a senior frontend developer to join our team...",
    skills: ["React", "TypeScript", "Next.js"],
    logo: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    salary: "$100k - $140k",
    type: "Full-time",
    remote: false,
    experience: "Mid-level",
    industry: "Technology",
    postedDate: "1 day ago",
    description: "Join our product team to drive innovation and growth...",
    skills: ["Product Strategy", "Analytics", "Agile"],
    logo: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "DesignStudio",
    location: "Remote",
    salary: "$80k - $110k",
    type: "Contract",
    remote: true,
    experience: "Mid-level",
    industry: "Design",
    postedDate: "3 days ago",
    description: "Create beautiful and intuitive user experiences...",
    skills: ["Figma", "User Research", "Prototyping"],
    logo: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "DataCorp",
    location: "Boston, MA",
    salary: "$110k - $150k",
    type: "Full-time",
    remote: true,
    experience: "Senior",
    industry: "Technology",
    postedDate: "1 week ago",
    description: "Analyze complex datasets to drive business insights...",
    skills: ["Python", "Machine Learning", "SQL"],
    logo: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    title: "Marketing Manager",
    company: "GrowthCo",
    location: "Austin, TX",
    salary: "$70k - $95k",
    type: "Full-time",
    remote: false,
    experience: "Mid-level",
    industry: "Marketing",
    postedDate: "5 days ago",
    description: "Lead marketing campaigns and drive customer acquisition...",
    skills: ["Digital Marketing", "SEO", "Analytics"],
    logo: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    salary: "$105k - $135k",
    type: "Full-time",
    remote: true,
    experience: "Senior",
    industry: "Technology",
    postedDate: "4 days ago",
    description: "Build and maintain scalable cloud infrastructure...",
    skills: ["AWS", "Docker", "Kubernetes"],
    logo: "/placeholder.svg?height=50&width=50",
  },
]

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"]
const experienceLevels = ["Entry-level", "Mid-level", "Senior", "Executive"]
const industries = ["Technology", "Healthcare", "Finance", "Marketing", "Design", "Sales"]

export default function JobsPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("date")

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    if (checked) {
      setSelectedJobTypes([...selectedJobTypes, jobType])
    } else {
      setSelectedJobTypes(selectedJobTypes.filter((type) => type !== jobType))
    }
  }

  const handleExperienceChange = (experience: string, checked: boolean) => {
    if (checked) {
      setSelectedExperience([...selectedExperience, experience])
    } else {
      setSelectedExperience(selectedExperience.filter((exp) => exp !== experience))
    }
  }

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries([...selectedIndustries, industry])
    } else {
      setSelectedIndustries(selectedIndustries.filter((ind) => ind !== industry))
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = location === "" || job.location.toLowerCase().includes(location.toLowerCase())
    const matchesJobType = selectedJobTypes.length === 0 || selectedJobTypes.includes(job.type)
    const matchesExperience = selectedExperience.length === 0 || selectedExperience.includes(job.experience)
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(job.industry)

    return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesIndustry
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              CareerHub
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/jobs" className="text-primary font-medium">
                Jobs
              </Link>
              <Link href="/companies" className="text-gray-600 hover:text-primary">
                Companies
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Sign In</Button>
              <Button>Post a Job</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Job title, keywords, or company"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="City, state, or remote"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button className="px-8">Search Jobs</Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Most Recent</SelectItem>
                <SelectItem value="salary">Highest Salary</SelectItem>
                <SelectItem value="relevance">Most Relevant</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button variant={viewMode === "map" ? "default" : "outline"} size="sm" onClick={() => setViewMode("map")}>
                <Map className="h-4 w-4 mr-2" />
                Map
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </h3>

                {/* Job Type Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedJobTypes.includes(type)}
                          onCheckedChange={(checked) => handleJobTypeChange(type, checked as boolean)}
                        />
                        <label htmlFor={type} className="text-sm">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Experience Level</h4>
                  <div className="space-y-2">
                    {experienceLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={level}
                          checked={selectedExperience.includes(level)}
                          onCheckedChange={(checked) => handleExperienceChange(level, checked as boolean)}
                        />
                        <label htmlFor={level} className="text-sm">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Industry</h4>
                  <div className="space-y-2">
                    {industries.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox
                          id={industry}
                          checked={selectedIndustries.includes(industry)}
                          onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
                        />
                        <label htmlFor={industry} className="text-sm">
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Job Opportunities</h2>
              <p className="text-gray-600">{filteredJobs.length} jobs found</p>
            </div>

            {viewMode === "list" ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
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
                        <Link href={`/jobs/${job.id}`}>
                          <Button>View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 h-96 flex items-center justify-center">
                <p className="text-gray-500">Map view would be implemented here with job locations</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
