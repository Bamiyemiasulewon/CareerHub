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
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileNavRef = useRef(null)

  // Close mobile nav when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileNavRef.current && !(mobileNavRef.current as any).contains(event.target)) {
        setMobileNavOpen(false)
      }
    }
    if (mobileNavOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobileNavOpen])

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
      {/* HEADER SECTION */}
      <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/careerhub-logo.png"
              alt="CareerHub Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-2xl font-bold text-gray-900 font-sans">CareerHub</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 font-sans">
            <div className="relative group">
              <button className="font-medium flex items-center">Portfolio <ChevronDown className="ml-1 h-4 w-4" /></button>
              <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded hidden group-hover:block z-30">
                <Link href="/portfolio/jobs" className="block px-4 py-2 hover:bg-gray-100">Jobs</Link>
                <Link href="/portfolio/professionals" className="block px-4 py-2 hover:bg-gray-100">Professionals</Link>
                <Link href="/portfolio/companies" className="block px-4 py-2 hover:bg-gray-100">Companies</Link>
              </div>
            </div>
            <Link href="/post-job" className="hover:text-blue-600">Post A Job</Link>
            <Link href="/hire" className="hover:text-blue-600">Hire A Professional</Link>
          </nav>
          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open navigation menu"
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <svg className="h-7 w-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Auth/Profile (always visible) */}
          <div className="flex items-center space-x-2">
            <Link href="/auth/login" className="px-4 py-2 rounded hover:bg-gray-100 font-sans">Log In</Link>
            <Link href="/signup" className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 font-sans">Sign Up</Link>
          </div>
        </div>
        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div ref={mobileNavRef} className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-40 flex">
            <nav className="bg-white w-64 h-full shadow-lg p-6 flex flex-col space-y-4 animate-slide-in">
              <button
                className="self-end mb-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close navigation menu"
                onClick={() => setMobileNavOpen(false)}
              >
                <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="font-sans">
                <div className="mb-2 font-medium">Portfolio</div>
                <Link href="/portfolio/jobs" className="block px-2 py-2 rounded hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>Jobs</Link>
                <Link href="/portfolio/professionals" className="block px-2 py-2 rounded hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>Professionals</Link>
                <Link href="/portfolio/companies" className="block px-2 py-2 rounded hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>Companies</Link>
                <Link href="/post-job" className="block px-2 py-2 rounded hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>Post A Job</Link>
                <Link href="/hire" className="block px-2 py-2 rounded hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>Hire A Professional</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col justify-center items-center min-h-[80vh] pt-32 pb-12 bg-gradient-to-br from-purple-200 via-blue-100 to-blue-300">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-4 font-sans">
          Revolutionizing Career Hiring – Skill Over Identity
        </h1>
        <p className="text-lg md:text-2xl text-center mb-8 max-w-2xl font-sans">
          A global job board where professionals are hired based on their portfolio, not personal details.
        </p>
        {/* Search Bar */}
        <form
          className="flex flex-col md:flex-row items-center bg-white rounded-full shadow-lg px-4 py-2 w-full max-w-2xl mb-4"
          onSubmit={e => { e.preventDefault(); handleSearch(); }}
        >
          <input
            type="text"
            placeholder="What Are You Looking For?"
            className="flex-1 px-4 py-2 rounded-full outline-none text-base font-sans"
            aria-label="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <select className="mx-2 px-3 py-2 rounded-full bg-gray-100 text-base outline-none font-sans">
            <option>Jobs</option>
            <option>Professionals</option>
            <option>Companies</option>
          </select>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-2 flex items-center transition font-sans"
            aria-label="Search"
          >
            <Search className="h-5 w-5 mr-1" />
            Search
          </button>
        </form>
        {/* Search Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(search)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors font-sans"
            >
              {search}
            </button>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-6 text-lg font-medium font-sans">
            Trusted by professionals from leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {companies.map((company, index) => (
              <div key={index} className="flex flex-col items-center group">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  width={120}
                  height={40}
                  className="grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                />
                <p className="text-sm text-gray-500 mt-2 font-sans">{company.name}</p>
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
