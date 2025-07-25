import Link from "next/link"

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 prose max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> January 1, 2024
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            At CareerHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website and use our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Personal Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Register for an account</li>
            <li>Apply for jobs through our platform</li>
            <li>Contact us with inquiries</li>
            <li>Subscribe to our newsletter</li>
            <li>Participate in surveys or promotions</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Automatically Collected Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you visit our website, we may automatically collect certain information about your device, including:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website addresses</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Providing and maintaining our services</li>
            <li>Processing job applications and connecting you with employers</li>
            <li>Sending you relevant job recommendations</li>
            <li>Communicating with you about our services</li>
            <li>Improving our website and user experience</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information Sharing and Disclosure</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may share your information in the following situations:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>
              <strong>With Employers:</strong> When you apply for jobs, we share relevant information with potential
              employers
            </li>
            <li>
              <strong>Service Providers:</strong> We may share information with third-party service providers who assist
              us in operating our platform
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our
              rights
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger or acquisition, your information may be
              transferred
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We implement appropriate technical and organizational security measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
            the internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights and Choices</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You have certain rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>
              <strong>Access:</strong> You can request access to your personal information
            </li>
            <li>
              <strong>Correction:</strong> You can request correction of inaccurate information
            </li>
            <li>
              <strong>Deletion:</strong> You can request deletion of your personal information
            </li>
            <li>
              <strong>Opt-out:</strong> You can opt out of marketing communications
            </li>
            <li>
              <strong>Data Portability:</strong> You can request a copy of your data in a portable format
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We use cookies and similar tracking technologies to enhance your experience on our website. You can control
            cookie settings through your browser preferences, but disabling cookies may affect the functionality of our
            services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Links</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or
            content of these external sites. We encourage you to review the privacy policies of any third-party sites
            you visit.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our services are not intended for individuals under the age of 16. We do not knowingly collect personal
            information from children under 16. If we become aware that we have collected such information, we will take
            steps to delete it promptly.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy
            Policy periodically.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <ul className="list-none mb-6 text-gray-700">
            <li>
              <strong>Email:</strong> privacy@careerhub.com
            </li>
            <li>
              <strong>Phone:</strong> +1 (555) 123-4567
            </li>
            <li>
              <strong>Address:</strong> 123 Innovation Street, San Francisco, CA 94105
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
