import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded">
                <span className="font-bold text-lg">GRE</span>
              </div>
              <div>
                <div className="font-bold text-lg">Gift Real Estate</div>
                <div className="text-sm text-gray-300">Premium Properties</div>
              </div>
            </div>
            <p className="text-gray-300">
              Ethiopia's most trusted real estate company since 1990. We specialize in premium 
              residential and commercial properties across Addis Ababa and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white">
                Home
              </Link>
              <Link to="/properties" className="block text-gray-300 hover:text-white">
                Properties
              </Link>
              <Link to="/projects" className="block text-gray-300 hover:text-white">
                Projects
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-white">
                About Us
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Services</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white">
                Property Sales
              </a>
              <a href="#" className="block text-gray-300 hover:text-white">
                Property Rentals
              </a>
              <a href="#" className="block text-gray-300 hover:text-white">
                Property Management
              </a>
              <a href="#" className="block text-gray-300 hover:text-white">
                Investment Consulting
              </a>
              <a href="#" className="block text-gray-300 hover:text-white">
                Valuation Services
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 text-primary-400" />
                <div className="text-gray-300">
                  Bole Road, Atlas Building<br />
                  5th Floor, Office 502<br />
                  Addis Ababa, Ethiopia
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-400" />
                <span className="text-gray-300">+251 911 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-400" />
                <span className="text-gray-300">info@giftrealestate.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © 2024 Gift Real Estate. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-300 mt-2 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}