import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              CareerHub
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/jobs" className="text-gray-600 hover:text-primary">Jobs</Link>
              <Link href="/companies" className="text-gray-600 hover:text-primary">Companies</Link>
              <Link href="/about" className="text-gray-600 hover:text-primary">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 prose max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> January 1, 2024
          </p>

          <p className="text\
