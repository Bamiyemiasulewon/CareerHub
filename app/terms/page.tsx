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
              <Link href="/jobs" className="text-gray-600 hover:text-primary">
                Jobs
              </Link>
              <Link href="/companies" className="text-gray-600 hover:text-primary">
                Companies
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary">
                Contact
              </Link>
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

          <p className="text-gray-700 mb-6">
            Welcome to CareerHub. These Terms of Service govern your use of our website and services. By accessing or
            using CareerHub, you agree to be bound by these terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this
            agreement. Additionally, when using this website's particular services, you shall be subject to any posted
            guidelines or rules applicable to such services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily download one copy of the materials on CareerHub's website for personal,
            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under
            this license you may not:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the website</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            When you create an account with us, you must provide information that is accurate, complete, and current at
            all times. You are responsible for safeguarding the password and for all activities that occur under your
            account.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
            Service, to understand our practices.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Prohibited Uses</h2>
          <p className="text-gray-700 mb-4">You may not use our service:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>
              To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
            </li>
            <li>
              To infringe upon or violate our intellectual property rights or the intellectual property rights of others
            </li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Content</h2>
          <p className="text-gray-700 mb-4">
            Our Service allows you to post, link, store, share and otherwise make available certain information, text,
            graphics, videos, or other material. You are responsible for the content that you post to the Service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or
            liability, under our sole discretion, for any reason whatsoever and without limitation.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The information on this website is provided on an "as is" basis. To the fullest extent permitted by law,
            this Company excludes all representations, warranties, conditions and terms relating to our website and the
            use of this website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            In no event shall CareerHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential, or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> legal@careerhub.com
              <br />
              <strong>Address:</strong> 123 Career Street, Job City, JC 12345
              <br />
              <strong>Phone:</strong> (555) 123-4567
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 CareerHub. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <Link href="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
