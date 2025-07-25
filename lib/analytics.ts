// Google Analytics and tracking utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track job applications
export const trackJobApplication = (jobId: string, jobTitle: string) => {
  event({
    action: "apply_job",
    category: "engagement",
    label: `${jobId}: ${jobTitle}`,
  })
}

// Track job saves
export const trackJobSave = (jobId: string, jobTitle: string) => {
  event({
    action: "save_job",
    category: "engagement",
    label: `${jobId}: ${jobTitle}`,
  })
}

// Track search queries
export const trackSearch = (query: string, location?: string) => {
  event({
    action: "search",
    category: "engagement",
    label: `${query}${location ? ` in ${location}` : ""}`,
  })
}

// Track user registration
export const trackRegistration = (userType: "job-seeker" | "employer") => {
  event({
    action: "sign_up",
    category: "user",
    label: userType,
  })
}
