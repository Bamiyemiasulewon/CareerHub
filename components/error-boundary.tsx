"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
}

interface ErrorFallbackProps {
  error: Error | null
  errorInfo: React.ErrorInfo | null
  resetError: () => void
  showDetails?: boolean
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to monitoring service
    this.logError(error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  logError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In production, send to error monitoring service like Sentry
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error, { extra: errorInfo })
      console.error("Error caught by boundary:", error, errorInfo)
    } else {
      console.error("Error caught by boundary:", error, errorInfo)
    }

    // Send to analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: error.message,
        fatal: false,
      })
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          showDetails={this.props.showDetails}
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, errorInfo, resetError, showDetails = false }: ErrorFallbackProps) {
  const [showErrorDetails, setShowErrorDetails] = React.useState(false)

  const handleReportError = () => {
    // In production, this would open a support ticket or send to error reporting
    const errorReport = {
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    console.log("Error report:", errorReport)

    // Example: Send to support system
    // fetch('/api/error-reports', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // })

    alert("Error report sent. Thank you for helping us improve CareerHub!")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Oops! Something went wrong</CardTitle>
          <p className="text-gray-600 mt-2">
            We're sorry for the inconvenience. An unexpected error occurred while loading this page.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={resetError} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            <Button variant="outline" onClick={handleReportError}>
              <Bug className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>

          {/* Error Details Toggle */}
          {(showDetails || process.env.NODE_ENV === "development") && (
            <div className="border-t pt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowErrorDetails(!showErrorDetails)} className="mb-4">
                {showErrorDetails ? "Hide" : "Show"} Error Details
              </Button>

              {showErrorDetails && (
                <div className="space-y-4">
                  {error && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Error Message:</h4>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto text-red-600">{error.message}</pre>
                    </div>
                  )}

                  {error?.stack && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Stack Trace:</h4>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">{error.stack}</pre>
                    </div>
                  )}

                  {errorInfo?.componentStack && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Component Stack:</h4>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 border-t pt-6">
            <p>
              If this problem persists, please contact our support team at{" "}
              <a href="mailto:support@careerhub.com" className="text-primary hover:underline">
                support@careerhub.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Specialized error boundaries for different sections
export function JobSearchErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load job search</h3>
          <p className="text-gray-600 mb-4">There was an error loading the job search. Please try again.</p>
          <Button onClick={resetError}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Search
          </Button>
        </div>
      )}
      onError={(error, errorInfo) => {
        // Log specific to job search errors
        console.error("Job search error:", error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export function ProfileErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load profile</h3>
          <p className="text-gray-600 mb-4">There was an error loading your profile. Please try refreshing the page.</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={resetError}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

// Hook for handling async errors in components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)

    // Log to monitoring service
    if (process.env.NODE_ENV === "production") {
      console.error("Async error captured:", error)
    }
  }, [])

  // Throw error to be caught by error boundary
  if (error) {
    throw error
  }

  return { captureError, resetError }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
