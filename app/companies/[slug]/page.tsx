import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, Building, Globe, Star, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock company data - in real app this would come from API/database
const companyData = {
  id: 1,
  name: "TechCorp Inc.",
  slug: "techcorp-inc",
  industry: "Technology",
  size: "500-1000",
  location: "San Francisco, CA",
  description:
    "TechCorp Inc. is a leading technology company focused on building innovative solutions that transform how businesses operate. We're passionate about creating products that make a real difference in people's lives.",
  founded: "2015",
  website: "techcorp.com",
  rating: 4.5,
  reviewCount: 127,
  logo: "/placeholder.svg?height=120&width=120",
  coverImage: "/placeholder.svg?height=300&width=800",
  mission: "To empower businesses worldwide with cutting-edge technology solutions that drive growth and innovation.",
  values: ["Innovation First", "Customer Success", "Team Collaboration", "Continuous Learning", "Ethical Leadership"],
  benefits: [
    "Competitive salary and equity",
    "Comprehensive health insurance",
    "401(k) with company matching",
    "Flexible work arrangements",
    "Professional development budget",
    "Unlimited PTO",
    "Free meals and snacks",
    "Gym membership",
    "Team building events",
    "Modern office space",
  ],
  offices: [
    {
      city: "San Francisco, CA",
      address: "123 Tech Street, San Francisco, CA 94105",
      employees: 400,
    },
    {
      city: "New York, NY",
      address: "456 Innovation Ave, New York, NY 10001",
      employees: 200,
    },
    {
      city: "Austin, TX",
      address: "789 Startup Blvd, Austin, TX 73301",
      employees: 150,
    },
  ],
  stats: {
    employees: "750+",
    countries: "15+",
    customers: "10,000+",
    revenue: "$100M+",
  },
}

const openPositions = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $140k",
    postedDate: "1 week ago",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$105k - $135k",
    postedDate: "3 days ago",
  },
  {
    id: 4,
    title: "UX Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90k - $120k",
    postedDate: "1 day ago",
  },
  {
    id: 5,
    title: "Data Scientist",
    department: "Data",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110k - $150k",
    postedDate: "5 days ago",
  },
]

const culturePhotos = [
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
]

export default function CompanyProfilePage({ params }: { params: { slug: string } }) {
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
              <Link href="/jobs" className="text-gray-600 hover:text-primary">
                Jobs
              </Link>
              <Link href="/companies" className="text-primary font-medium">
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

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/companies" className="inline-flex items-center text-gray-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Link>
      </div>

      {/* Company Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Image
              src={companyData.logo || "/placeholder.svg"}
              alt={`${companyData.name} logo`}
              width={120}
              height={120}
              className="rounded-lg"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{companyData.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{companyData.industry}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{companyData.size} employees</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{companyData.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{companyData.rating}</span>
                    <span className="text-gray-500 ml-1">({companyData.reviewCount} reviews)</span>
                  </div>
                  <Button variant="outline">
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{companyData.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{companyData.industry}</Badge>
                <Badge variant="outline">Founded {companyData.founded}</Badge>
                <Badge variant="outline">{openPositions.length} Open Positions</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{companyData.stats.employees}</div>
              <div className="text-primary-foreground/80">Employees</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{companyData.stats.countries}</div>
              <div className="text-primary-foreground/80">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{companyData.stats.customers}</div>
              <div className="text-primary-foreground/80">Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{companyData.stats.revenue}</div>
              <div className="text-primary-foreground/80">Annual Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({openPositions.length})</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Mission */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-700 leading-relaxed">{companyData.mission}</p>
                  </CardContent>
                </Card>

                {/* Values */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Our Values</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {companyData.values.map((value, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Jobs */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">Recent Job Openings</h2>
                      <Link href="#jobs">
                        <Button variant="outline">View All Jobs</Button>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {openPositions.slice(0, 3).map((job) => (
                        <div key={job.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/jobs/${job.id}`} className="font-semibold hover:text-primary">
                                {job.title}
                              </Link>
                              <p className="text-gray-600">
                                {job.department} • {job.location}
                              </p>
                              <p className="text-sm text-gray-500">{job.postedDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">{job.salary}</p>
                              <Badge variant="secondary">{job.type}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Benefits */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Benefits & Perks</h3>
                    <div className="space-y-2">
                      {companyData.benefits.slice(0, 6).map((benefit, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View All Benefits
                    </Button>
                  </CardContent>
                </Card>

                {/* Company Info */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Company Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Founded</span>
                        <span className="font-medium">{companyData.founded}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Industry</span>
                        <span className="font-medium">{companyData.industry}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Company Size</span>
                        <span className="font-medium">{companyData.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Website</span>
                        <Link href={`https://${companyData.website}`} className="text-primary hover:underline">
                          {companyData.website}
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
                <div className="space-y-6">
                  {openPositions.map((job) => (
                    <div key={job.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link href={`/jobs/${job.id}`} className="text-xl font-semibold hover:text-primary">
                            {job.title}
                          </Link>
                          <p className="text-gray-600 mt-1">
                            {job.department} • {job.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 mb-2">{job.salary}</p>
                          <Badge variant="secondary">{job.type}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
                        <Link href={`/jobs/${job.id}`}>
                          <Button>
                            View Details
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="culture" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Company Culture</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {culturePhotos.map((photo, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Company culture ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At TechCorp Inc., we believe that great work happens when people feel valued, supported, and
                    inspired. Our culture is built on collaboration, innovation, and mutual respect. We encourage our
                    team members to take ownership of their work, learn from failures, and celebrate successes together.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We foster an inclusive environment where diverse perspectives are welcomed and everyone has the
                    opportunity to grow. From team lunches and hackathons to professional development workshops and
                    volunteer activities, we're committed to creating experiences that bring our team together and help
                    everyone thrive.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyData.offices.map((office, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{office.city}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                        <span className="text-gray-600">{office.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{office.employees} employees</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      View on Map
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
