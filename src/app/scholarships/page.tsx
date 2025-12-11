/**
 * Scholarships Page
 * Main page for scholarship matching
 */

'use client'

import { useState } from 'react'
import { ScholarshipQuestionnaire } from '@/components/features/scholarship/ScholarshipQuestionnaire'
import { ScholarshipResults } from '@/components/features/scholarship/ScholarshipResults'
import { ScholarshipService } from '@/services/scholarship.service'
import type { ScholarshipProfile, ScholarshipMatch } from '@/types/scholarship'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Search, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'

export default function ScholarshipsPage() {
  const [matches, setMatches] = useState<ScholarshipMatch[] | null>(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState(true)

  const handleComplete = (profile: ScholarshipProfile) => {
    const results = ScholarshipService.matchScholarships(profile)
    setMatches(results)
    setShowQuestionnaire(false)
  }

  const handleReset = () => {
    setMatches(null)
    setShowQuestionnaire(true)
  }

  if (matches !== null) {
    return <ScholarshipResults matches={matches} onReset={handleReset} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b] dark:from-gray-900 dark:via-gray-800 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e5989b] to-[#b5838d] mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#e5989b] to-[#b5838d] bg-clip-text text-transparent mb-3">
            Find Your Scholarships
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions and discover scholarships, bursaries, and funding opportunities
            that match your profile
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5 text-[#e5989b]" />
                Smart Matching
              </CardTitle>
              <CardDescription>
                AI-powered matching based on your profile
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-[#b5838d]" />
                Ranked Results
              </CardTitle>
              <CardDescription>
                See your best matches first
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-[#e5989b]" />
                Application Steps
              </CardTitle>
              <CardDescription>
                Get clear instructions for each scholarship
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Questionnaire */}
        {showQuestionnaire && (
          <ScholarshipQuestionnaire onComplete={handleComplete} />
        )}

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <Link href={ROUTES.DASHBOARD}>
            <Button variant="ghost">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}



