"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
      {/* HEADER SECTION - Mobile-First */}
      <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 min-h-[44px] min-w-[44px]">
            <Image
              src="/images/careerhub-logo.png"
              alt="CareerHub Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl sm:text-2xl font-bold text-gray-900 font-sans">CareerHub</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 font-sans">
            <div className="relative group">
              <button className="font-medium flex items-center min-h-[44px] px-2 rounded hover:bg-gray-100 transition-colors">
                Portfolio <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-lg hidden group-hover:block z-30 border border-gray-200">
                <Link href="/portfolio/jobs" className="block px-4 py-3 hover:bg-gray-100 rounded-t-lg transition-colors">Jobs</Link>
                <Link href="/portfolio/professionals" className="block px-4 py-3 hover:bg-gray-100 transition-colors">Professionals</Link>
                <Link href="/portfolio/companies" className="block px-4 py-3 hover:bg-gray-100 rounded-b-lg transition-colors">Companies</Link>
              </div>
            </div>
            <Link href="/post-job" className="hover:text-blue-600 min-h-[44px] flex items-center px-2 rounded hover:bg-gray-100 transition-colors">Post A Job</Link>
            <Link href="/hire" className="hover:text-blue-600 min-h-[44px] flex items-center px-2 rounded hover:bg-gray-100 transition-colors">Hire A Professional</Link>
          </nav>



          {/* Auth/Profile - Responsive layout */}
          <div className="flex items-center space-x-2">
            <Link 
              href="/auth/login" 
              className="px-3 py-2 rounded-lg hover:bg-gray-100 font-sans min-h-[44px] flex items-center transition-colors text-sm sm:text-base"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 font-sans min-h-[44px] flex items-center transition-colors text-sm sm:text-base"
            >
              Sign Up
            </Link>
          </div>
        </div>


      </header>

      {/* HERO SECTION - Mobile-Optimized */}
      <section className="flex flex-col justify-center items-center min-h-[80vh] pt-20 sm:pt-24 lg:pt-32 pb-8 sm:pb-12 bg-gradient-to-br from-purple-200 via-blue-100 to-blue-300 px-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-4 font-sans leading-tight">
            Revolutionizing Career Hiring – Skill Over Identity
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center mb-6 sm:mb-8 max-w-2xl mx-auto font-sans leading-relaxed text-gray-700">
            A global job board where professionals are hired based on their portfolio, not personal details.
          </p>
          
          {/* Search Bar - Mobile-Optimized */}
          <form
            className="w-full max-w-2xl mx-auto mb-6"
            onSubmit={e => { e.preventDefault(); handleSearch(); }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What Are You Looking For?"
                    className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-xl border border-gray-200 outline-none text-base font-sans focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Search for jobs, professionals, or companies"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                </div>
                
                <select className="px-4 py-3 sm:py-4 rounded-xl bg-gray-100 text-base outline-none font-sans focus:ring-2 focus:ring-blue-500 border border-transparent min-h-[44px]">
                  <option>Jobs</option>
                  <option>Professionals</option>
                  <option>Companies</option>
                </select>
                
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-3 sm:py-4 flex items-center justify-center transition-colors font-sans font-medium min-h-[44px] active:scale-95"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Search Tags - Mobile-Optimized */}
          <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-2xl mx-auto">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(search)}
                className="px-2 py-1 text-xs bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all font-sans shadow-sm hover:shadow-md active:scale-95 min-h-[32px] flex items-center"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION - Mobile-Optimized */}
      <section className="bg-white py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-6 text-base sm:text-lg font-medium font-sans">
            Trusted by professionals from leading organizations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {companies.map((company, index) => (
              <div key={index} className="flex flex-col items-center group">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  width={120}
                  height={40}
                  className="grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105 max-w-full h-auto"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2 font-sans">{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories - Mobile-Optimized */}
      <section className="py-12 sm:py-20 bg-white px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Explore Job Categories</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover opportunities across various industries and find the perfect role for your skills
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {jobCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer active:scale-95">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl sm:text-3xl">{category.icon}</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {category.growth}
                    </Badge>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{category.count.toLocaleString()} open positions</p>
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

      {/* Featured Jobs - Mobile-Optimized */}
      <section className="py-12 sm:py-20 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Job Opportunities</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked positions from top companies looking for talented professionals like you
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/jobs">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 min-h-[44px] px-6 py-3 active:scale-95 transition-transform"
              >
                View All Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile-Optimized */}
      <section className="py-12 sm:py-20 bg-white px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose CareerHub?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              We're more than just a job board. We're your career growth partner.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Smart Job Matching</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our AI-powered algorithm matches you with jobs that fit your skills, experience, and career goals
                perfectly.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Instant Applications</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Apply to multiple jobs with one click using your saved profile and get responses faster than ever.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Career Growth</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Access career resources, salary insights, and professional development tools to advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Mobile-Optimized */}
      <section className="py-12 sm:py-20 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who have found success through CareerHub
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">
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

      {/* Newsletter Section - Mobile-Optimized */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
              Get the latest job opportunities and career tips delivered to your inbox weekly
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      {/* Footer - Mobile-Optimized */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/careerhub-logo.png"
                  alt="CareerHub Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-xl sm:text-2xl font-bold">CareerHub</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Connecting talented professionals with their dream careers. Your success is our mission.
              </p>
              <div className="flex items-center space-x-2 text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs sm:text-sm">Trusted by 50,000+ professionals</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/jobs" className="hover:text-white transition-colors text-sm sm:text-base">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="hover:text-white transition-colors text-sm sm:text-base">
                    Company Profiles
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors text-sm sm:text-base">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/profile/edit" className="hover:text-white transition-colors text-sm sm:text-base">
                    Build Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">For Employers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/post-job" className="hover:text-white transition-colors text-sm sm:text-base">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors text-sm sm:text-base">
                    Employer Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="hover:text-white transition-colors text-sm sm:text-base">
                    Company Directory
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors text-sm sm:text-base">
                    Enterprise Solutions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors text-sm sm:text-base">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors text-sm sm:text-base">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors text-sm sm:text-base">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors text-sm sm:text-base">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm">© 2024 CareerHub. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-xs sm:text-sm">Follow us:</span>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
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
