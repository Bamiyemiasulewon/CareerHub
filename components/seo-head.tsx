import Head from "next/head"

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  siteName?: string
  locale?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  noIndex?: boolean
  noFollow?: boolean
  canonical?: string
  alternates?: Array<{
    hreflang: string
    href: string
  }>
  jsonLd?: object
}

export function SEOHead({
  title = "CareerHub - Find Your Dream Job",
  description = "Discover thousands of job opportunities from top companies. Build your career with CareerHub's advanced job search platform.",
  keywords = "jobs, careers, employment, job search, hiring, recruitment, work opportunities",
  image = "/images/og-image.jpg",
  url = "https://careerhub.com",
  type = "website",
  siteName = "CareerHub",
  locale = "en_US",
  author = "CareerHub Team",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
  noFollow = false,
  canonical,
  alternates = [],
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = title.includes("CareerHub") ? title : `${title} | CareerHub`
  const imageUrl = image.startsWith("http") ? image : `${url}${image}`
  const canonicalUrl = canonical || url

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots Meta Tags */}
      <meta name="robots" content={`${noIndex ? "noindex" : "index"},${noFollow ? "nofollow" : "follow"}`} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Article-specific Open Graph tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@careerhub" />
      <meta name="twitter:creator" content="@careerhub" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#3b82f6" />

      {/* Alternate Language Links */}
      {alternates.map((alternate, index) => (
        <link key={index} rel="alternate" hrefLang={alternate.hreflang} href={alternate.href} />
      ))}

      {/* JSON-LD Structured Data */}
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://api.careerhub.com" />

      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Content Security Policy */}
      <meta
        httpEquiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.careerhub.com https://www.google-analytics.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com;"
      />
    </Head>
  )
}

// Utility function to generate JSON-LD for job postings
export function generateJobPostingJsonLd(job: {
  title: string
  description: string
  company: string
  location: string
  salary?: string
  employmentType: string
  datePosted: string
  validThrough?: string
  requirements?: string[]
  benefits?: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: {
            "@type": "QuantitativeValue",
            value: job.salary,
            unitText: "YEAR",
          },
        }
      : undefined,
    employmentType: job.employmentType.toUpperCase().replace("-", "_"),
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    qualifications: job.requirements?.join(", "),
    benefits: job.benefits?.join(", "),
    url: `https://careerhub.com/jobs/${job.title.toLowerCase().replace(/\s+/g, "-")}`,
  }
}

// Utility function to generate JSON-LD for organization
export function generateOrganizationJsonLd(company: {
  name: string
  description: string
  website: string
  logo?: string
  location: string
  foundingDate?: string
  numberOfEmployees?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    url: company.website,
    logo: company.logo,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.location,
    },
    foundingDate: company.foundingDate,
    numberOfEmployees: company.numberOfEmployees,
    sameAs: [company.website],
  }
}
