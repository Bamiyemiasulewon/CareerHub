import { type NextRequest, NextResponse } from "next/server"

// Mock jobs data - in production this would come from a database
const mockJobs = [
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
  // Add more mock jobs...
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const location = searchParams.get("location") || ""
    const type = searchParams.get("type") || ""
    const remote = searchParams.get("remote") === "true"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Filter jobs based on search parameters
    const filteredJobs = mockJobs.filter((job) => {
      const matchesQuery =
        !query ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(query.toLowerCase()))

      const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase())

      const matchesType = !type || job.type === type
      const matchesRemote = !remote || job.remote === remote

      return matchesQuery && matchesLocation && matchesType && matchesRemote
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

    return NextResponse.json({
      jobs: paginatedJobs,
      total: filteredJobs.length,
      page,
      totalPages: Math.ceil(filteredJobs.length / limit),
    })
  } catch (error) {
    console.error("Jobs API error:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}
