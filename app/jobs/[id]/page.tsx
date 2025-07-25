import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Users, Building, ExternalLink, Share2, Bookmark, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock job data - in real app this would come from API/database
const jobData = {
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
  applicationDeadline: "March 15, 2024",
  logo: "/placeholder.svg?height=80&width=80",
  description: `We are seeking a talented Senior Frontend Developer to join our dynamic team at TechCorp Inc. In this role, you will be responsible for developing and maintaining high-quality web applications using modern frontend technologies.

As a Senior Frontend Developer, you will work closely with our design and backend teams to create exceptional user experiences. You'll have the opportunity to mentor junior developers and contribute to architectural decisions that shape our products.`,
  responsibilities: [
    "Develop and maintain responsive web applications using React, TypeScript, and Next.js",
    "Collaborate with UX/UI designers to implement pixel-perfect designs",
    "Optimize applications for maximum speed and scalability",
    "Write clean, maintainable, and well-documented code",
    "Mentor junior developers and conduct code reviews",
    "Participate in agile development processes and sprint planning",
    "Stay up-to-date with the latest frontend technologies and best practices",
  ],
  requirements: [
    "5+ years of experience in frontend development",
    "Expert knowledge of React, TypeScript, and modern JavaScript",
    "Experience with Next.js, Redux, and state management",
    "Proficiency in HTML5, CSS3, and responsive design",
    "Experience with testing frameworks (Jest, React Testing Library)",
    "Knowledge of version control systems (Git)",
    "Strong problem-solving and communication skills",
    "Bachelor's degree in Computer Science or related field",
  ],
  niceToHave: [
    "Experience with GraphQL and Apollo Client",
    "Knowledge of Node.js and backend technologies",
    "Experience with cloud platforms (AWS, GCP, Azure)",
    "Familiarity with CI/CD pipelines",
    "Open source contributions",
  ],
  benefits: [
    "Competitive salary and equity package",
    "Comprehensive health, dental, and vision insurance",
    "401(k) with company matching",
    "Flexible work arrangements and remote work options",
    "Professional development budget",
    "Unlimited PTO policy",
    "Modern office with free meals and snacks",
    "Team building events and company retreats",
  ],
  skills: ["React", "TypeScript", "Next.js", "JavaScript", "HTML/CSS", "Redux", "Jest"],
  companyInfo: {
    name: "TechCorp Inc.",
    size: "500-1000 employees",
    industry: "Technology",
    founded: "2015",
    description:
      "TechCorp Inc. is a leading technology company focused on building innovative solutions that transform how businesses operate. We're passionate about creating products that make a real difference in people's lives.",
  },
}

const similarJobs = [
  {
    id: 2,
    title: "Frontend Developer",
    company: "StartupXYZ",
    location: "New York, NY",
    salary: "$90k - $120k",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    title: "React Developer",
    company: "WebCorp",
    location: "Remote",
    salary: "$100k - $130k",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "DevStudio",
    location: "Austin, TX",
    salary: "$110k - $140k",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
  },
]

export default function JobDetailsPage({ params }: { params: { id: string } }) {
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
        {/* Back Button */}
        <Link href="/jobs" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={jobData.logo || "/placeholder.svg"}
                      alt={`${jobData.company} logo`}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{jobData.title}</h1>
                      <p className="text-xl text-gray-600 mb-3">{jobData.company}</p>
                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{jobData.location}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{jobData.type}</Badge>
                        {jobData.remote && <Badge variant="outline">Remote</Badge>}
                        <Badge variant="outline">{jobData.experience}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-semibold text-green-600">{jobData.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Posted</p>
                      <p className="font-semibold">{jobData.postedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="font-semibold">{jobData.applicationDeadline}</p>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full md:w-auto">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jobData.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Key Responsibilities</h2>
                <ul className="space-y-2">
                  {jobData.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-2 mb-6">
                  {jobData.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">Nice to Have</h3>
                <ul className="space-y-2">
                  {jobData.niceToHave.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Benefits & Perks</h2>
                <ul className="space-y-2">
                  {jobData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">About {jobData.companyInfo.name}</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{jobData.companyInfo.size}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{jobData.companyInfo.industry}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Founded {jobData.companyInfo.founded}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">{jobData.companyInfo.description}</p>
                <Link href={`/companies/${jobData.company.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Company Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Similar Jobs</h3>
                <div className="space-y-4">
                  {similarJobs.map((job) => (
                    <div key={job.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <Image
                          src={job.logo || "/placeholder.svg"}
                          alt={`${job.company} logo`}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <Link href={`/jobs/${job.id}`} className="font-medium hover:text-primary">
                            {job.title}
                          </Link>
                          <p className="text-sm text-gray-600">{job.company}</p>
                          <p className="text-sm text-gray-500">{job.location}</p>
                          <p className="text-sm font-semibold text-green-600">{job.salary}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Salary Insights */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Salary Insights</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Market Average</span>
                    <span className="text-sm font-semibold">$125k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">This Role</span>
                    <span className="text-sm font-semibold text-green-600">$140k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Top 10%</span>
                    <span className="text-sm font-semibold">$180k</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Based on similar roles in San Francisco, CA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
