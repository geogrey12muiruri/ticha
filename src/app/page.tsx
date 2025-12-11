'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Search, Shield, BookOpen, MapPin, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight leading-tight">
            EduPath
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-3 font-medium leading-relaxed">
            Your Gateway to Education Access
          </p>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-500 leading-7 max-w-2xl mx-auto">
            Discover verified scholarships, bursaries, and educational opportunities across Kenya. 
            Find the right path to your future.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Shield className="h-6 w-6 text-[#b5838d]" />
                Verified Opportunities
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                All opportunities are verified from official sources including Kenya Ministry of Education, 
                NG-CDF, and County Governments.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Search className="h-6 w-6 text-[#e5989b]" />
                Smart Matching
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Our AI-powered system matches you with opportunities based on your profile, 
                location, and academic goals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <GraduationCap className="h-6 w-6 text-[#b5838d]" />
                Education Access
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Breaking down barriers to education. Find scholarships, bursaries, bootcamps, 
                and learning opportunities that fit your path.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* More Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-6 w-6 text-[#ffb4a2]" />
                Location-Based
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Find opportunities specific to your county and constituency. 
                Local scholarships, bursaries, and programs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="h-6 w-6 text-[#e5989b]" />
                Comprehensive Database
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Access to scholarships, bursaries, grants, bootcamps, learning opportunities, 
                mentorships, and internships all in one place.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Users className="h-6 w-6 text-[#b5838d]" />
                Made for Kenya
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Built by Kenyans, for Kenyans. Addressing real challenges in education access 
                across all 47 counties.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[#e5989b] to-[#b5838d] text-white border-0">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl mb-3 font-bold tracking-tight">
                Ready to Find Your Path?
              </CardTitle>
              <CardDescription className="text-white/90 text-base md:text-lg leading-7">
                Create a free profile to get personalized scholarship matches and access 
                to exclusive opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
