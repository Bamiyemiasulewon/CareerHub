"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  TrendingUp,
  Users,
  Building,
  Star,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Target,
  Zap,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { JobCard } from "@/components/job-card"

const featuredJobs = [
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
    description: "We're looking for a senior frontend developer to join our team and build amazing user experiences.",
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
    description: "Join our product team to drive innovation and growth in our fast-paced startup environment.",
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
    description: "Create beautiful and intuitive user experiences for our diverse client portfolio.",
    skills: ["Figma", "User Research", "Prototyping"],
    logo: "/placeholder.svg?height=50&width=50",
  },
]

const companies = [
  { name: "Google", logo: "/placeholder.svg?height=40&width=120", jobs: 45 },
  { name: "Microsoft", logo: "/placeholder.svg?height=40&width=120", jobs: 32 },
  { name: "Apple", logo: "/placeholder.svg?height=40&width=120", jobs: 28 },
  { name: "Amazon", logo: "/placeholder.svg?height=40&width=120", jobs: 67 },
  { name: "Meta", logo: "/placeholder.svg?height=40&width=120", jobs: 23 },
  { name: "Netflix", logo: "/placeholder.svg?height=40&width=120", jobs: 19 },
]

const jobCategories = [
  { name: "Technology", count: 1250, icon: "💻", growth: "+12%" },
  { name: "Healthcare", count: 890, icon: "🏥", growth: "+8%" },
  { name: "Finance", count: 670, icon: "💰", growth: "+15%" },
  { name: "Marketing", count: 540, icon: "📈", growth: "+10%" },
  { name: "Design", count: 420, icon: "🎨", growth: "+18%" },
  { name: "Sales", count: 380, icon: "🤝", growth: "+6%" },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "TechCorp",
    content:
      "CareerHub helped me land my dream job in just 2 weeks. The platform is intuitive and the job matches were perfect.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "StartupXYZ",
    content:
      "As an employer, I've found amazing candidates through CareerHub. The quality of applicants is outstanding.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "DesignStudio",
    content: "The career resources and job alerts feature saved me so much time in my job search. Highly recommended!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
]

const popularSearches = [
  "Remote Developer Jobs",
  "Product Manager NYC",
  "UX Designer",
  "Data Scientist",
  "Marketing Manager",
  "Sales Representative",
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (location) params.set("location", location)

    window.location.href = `/jobs?${params.toString()}`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
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
              <Link href="/jobs" className="text-gray-600 hover:text-primary transition-colors">
                Jobs
              </Link>
              <Link href="/companies" className="text-gray-600 hover:text-primary transition-colors">
                Companies
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/post-job">
                <Button>Post a Job</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-6 bg-blue-50 text-blue-700 border-blue-200">
                🎉 Over 50,000 professionals trust CareerHub
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                  Find Your Dream Job
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Today
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with top employers and discover opportunities that match your skills and aspirations. Your next
                career move is just a search away.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-lg max-w-4xl mx-auto mb-8 relative">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    className="pl-12 h-12 bg-white border-gray-200 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="City, state, or remote"
                    className="pl-12 h-12 bg-white border-gray-200 text-lg"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold"
                >
                  Search Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-6 right-6 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(search)
                            setShowSuggestions(false)
                          }}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">50,000+ Active Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span className="text-sm">10,000+ Companies</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm">25,000+ Job Postings</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-12">
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gray-600 font-medium">Trusted by leading companies worldwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div key={index} className="flex flex-col items-center group">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  width={120}
                  height={40}
                  className="grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                />
                <p className="text-sm text-gray-500 mt-2">{company.jobs} jobs</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Job Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover opportunities across various industries and find the perfect role for your skills
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{category.icon}</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {category.growth}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.count.toLocaleString()} open positions</p>
                  <div className="flex items-center text-primary font-medium">
                    <span>Explore jobs</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Job Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked positions from top companies looking for talented professionals like you
            </p>
          </div>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/jobs">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                View All Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CareerHub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're more than just a job board. We're your career growth partner.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Job Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI-powered algorithm matches you with jobs that fit your skills, experience, and career goals
                perfectly.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Applications</h3>
              <p className="text-gray-600 leading-relaxed">
                Apply to multiple jobs with one click using your saved profile and get responses faster than ever.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                Access career resources, salary insights, and professional development tools to advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who have found success through CareerHub
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-gray-600 text-sm">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get the latest job opportunities and career tips delivered to your inbox weekly
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/careerhub-logo.png"
                  alt="CareerHub Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-2xl font-bold">CareerHub</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting talented professionals with their dream careers. Your success is our mission.
              </p>
              <div className="flex items-center space-x-2 text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Trusted by 50,000+ professionals</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/jobs" className="hover:text-white transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="hover:text-white transition-colors">
                    Company Profiles
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/profile/edit" className="hover:text-white transition-colors">
                    Build Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/post-job" className="hover:text-white transition-colors">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Employer Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="hover:text-white transition-colors">
                    Company Directory
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Enterprise Solutions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 CareerHub. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
