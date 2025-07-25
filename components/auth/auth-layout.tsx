"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Shield, CheckCircle } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  showTestimonials?: boolean
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "TechCorp",
    content:
      "CareerHub helped me land my dream job in just 2 weeks. The platform is intuitive and the job matches were perfect.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "StartupXYZ",
    content:
      "As an employer, I've found amazing candidates through CareerHub. The quality of applicants is outstanding.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "DesignStudio",
    content: "The career resources and job alerts feature saved me so much time in my job search. Highly recommended!",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
]

const trustIndicators = [
  { icon: Users, label: "50,000+ Active Users", color: "text-blue-600" },
  { icon: Shield, label: "Enterprise Security", color: "text-green-600" },
  { icon: CheckCircle, label: "Verified Companies", color: "text-purple-600" },
]

const companyLogos = [
  { name: "Google", logo: "/placeholder.svg?height=30&width=80" },
  { name: "Microsoft", logo: "/placeholder.svg?height=30&width=80" },
  { name: "Apple", logo: "/placeholder.svg?height=30&width=80" },
  { name: "Amazon", logo: "/placeholder.svg?height=30&width=80" },
  { name: "Meta", logo: "/placeholder.svg?height=30&width=80" },
  { name: "Netflix", logo: "/placeholder.svg?height=30&width=80" },
]

export function AuthLayout({ children, title, subtitle, showTestimonials = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Side - Form */}
      <div className="flex-1 lg:flex-none lg:w-2/5 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-3">
              <Image
                src="/images/careerhub-logo.png"
                alt="CareerHub Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-gray-900">CareerHub</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Form Content */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">{children}</CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 gap-3">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <indicator.icon className={`h-4 w-4 ${indicator.color}`} />
                <span>{indicator.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Testimonials & Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 space-y-12">
          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Trusted by 50,000+ professionals
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">Your career journey starts here</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of professionals who have found their dream jobs through our platform.
              </p>
            </div>

            {/* Company Logos */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Trusted by leading companies</p>
              <div className="grid grid-cols-3 gap-6 opacity-60">
                {companyLogos.map((company, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <Image
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      width={80}
                      height={30}
                      className="grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          {showTestimonials && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">What our users say</h3>
              <div className="space-y-6">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
                          <div className="text-sm">
                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                            <p className="text-gray-600">
                              {testimonial.role} at {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-gray-600">Job Postings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
