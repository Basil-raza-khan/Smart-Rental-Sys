'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20luxury%20apartment%20building%20exterior%20with%20beautiful%20landscaping%20and%20contemporary%20architecture%20in%20soft%20morning%20light%20with%20clean%20minimalist%20background%20perfect%20for%20real%20estate%20technology%20platform%20showcasing%20smart%20home%20features%20and%20digital%20property%20management%20solutions&width=1920&height=1080&seq=banner001&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <img 
                src="https://public.readdy.ai/ai/img_res/461a8bd4-8f34-4d0d-8764-bc93a46fd029.png" 
                alt="SmartRent Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-3xl font-bold text-white">SmartRent</span>
            </div>
            
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm whitespace-nowrap">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-white text-blue-600 hover:bg-white/90 whitespace-nowrap">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-3xl">
            <motion.h1 
              className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Smart Property Management Made Simple
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Streamline your rental operations with our comprehensive platform. Connect landlords and tenants seamlessly with powerful tools for property management, bookings, and maintenance.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 whitespace-nowrap">
                  Get Started Free
                  <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm text-lg px-8 whitespace-nowrap">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for property owners, tenants, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-home-4-line text-3xl text-blue-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Property Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Create, edit, and manage property listings with ease. Track bookings, set rental rates, and assign properties to tenants efficiently.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-calendar-check-line text-3xl text-green-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Booking System</h3>
              <p className="text-gray-600 leading-relaxed">
                Tenants can browse available properties, view detailed information, and submit booking requests instantly with our intuitive interface.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-tools-line text-3xl text-purple-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Maintenance Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Submit and track maintenance requests seamlessly. Landlords can respond quickly and update status in real-time for better communication.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-star-line text-3xl text-yellow-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Review & Rating System</h3>
              <p className="text-gray-600 leading-relaxed">
                Build trust with transparent reviews. Tenants can rate properties and landlords can respond to feedback for continuous improvement.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-shield-user-line text-3xl text-red-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Control Panel</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive admin dashboard to manage users, properties, bookings, and reviews. Full control over platform operations and user management.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-lock-line text-3xl text-indigo-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Role-Based Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Secure authentication with role-specific dashboards for property owners, tenants, and administrators. Each user sees only what they need.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Browse Available Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find your perfect rental property from our curated collection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Property cards will be populated from API */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <i className="ri-home-4-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Luxury Downtown Apartment</h3>
              <p className="text-gray-600 mb-4">Beautiful 2-bedroom apartment in the heart of downtown</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$3,500/mo</span>
                <Button size="sm">View Details</Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <i className="ri-building-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Studio Apartment</h3>
              <p className="text-gray-600 mb-4">Cozy studio perfect for young professionals</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$1,800/mo</span>
                <Button size="sm">View Details</Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <i className="ri-community-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Spacious Family Home</h3>
              <p className="text-gray-600 mb-4">4-bedroom house with garden in quiet neighborhood</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$4,200/mo</span>
                <Button size="sm">View Details</Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/properties">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                View All Properties
                <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Property Management?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of property owners and tenants who trust SmartRent for their rental needs
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 whitespace-nowrap">
                Start Your Free Trial
                <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://public.readdy.ai/ai/img_res/461a8bd4-8f34-4d0d-8764-bc93a46fd029.png" 
                  alt="SmartRent" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold">SmartRent</span>
              </div>
              <p className="text-gray-400">
                Modern property management platform for the digital age
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a></li>
                <li><a href="https://readdy.ai/?origin=logo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Made with Readdy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SmartRent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
