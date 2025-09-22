import { Building, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">BhooLink</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted gateway to prime land investments. Discover verified plots and development opportunities across India.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate('home')} className="text-gray-300 hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('properties')} className="text-gray-300 hover:text-white transition-colors">Plots & Land</button></li>
              <li><button onClick={() => onNavigate('properties')} className="text-gray-300 hover:text-white transition-colors">Development Projects</button></li>
              <li><button onClick={() => onNavigate('blog')} className="text-gray-300 hover:text-white transition-colors">Blog</button></li>
              <li><button onClick={() => onNavigate('contact')} className="text-gray-300 hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Buy Land</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sell Land</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Plot Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Title Verification</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Land Investment Advisory</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  123 Business District,<br />
                  Bangalore, Karnataka 560001
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">hello@bhoolink.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 lg:mb-0">
              © 2024 BhooLink. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}