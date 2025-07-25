"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, DollarSign, Clock, Plus, X, Eye, Send } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { useAuthStore } from "@/lib/store"

interface JobFormData {
  title: string
  company: string
  location: string
  jobType: string
  workType: string
  experienceLevel: string
  salaryMin: string
  salaryMax: string
  currency: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  skills: string[]
  applicationDeadline: string
  applicationUrl: string
}

export default function PostJobPage() {
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: user?.company || "",
    location: "",
    jobType: "",
    workType: "",
    experienceLevel: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    description: "",
    responsibilities: [""],
    requirements: [""],
    benefits: [""],
    skills: [],
    applicationDeadline: "",
    applicationUrl: "",
  })
  const [newSkill, setNewSkill] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Job posted:", formData)
      // Redirect to manage jobs page
    } catch (error) {
      console.error("Failed to post job:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addListItem = (field: "responsibilities" | "requirements" | "benefits") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const updateListItem = (field: "responsibilities" | "requirements" | "benefits", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeListItem = (field: "responsibilities" | "requirements" | "benefits", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  return (
    <AuthGuard>
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
                <Link href="/companies" className="text-gray-600 hover:text-primary">
                  Companies
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? "Edit" : "Preview"}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
            <p className="text-gray-600">Find the perfect candidate for your open position</p>
          </div>

          {!showPreview ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Job Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                      <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Senior Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                      <Input
                        required
                        value={formData.company}
                        onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          required
                          className="pl-10"
                          value={formData.location}
                          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                      <Select
                        value={formData.jobType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, jobType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Work Type *</label>
                      <Select
                        value={formData.workType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, workType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="On-site">On-site</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                    <Select
                      value={formData.experienceLevel}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, experienceLevel: value }))}
                    >
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry-level">Entry-level</SelectItem>
                        <SelectItem value="Mid-level">Mid-level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Salary Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Compensation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                      <Input
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => setFormData((prev) => ({ ...prev, salaryMin: e.target.value }))}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
                      <Input
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => setFormData((prev) => ({ ...prev, salaryMax: e.target.value }))}
                        placeholder="80000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <Textarea
                      required
                      rows={8}
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Provide a detailed description of the role, company culture, and what makes this opportunity unique..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Key Responsibilities</CardTitle>
                    <Button type="button" variant="outline" onClick={() => addListItem("responsibilities")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Responsibility
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={responsibility}
                        onChange={(e) => updateListItem("responsibilities", index, e.target.value)}
                        placeholder="e.g. Develop and maintain web applications using React"
                      />
                      {formData.responsibilities.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeListItem("responsibilities", index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Requirements</CardTitle>
                    <Button type="button" variant="outline" onClick={() => addListItem("requirements")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Requirement
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={requirement}
                        onChange={(e) => updateListItem("requirements", index, e.target.value)}
                        placeholder="e.g. 3+ years of experience with React and TypeScript"
                      />
                      {formData.requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeListItem("requirements", index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g. React, TypeScript, Node.js"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill}>
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Benefits & Perks</CardTitle>
                    <Button type="button" variant="outline" onClick={() => addListItem("benefits")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Benefit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => updateListItem("benefits", index, e.target.value)}
                        placeholder="e.g. Health insurance, 401(k) matching, flexible PTO"
                      />
                      {formData.benefits.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeListItem("benefits", index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Application Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                      <Input
                        type="date"
                        value={formData.applicationDeadline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, applicationDeadline: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Application URL (Optional)</label>
                      <Input
                        type="url"
                        value={formData.applicationUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, applicationUrl: e.target.value }))}
                        placeholder="https://company.com/apply"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Job
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </div>
            </form>
          ) : (
            /* Job Preview */
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{formData.title || "Job Title"}</h1>
                      <p className="text-xl text-gray-600 mb-3">{formData.company || "Company Name"}</p>
                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{formData.location || "Location"}</span>
                      </div>
                      <div className="flex gap-2">
                        {formData.jobType && <Badge variant="secondary">{formData.jobType}</Badge>}
                        {formData.workType && <Badge variant="outline">{formData.workType}</Badge>}
                        {formData.experienceLevel && <Badge variant="outline">{formData.experienceLevel}</Badge>}
                      </div>
                    </div>
                  </div>

                  {(formData.salaryMin || formData.salaryMax) && (
                    <div className="flex items-center mb-6">
                      <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-600">
                        {formData.salaryMin && formData.salaryMax
                          ? `${formData.currency} ${formData.salaryMin} - ${formData.salaryMax}`
                          : formData.salaryMin
                            ? `From ${formData.currency} ${formData.salaryMin}`
                            : `Up to ${formData.currency} ${formData.salaryMax}`}
                      </span>
                    </div>
                  )}

                  <Button size="lg" className="mb-8">
                    Apply Now
                  </Button>

                  {formData.description && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{formData.description}</p>
                    </div>
                  )}

                  {formData.responsibilities.some((r) => r.trim()) && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Key Responsibilities</h2>
                      <ul className="space-y-2">
                        {formData.responsibilities
                          .filter((r) => r.trim())
                          .map((responsibility, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-gray-700">{responsibility}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {formData.requirements.some((r) => r.trim()) && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                      <ul className="space-y-2">
                        {formData.requirements
                          .filter((r) => r.trim())
                          .map((requirement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-gray-700">{requirement}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {formData.skills.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.benefits.some((b) => b.trim()) && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Benefits & Perks</h2>
                      <ul className="space-y-2">
                        {formData.benefits
                          .filter((b) => b.trim())
                          .map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Edit Job
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
