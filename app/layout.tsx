import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CareerHub - Find Your Dream Job",
  description:
    "Connect with top employers and discover career opportunities that match your ambitions. Join over 1 million professionals who found their dream jobs.",
  keywords: "jobs, careers, employment, hiring, job search, remote work, tech jobs",
  authors: [{ name: "CareerHub Team" }],
  creator: "CareerHub",
  publisher: "CareerHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://careerhub.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CareerHub - Find Your Dream Job",
    description: "Connect with top employers and discover career opportunities that match your ambitions.",
    url: "https://careerhub.com",
    siteName: "CareerHub",
    images: [
      {
        url: "/images/careerhub-og.png",
        width: 1200,
        height: 630,
        alt: "CareerHub - Find Your Dream Job",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerHub - Find Your Dream Job",
    description: "Connect with top employers and discover career opportunities that match your ambitions.",
    images: ["/images/careerhub-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
