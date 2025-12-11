/**
 * Scholarship Results Component
 * Displays matched scholarships with details
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  FileText,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import type { ScholarshipMatch } from '@/types/scholarship'

interface ScholarshipResultsProps {
  matches: ScholarshipMatch[]
  onReset: () => void
}

export function ScholarshipResults({ matches, onReset }: ScholarshipResultsProps) {
  const getChanceColor = (chance: string) => {
    switch (chance) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getChanceIcon = (chance: string) => {
    switch (chance) {
      case 'high':
        return <TrendingUp className="h-4 w-4" />
      case 'medium':
        return <Minus className="h-4 w-4" />
      case 'low':
        return <TrendingDown className="h-4 w-4" />
      default:
        return null
    }
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b] dark:from-gray-900 dark:via-gray-800 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <Card>
            <CardHeader>
              <CardTitle>No Matches Found</CardTitle>
              <CardDescription>
                We couldn't find scholarships matching your profile. Try adjusting your answers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onReset} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b] dark:from-gray-900 dark:via-gray-800 p-4">
      <div className="container mx-auto max-w-5xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Your Scholarship Matches
          </h1>
          <p className="text-lg text-muted-foreground">
            Found {matches.length} scholarship{matches.length !== 1 ? 's' : ''} that match your profile
          </p>
          <Button onClick={onReset} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {matches.map((match, index) => (
            <Card key={match.scholarship.id} className="relative">
              {/* Rank Badge */}
              <div className="absolute -top-3 -left-3">
                <Badge className="bg-[#e5989b] text-white text-lg px-3 py-1">
                  #{index + 1}
                </Badge>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      <Award className="h-6 w-6 text-[#e5989b]" />
                      {match.scholarship.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {match.scholarship.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {match.scholarship.type}
                  </Badge>
                </div>

                {/* Match Score & Chance */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Match Score:</span>
                    <Badge variant="secondary">{match.matchScore}%</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Chance:</span>
                    <Badge className={getChanceColor(match.estimatedChance)}>
                      {getChanceIcon(match.estimatedChance)}
                      <span className="ml-1 capitalize">{match.estimatedChance}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Provider */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Provider</p>
                  <p className="text-base">{match.scholarship.provider}</p>
                </div>

                {/* Match Reasons */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Why This Matches:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {match.matchReasons.map((reason, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Award Details */}
                <div className="grid md:grid-cols-3 gap-4">
                  {match.scholarship.amount && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Amount
                      </p>
                      <p className="text-base font-semibold">{match.scholarship.amount}</p>
                    </div>
                  )}
                  {match.scholarship.duration && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Duration
                      </p>
                      <p className="text-base">{match.scholarship.duration}</p>
                    </div>
                  )}
                  {match.scholarship.applicationDeadline && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Deadline
                      </p>
                      <p className="text-base">{match.scholarship.applicationDeadline}</p>
                    </div>
                  )}
                </div>

                {match.scholarship.coverage && match.scholarship.coverage.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Covers:</p>
                    <div className="flex flex-wrap gap-2">
                      {match.scholarship.coverage.map((item, i) => (
                        <Badge key={i} variant="secondary">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Application Steps */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    How to Apply:
                  </p>
                  <ol className="space-y-2">
                    {match.applicationSteps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e5989b] text-white flex items-center justify-center text-sm font-semibold">
                          {i + 1}
                        </span>
                        <span className="flex-1 text-sm leading-6">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Requirements */}
                {match.scholarship.requirements && match.scholarship.requirements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Requirements:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {match.scholarship.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  {match.scholarship.applicationLink ? (
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d]"
                    >
                      <a
                        href={match.scholarship.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled
                    >
                      Contact Provider for Application Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}



