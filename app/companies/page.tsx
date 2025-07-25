"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Users, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const companies = [
  {
    id: 1,
    name: "TechCorp Inc.",
    slug: "techcorp-inc",
    industry: "Technology",
    size: "500-1000",
    location: "San Francisco, CA",
    description: "Leading technology company focused on innovative solutions that transform businesses.",
    openPositions: 12,
    rating: 4.5,
    logo: "/placeholder.svg?height=80&width=80",
    featured: true,
    founded: "2015",
    website: "techcorp.com",
  },
  {
    id: 2,
    name: "StartupXYZ",
    slug: "startupxyz",
    industry: "Technology",
    size: "50-100",
    location: "New York, NY",
    description: "Fast-growing startup revolutionizing the way people work and collaborate.",
    openPositions: 8,
    rating: 4.3,
    logo: "/placeholder.svg?height=80&width=80",
    featured: true,
    founded: "2020",
    website: "startupxyz.com",
  },
  {
    id: 3,
    name: "DesignStudio",
    slug: "designstudio",
    industry: "Design",
    size: "10-50",
    location: "Los Angeles, CA",
    description: "Creative design agency specializing in digital experiences and brand identity.",
    openPositions: 5,
    rating: 4.7,
    logo: "/placeholder.svg?height=80&width=80",
    featured: false,
    founded: "2018",
    website: "designstudio.com",
  },
  {
    id: 4,
    name: "DataCorp",
    slug: "datacorp",
    industry: "Technology",
    size: "200-500",
    location: "Boston, MA",
    description: "Data analytics company helping businesses make informed decisions through insights.",
    openPositions: 15,
    rating: 4.2,
    logo: "/placeholder.svg?height=80&width=80",
    featured: false,
    founded: "2016",
    website: "datacorp.com",
  },
  {
    id: 5,
    name: "GrowthCo",
    slug: "growthco",
    industry: "Marketing",
    size: "100-200",
    location: "Austin, TX",
    description: "Marketing agency focused on growth hacking and digital marketing strategies.",
    openPositions: 7,
    rating: 4.4,
    logo: "/placeholder.svg?height=80&width=80",
    featured: false,
    founded: "2017",
    website: "growthco.com",
  },
  {
    id: 6,
    name: "CloudTech",
    slug: "cloudtech",
    industry: "Technology",
    size: "300-500",
    location: "Seattle, WA",
    description: "Cloud infrastructure company providing scalable solutions for modern businesses.",
    openPositions: 20,
    rating: 4.6,
    logo: "/placeholder.svg?height=80&width=80",
    featured: true,
    founded: "2014",
    website: "cloudtech.com",
  },
  {
    id: 7,
    name: "HealthTech Solutions",
    slug: "healthtech-solutions",
    industry: "Healthcare",
    size: "100-200",
    location: "Chicago, IL",
    description: "Healthcare technology company improving patient outcomes through innovation.",
    openPositions: 9,
    rating: 4.3,
    logo: "/placeholder.svg?height=80&width=80",
    featured: false,
    founded: "2019",
    website: "healthtechsolutions.com",
  },
  {
    id: 8,
    name: "FinanceFlow",
    slug: "financeflow",
    industry: "Finance",
    size: "200-500",
    location: "New York, NY",
    description: "Financial technology company streamlining business financial operations.",
    openPositions: 11,
    rating: 4.1,
    logo: "/placeholder.svg?height=80&width=80",
    featured: false,
    founded: "2016",
    website: "financeflow.com",
  },
]

const industries = ["All Industries", "Technology", "Healthcare", "Finance", "Marketing", "Design"]
const companySizes = ["All Sizes", "1-10", "10-50", "50-100", "100-200", "200-500", "500-1000", "1000+"]
const locations = [
  "All Locations",
  "San Francisco, CA",
  "New York, NY",
  "Los Angeles, CA",
  "Boston, MA",
  "Austin, TX",
  "Seattle, WA",
  "Chicago, IL",
]

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries")
  const [selectedSize, setSelectedSize] = useState("All Sizes")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustry === "All Industries" || company.industry === selectedIndustry
    const matchesSize = selectedSize === "All Sizes" || company.size === selectedSize
    const matchesLocation = selectedLocation === "All Locations" || company.location === selectedLocation

    return matchesSearch && matchesIndustry && matchesSize && matchesLocation
  })

  const featuredCompanies = filteredCompanies.filter((company) => company.featured)

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

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Great Companies</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore company profiles, read reviews, and find the perfect workplace culture that matches your values.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search companies..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Companies */}
        {featuredCompanies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Companies</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Image
                        src={company.logo || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      <Link href={`/companies/${company.slug}`} className="hover:text-primary">
                        {company.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{company.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{company.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{company.size} employees</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center text-yellow-400 mr-2">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{company.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">{company.openPositions} open positions</span>
                      </div>
                      <Link href={`/companies/${company.slug}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Companies */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">All Companies</h2>
          <p className="text-gray-600">{filteredCompanies.length} companies found</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Image
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company.name} logo`}
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <Badge variant="outline">{company.industry}</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  <Link href={`/companies/${company.slug}`} className="hover:text-primary">
                    {company.name}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{company.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{company.size} employees</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center text-yellow-400 mr-2">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{company.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{company.openPositions} open positions</span>
                  </div>
                  <Link href={`/companies/${company.slug}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
  )
}
