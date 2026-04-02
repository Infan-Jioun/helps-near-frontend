"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-tr from-red-50 via-white to-orange-50 py-16 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10 text-gray-700">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Helps Near</h3>
            <p className="text-sm">
              Community-driven emergency response platform connecting volunteers to those in need. Fast, reliable, and always nearby.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-red-600" />
              Dhaka, Bangladesh
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Phone className="w-4 h-4 text-red-600" />
              <a href="tel:999" className="hover:underline font-medium">999</a>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Mail className="w-4 h-4 text-red-600" />
              <a href="mailto:help@near.com" className="hover:underline font-medium">help@near.com</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-red-600">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-red-600">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-600">Contact</Link>
              </li>
              <li>
                <Link href="/volunteer-register" className="hover:text-red-600">Become a Volunteer</Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Get Started</h3>
            <p className="text-sm mb-4">Report an emergency or join our community of volunteers.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
                asChild
              >
                <Link href="/dashboard/user/create-emergency">Report Emergency</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="px-4 py-2 rounded-lg text-red-600 border-red-300 hover:bg-red-50"
                asChild
              >
                <Link href="/volunteer-register">Join as Volunteer</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Helps Near — All rights reserved.
        </div>
      </div>
    </footer>
  )
}