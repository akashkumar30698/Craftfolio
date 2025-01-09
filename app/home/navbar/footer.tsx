"use client"


import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Craftfolio</h2>
            <p className="mb-4">Empowering creatives to showcase their work. Build stunning portfolios and deploy them effortlessly with our platform.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/portfoliocreator" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/portfoliocreator" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com/portfoliocreator" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com/company/portfoliocreator" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors duration-300">Features</Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-white transition-colors duration-300">Templates</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors duration-300">Pricing</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors duration-300">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={18} className="mr-2" />
                <span>456 Creator Avenue, Portfolio City, 67890</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2" />
                <span>+1 (555) 987-6543</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2" />
                <span>support@portfoliocreator.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Craftfolio. All rights reserved.</p>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer

