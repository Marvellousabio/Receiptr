"use client"
import Link from 'next/link';
import { motion } from 'framer-motion'; 
import Navbar from '@/components/Navbar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Professional
              <span className="text-blue-600 block">Digital Receipts</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Generate, store, and share professional digital receipts instantly.
              Perfect for small businesses, freelancers, and service providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Receiptr?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage receipts professionally
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div className="bg-white p-8 rounded-lg shadow-sm" variants={itemVariants}>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Generation</h3>
              <p className="text-gray-600">Create professional receipts in seconds with our easy-to-use interface.</p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-lg shadow-sm" variants={itemVariants}>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Sharing</h3>
              <p className="text-gray-600">Share receipts instantly via WhatsApp, email, or direct links.</p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-lg shadow-sm" variants={itemVariants}>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Storage</h3>
              <p className="text-gray-600">All receipts are securely stored and accessible anytime, anywhere.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* How to Generate Receipts Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Generate Receipts in 3 Simple Steps
            </h2>
            <p className="text-lg text-gray-600">
              Get started with Receiptr in minutes
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600">Create your free account and set up your business profile with your logo and details.</p>
            </motion.div>

            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Receipt</h3>
              <p className="text-gray-600">Fill in the receipt details including items, prices, taxes, and customer information.</p>
            </motion.div>

            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share & Store</h3>
              <p className="text-gray-600">Generate your professional receipt and share it instantly or save it for future reference.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied businesses
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div className="bg-white p-8 rounded-lg shadow-sm" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">John Doe</h4>
                  <p className="text-gray-600 text-sm">Freelance Designer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;Receiptr has transformed how I handle my invoices. Professional receipts in seconds!&quot;</p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-lg shadow-sm" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">SM</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah Miller</h4>
                  <p className="text-gray-600 text-sm">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;Easy to use and my clients love the professional look. Highly recommended!&quot;</p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-lg shadow-sm" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">RB</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Robert Brown</h4>
                  <p className="text-gray-600 text-sm">Consultant</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;Secure storage and instant sharing make Receiptr indispensable for my workflow.&quot;</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div variants={itemVariants} className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Receiptr
            </p>
          </div>

          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Is Receiptr free to use?</h3>
              <p className="text-gray-600">Yes, Receiptr offers a free plan that allows you to create up to 50 receipts per month. Premium plans are available for higher usage.</p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I customize my receipts?</h3>
              <p className="text-gray-600">Absolutely! You can add your business logo, customize colors, include your terms and conditions, and personalize the receipt template.</p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How secure are my receipts?</h3>
              <p className="text-gray-600">All receipts are stored securely using industry-standard encryption. Your data is protected and only accessible by you.</p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I share receipts with my clients?</h3>
              <p className="text-gray-600">Yes! You can share receipts via email, WhatsApp, print it, or generate a direct link that your clients can access anytime.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What formats are receipts available in?</h3>
              <p className="text-gray-600">Receipts can be downloaded as PDF files or shared digitally. All formats maintain professional quality.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Newsletter Signup Section */}
      <div className="relative py-24 newsletter-bg">
      <div className='absolute inset-0 bg-blue-900/30 backdrop-blur-sm'></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest updates, tips, and features delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 border-white py-3 rounded-lg border focus:ring-2 focus:ring-white focus:ring-opacity-50"
              // ADDED: For improved accessibility
              aria-label="Enter your email address for newsletter subscription"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of businesses using Receiptr for their receipt management.
          </p>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Receiptr</h3>
              <p className="text-gray-400">
                Professional digital receipt generation for modern businesses.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://x.com/MarvellousAbio5" className="text-gray-400 hover:text-white" title="Follow on X">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/marvellous_ogunleke" className="text-gray-400 hover:text-white" title="Follow on Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M19.35,5.65A1.15,1.15 0 0,1 20.5,6.8A1.15,1.15 0 0,1 19.35,7.95A1.15,1.15 0 0,1 18.2,6.8A1.15,1.15 0 0,1 19.35,5.65Z"/>
                      </svg>
                </a>
                <a href="https://www.linkedin.com/in/marvellous-ogunleke2025" className="text-gray-400 hover:text-white" title="Connect on LinkedIn">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Receiptr. Developed by <a href="https://marvellous-ogunleke.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline">Marvellous Ogunleke</a>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}