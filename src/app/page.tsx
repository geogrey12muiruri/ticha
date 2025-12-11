import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, MessageSquare, Brain, Globe, Smartphone, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight leading-tight">
            Jifunze AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-3 font-medium leading-relaxed">
            Your AI-Powered Learning Companion
          </p>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-500 leading-7 max-w-2xl mx-auto">
            Built for Kenya. Built for Africa. Built for You.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-6 w-6 text-[#b5838d]" />
                Bilingual Tutor
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Learn in Kiswahili or English. Our AI understands both languages and can code-switch naturally.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="h-6 w-6 text-[#e5989b]" />
                Kenyan Curriculum
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Aligned with 8-4-4 and CBC curricula. Get help with KCPE, KCSE, and all subjects.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Brain className="h-6 w-6 text-[#b5838d]" />
                Culturally Relevant
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Examples from Kenyan life, culture, and geography make learning relatable and engaging.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* More Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Smartphone className="h-6 w-6 text-[#ffb4a2]" />
                Mobile-First
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Works on low-end phones with limited data. Optimized for Kenya's mobile-first internet.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Zap className="h-6 w-6 text-[#e5989b]" />
                Instant Answers
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Get explanations, practice questions, and feedback instantly. No waiting, no delays.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Globe className="h-6 w-6 text-[#b5838d]" />
                Made for Africa
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Built by Africans, for Africans. Addressing real challenges in Kenyan education.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[#e5989b] to-[#b5838d] text-white border-0">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl mb-3 font-bold tracking-tight">
                Ready to Start Learning?
              </CardTitle>
              <CardDescription className="text-white/90 text-base md:text-lg leading-7">
                Join thousands of Kenyan students using AI to excel in their studies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Sign Up Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
