"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Briefcase,
  BookmarkIcon,
  TrendingUp,
  Users,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AuthGuard } from "@/components/auth-guard"
import { useAuthStore, useJobStore } from "@/lib/store"
import { api } from "@/lib/api"

interface DashboardStats {
  appliedJobs: number
  savedJobs: number
  profileViews: number
  interviewRequests: number
}

interface RecommendedJob {
  id: number
  title: string
  company: string
  location: string
  salary: string
  type: string
  remote: boolean
  logo: string
  matchScore: number
  postedDate: string
}

interface Application {
  id: string
  jobId: number
  jobTitle: string
  company: string
  appliedDate: string
  status: "pending" | "reviewed" | "interview" | "rejected" | "accepted"
  logo: string
}

const JobSeekerDashboard = () => {
  const { user } = useAuthStore()
  const { savedJobs, appliedJobs } = useJobStore()
  const [stats, setStats] = useState<DashboardStats>({
    appliedJobs: 0,
    savedJobs: 0,
    profileViews: 0,
    interviewRequests: 0,
  })
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        // Load recommended jobs
        const jobs = await api.jobs.getRecommended(user.id)
        setRecommendedJobs(jobs)

        // Mock stats and applications
        setStats({
          appliedJobs: appliedJobs.length,
          savedJobs: savedJobs.length,
          profileViews: 127,
          interviewRequests: 3,
        })

        setApplications([
          {
            id: "app-1",
            jobId: 1,
            jobTitle: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            appliedDate: "2024-01-15",
            status: "interview",
            logo: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "app-2",
            jobId: 2,
            jobTitle: "Product Manager",
            company: "StartupXYZ",
            appliedDate: "2024-01-12",
            status: "reviewed",
            logo: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "app-3",
            jobId: 3,
            jobTitle: "UX Designer",
            company: "DesignStudio",
            appliedDate: "2024-01-10",
            status: "pending",
            logo: "/placeholder.svg?height=40&width=40",
          },
        ])
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [user, appliedJobs.length, savedJobs.length])

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "interview":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "accepted":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "reviewed":
        return <Eye className="h-4 w-4" />
      case "interview":
        return <Users className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/careerhub-logo.png"
                alt="CareerHub Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-primary">CareerHub</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/jobs" className="text-gray-600 hover:text-primary">
                Jobs
              </Link>
              <Link href="/companies" className="text-gray-600 hover:text-primary">
                Companies
              </Link>
              <Link href="/dashboard" className="text-primary font-medium">
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/profile/edit">
                <Button variant="outline">Edit Profile</Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Image
                  src={user?.avatar || "/placeholder.svg"}
                  alt={user?.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h1>
          <p className="text-gray-600">Here's what's happening with your job search</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applied Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.appliedJobs}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.savedJobs}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookmarkIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.profileViews}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interview Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.interviewRequests}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Profile completion</span>
              <span className="text-sm font-medium">75%</span>
            </div>
            <Progress value={75} className="mb-4" />
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">✓ Basic Info</Badge>
              <Badge variant="outline">✓ Work Experience</Badge>
              <Badge variant="outline">✓ Skills</Badge>
              <Badge variant="secondary">+ Add Resume</Badge>
              <Badge variant="secondary">+ Add Portfolio</Badge>
            </div>
            <Link href="/profile/edit" className="inline-block mt-4">
              <Button>Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={app.logo || "/placeholder.svg"}
                            alt={app.company}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div>
                            <p className="font-medium">{app.jobTitle}</p>
                            <p className="text-sm text-gray-600">{app.company}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">{app.status}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Link href="#applications" className="inline-block mt-4">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Applications
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Job Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-3">
                            <Image
                              src={job.logo || "/placeholder.svg"}
                              alt={job.company}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-gray-600">{job.company}</p>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {job.location}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">{job.matchScore}% match</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">{job.salary}</span>
                          <Link href={`/jobs/${job.id}`}>
                            <Button size="sm">View Job</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="#recommended" className="inline-block mt-4">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Recommendations
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={app.logo || "/placeholder.svg"}
                          alt={app.company}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{app.jobTitle}</h3>
                          <p className="text-gray-600">{app.company}</p>
                          <p className="text-sm text-gray-500">
                            Applied on {new Date(app.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">{app.status}</span>
                        </Badge>
                        <Link href={`/jobs/${app.jobId}`}>
                          <Button variant="outline" size="sm">
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {savedJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
                    <p className="text-gray-600 mb-4">Start saving jobs you're interested in to view them here</p>
                    <Link href="/jobs">
                      <Button>Browse Jobs</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Saved jobs would be rendered here */}
                    <p className="text-gray-600">You have {savedJobs.length} saved jobs</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-4">
                          <Image
                            src={job.logo || "/placeholder.svg"}
                            alt={job.company}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                            <div className="flex items-center text-gray-500 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{job.location}</span>
                              {job.remote && (
                                <Badge variant="outline" className="ml-2">
                                  Remote
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{job.matchScore}% match</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-green-600 font-semibold">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                          <Badge variant="outline">{job.type}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Save
                          </Button>
                          <Link href={`/jobs/${job.id}`}>
                            <Button size="sm">Apply Now</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const EmployerDashboard = () => {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/careerhub-logo.png"
                alt="CareerHub Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-primary">CareerHub</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/jobs" className="text-gray-600 hover:text-primary">
                Jobs
              </Link>
              <Link href="/companies" className="text-gray-600 hover:text-primary">
                Companies
              </Link>
              <Link href="/dashboard" className="text-primary font-medium">
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/post-job">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Image
                  src={user?.avatar || "/placeholder.svg"}
                  alt={user?.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h1>
          <p className="text-gray-600">Manage your job postings and find the best candidates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">247</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                  <p className="text-3xl font-bold text-gray-900">18</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hires This Month</p>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-primary/10 rounded-lg inline-block mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Post New Job</h3>
              <p className="text-gray-600 text-sm mb-4">Create a new job listing to attract top talent</p>
              <Link href="/post-job">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-green-100 rounded-lg inline-block mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Review Applications</h3>
              <p className="text-gray-600 text-sm mb-4">Check new applications and schedule interviews</p>
              <Link href="/manage-jobs">
                <Button variant="outline" className="w-full bg-transparent">
                  View Applications
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-purple-100 rounded-lg inline-block mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">View Analytics</h3>
              <p className="text-gray-600 text-sm mb-4">Track your hiring performance and metrics</p>
              <Button variant="outline" className="w-full bg-transparent">
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">New application received</p>
                    <p className="text-sm text-gray-600">Senior Frontend Developer - John Smith applied</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Job posting viewed</p>
                    <p className="text-sm text-gray-600">Product Manager position got 15 new views</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">4 hours ago</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Interview completed</p>
                    <p className="text-sm text-gray-600">UX Designer interview with Sarah Johnson</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  return <AuthGuard>{user?.role === "employer" ? <EmployerDashboard /> : <JobSeekerDashboard />}</AuthGuard>
}
