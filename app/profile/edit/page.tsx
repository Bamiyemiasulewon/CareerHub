"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Upload, Plus, X, Save } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { useAuthStore } from "@/lib/store"
import { api } from "@/lib/api"

interface ProfileData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    website?: string
    linkedin?: string
    github?: string
  }
  summary: string
  experience: Array<{
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    degree: string
    school: string
    location: string
    startDate: string
    endDate: string
    gpa?: string
  }>
  skills: string[]
  preferences: {
    salary: { min: number; max: number }
    jobType: string
    remote: boolean
    locations: string[]
  }
}

export default function EditProfilePage() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    preferences: {
      salary: { min: 50000, max: 150000 },
      jobType: "Full-time",
      remote: false,
      locations: [],
    },
  })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const profile = await api.profile.get(user.id)
        setProfileData(profile)
      } catch (error) {
        console.error("Failed to load profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      await api.profile.update(user.id, profileData)
      // Show success message
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setProfileData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
  }

  const removeExperience = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const updateExperience = (id: string, field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }
    setProfileData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const removeEducation = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const updateEducation = (id: string, field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
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
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
            <p className="text-gray-600">Update your information to attract the right opportunities</p>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills & Preferences</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <Input
                        value={profileData.personalInfo.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, name: e.target.value },
                          }))
                        }
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          className="pl-10"
                          value={profileData.personalInfo.email}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, email: e.target.value },
                            }))
                          }
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="tel"
                          className="pl-10"
                          value={profileData.personalInfo.phone}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, phone: e.target.value },
                            }))
                          }
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-10"
                          value={profileData.personalInfo.location}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, location: e.target.value },
                            }))
                          }
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <Input
                        type="url"
                        value={profileData.personalInfo.website || ""}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, website: e.target.value },
                          }))
                        }
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <Input
                        type="url"
                        value={profileData.personalInfo.linkedin || ""}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, linkedin: e.target.value },
                          }))
                        }
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                      <Input
                        type="url"
                        value={profileData.personalInfo.github || ""}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, github: e.target.value },
                          }))
                        }
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drop your resume here, or <span className="text-primary">browse</span>
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Summary */}
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tell employers about yourself
                    </label>
                    <Textarea
                      rows={8}
                      value={profileData.summary}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          summary: e.target.value,
                        }))
                      }
                      placeholder="Write a compelling summary that highlights your experience, skills, and career goals..."
                      className="resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-2">{profileData.summary.length}/500 characters</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Work Experience */}
            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Work Experience
                    </CardTitle>
                    <Button onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileData.experience.map((exp, index) => (
                    <div key={exp.id} className="border rounded-lg p-6 relative">
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            placeholder="e.g. Senior Software Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="e.g. TechCorp Inc."
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                            placeholder="e.g. San Francisco, CA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onCheckedChange={(checked) => updateExperience(exp.id, "current", checked)}
                          />
                          <label htmlFor={`current-${exp.id}`} className="text-sm">
                            I currently work here
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Textarea
                          rows={4}
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  ))}

                  {profileData.experience.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No work experience added yet</p>
                      <p className="text-sm">Click "Add Experience" to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education
                    </CardTitle>
                    <Button onClick={addEducation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileData.education.map((edu) => (
                    <div key={edu.id} className="border rounded-lg p-6 relative">
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            placeholder="e.g. Bachelor of Science in Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
                          <Input
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                            placeholder="e.g. University of California, Berkeley"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                            placeholder="e.g. Berkeley, CA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                          <Input
                            value={edu.gpa || ""}
                            onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                            placeholder="3.8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {profileData.education.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No education added yet</p>
                      <p className="text-sm">Click "Add Education" to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills & Preferences */}
            <TabsContent value="skills">
              <div className="space-y-6">
                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Skills</label>
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="e.g. React, Python, Project Management"
                          onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button onClick={addSkill}>Add</Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-2 text-gray-500 hover:text-red-500">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {profileData.skills.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No skills added yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Job Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Desired Salary Range</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={profileData.preferences.salary.min}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  salary: { ...prev.preferences.salary, min: Number.parseInt(e.target.value) || 0 },
                                },
                              }))
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={profileData.preferences.salary.max}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  salary: { ...prev.preferences.salary, max: Number.parseInt(e.target.value) || 0 },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                        <Select
                          value={profileData.preferences.jobType}
                          onValueChange={(value) =>
                            setProfileData((prev) => ({
                              ...prev,
                              preferences: { ...prev.preferences, jobType: value },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remote"
                        checked={profileData.preferences.remote}
                        onCheckedChange={(checked) =>
                          setProfileData((prev) => ({
                            ...prev,
                            preferences: { ...prev.preferences, remote: checked as boolean },
                          }))
                        }
                      />
                      <label htmlFor="remote" className="text-sm">
                        Open to remote work
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button onClick={handleSave} disabled={isSaving} size="lg">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
