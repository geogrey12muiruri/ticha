'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Award,
  FileText,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { ROUTES, OPPORTUNITY_TYPE_LABELS } from '@/constants'
import type { Scholarship } from '@/types/scholarship'
import { DashboardLayout } from '@/components/shared/DashboardLayout'
import { getUserWithOfflineFallback } from '@/lib/supabaseClient'

export default function ScholarshipDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [scholarship, setScholarship] = useState<Scholarship | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchScholarship()
  }, [params.id])

  const checkUser = async () => {
    const { user: currentUser } = await getUserWithOfflineFallback()
    if (!currentUser) {
      router.push(ROUTES.LOGIN)
      return
    }
    setUser(currentUser)
  }

  const fetchScholarship = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try API first
      const response = await fetch(`/api/scholarships/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          // Try mock data as fallback
          console.log('API returned 404, trying mock data...')
          const { ScholarshipAPIService } = await import('@/services/scholarship-api.service')
          const mockScholarship = await ScholarshipAPIService.fetchScholarshipById(params.id as string)
          
          if (mockScholarship) {
            setScholarship(mockScholarship)
            return
          }
          
          setError('Scholarship not found')
        } else {
          throw new Error('Failed to fetch scholarship')
        }
        return
      }

      const data = await response.json()
      setScholarship(data.scholarship || null)
    } catch (err: any) {
      console.error('Error fetching scholarship:', err)
      
      // Fallback to mock data
      try {
        const { ScholarshipAPIService } = await import('@/services/scholarship-api.service')
        const mockScholarship = await ScholarshipAPIService.fetchScholarshipById(params.id as string)
        
        if (mockScholarship) {
          console.log('Using mock data as fallback')
          setScholarship(mockScholarship)
          return
        }
      } catch (mockError) {
        console.error('Mock data fallback also failed:', mockError)
      }
      
      setError(err.message || 'Failed to load scholarship')
    } finally {
      setLoading(false)
    }
  }

  const formatDeadline = (deadline?: string | Date) => {
    if (!deadline) return 'Not specified'
    const date = new Date(deadline)
    if (isNaN(date.getTime())) return 'Not specified'
    return date.toLocaleDateString('en-KE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const isUpcoming = (deadline?: string | Date) => {
    if (!deadline) return false
    const date = new Date(deadline)
    if (isNaN(date.getTime())) return false
    return date > new Date()
  }

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading scholarship details...
          </span>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !scholarship) {
    return (
      <DashboardLayout user={user}>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Error loading scholarship</p>
                <p className="text-sm text-red-500 dark:text-red-400">{error || 'Scholarship not found'}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" onClick={fetchScholarship}>
                    Try Again
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href={ROUTES.DASHBOARD}>Back to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-4">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href={ROUTES.DASHBOARD}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Scholarship Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">
                    {OPPORTUNITY_TYPE_LABELS[scholarship.type] || scholarship.type}
                  </Badge>
                  {scholarship.category && (
                    <Badge variant="outline">{scholarship.category}</Badge>
                  )}
                  {isUpcoming(scholarship.applicationDeadline) && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Open for Applications
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-2">
                  {scholarship.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-base">
                  <GraduationCap className="h-4 w-4" />
                  {scholarship.provider}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {scholarship.description}
            </p>

            {/* Key Information */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {scholarship.amount && (
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#e5989b]" />
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-semibold">{scholarship.amount}</p>
                  </div>
                </div>
              )}
              
              {scholarship.duration && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#b5838d]" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{scholarship.duration}</p>
                  </div>
                </div>
              )}

              {scholarship.applicationDeadline && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#e5989b]" />
                  <div>
                    <p className="text-sm text-muted-foreground">Application Deadline</p>
                    <p className="font-semibold">{formatDeadline(scholarship.applicationDeadline)}</p>
                  </div>
                </div>
              )}

              {scholarship.eligibility?.counties && scholarship.eligibility.counties.length > 0 && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#b5838d]" />
                  <div>
                    <p className="text-sm text-muted-foreground">Eligible Counties</p>
                    <p className="font-semibold">
                      {scholarship.eligibility.counties.length === 1
                        ? scholarship.eligibility.counties[0]
                        : `${scholarship.eligibility.counties.length} counties`
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Coverage */}
            {scholarship.coverage && scholarship.coverage.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">What's Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {scholarship.coverage.map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility Requirements */}
            {scholarship.eligibility && Object.keys(scholarship.eligibility).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Eligibility Requirements</h3>
                <div className="space-y-2">
                  {scholarship.eligibility.minKCSE && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Minimum KCSE: {scholarship.eligibility.minKCSE}</span>
                    </div>
                  )}
                  {scholarship.eligibility.minKCPE && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Minimum KCPE: {scholarship.eligibility.minKCPE}</span>
                    </div>
                  )}
                  {scholarship.eligibility.curriculum && scholarship.eligibility.curriculum.length > 0 && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        Curriculum: {scholarship.eligibility.curriculum.join(', ')}
                      </span>
                    </div>
                  )}
                  {scholarship.eligibility.fieldOfStudy && scholarship.eligibility.fieldOfStudy.length > 0 && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        Fields: {scholarship.eligibility.fieldOfStudy.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Requirements */}
            {scholarship.requirements && scholarship.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {scholarship.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Documents Needed */}
            {scholarship.documents && scholarship.documents.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Required Documents</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {scholarship.documents.map((doc, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bootcamp Details */}
            {scholarship.bootcampDetails && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Bootcamp Details</h3>
                <div className="space-y-2 text-sm">
                  {scholarship.bootcampDetails.duration && (
                    <p><strong>Duration:</strong> {scholarship.bootcampDetails.duration}</p>
                  )}
                  {scholarship.bootcampDetails.format && (
                    <p><strong>Format:</strong> {scholarship.bootcampDetails.format}</p>
                  )}
                  {scholarship.bootcampDetails.skillsTaught && scholarship.bootcampDetails.skillsTaught.length > 0 && (
                    <div>
                      <strong>Skills Taught:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {scholarship.bootcampDetails.skillsTaught.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Learning Details */}
            {scholarship.learningDetails && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Learning Details</h3>
                <div className="space-y-2 text-sm">
                  {scholarship.learningDetails.duration && (
                    <p><strong>Duration:</strong> {scholarship.learningDetails.duration}</p>
                  )}
                  {scholarship.learningDetails.format && (
                    <p><strong>Format:</strong> {scholarship.learningDetails.format}</p>
                  )}
                  {scholarship.learningDetails.certification && (
                    <p><strong>Certification:</strong> Available</p>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {scholarship.notes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Additional Notes</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{scholarship.notes}</p>
              </div>
            )}

            {/* Contact Information */}
            {scholarship.contactInfo && Object.keys(scholarship.contactInfo).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  {(scholarship.contactInfo as any)?.source && (
                    <p><strong>Source:</strong> {(scholarship.contactInfo as any).source}</p>
                  )}
                  {(scholarship.contactInfo as any)?.website && (
                    <p>
                      <strong>Website:</strong>{' '}
                      <a 
                        href={(scholarship.contactInfo as any).website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {(scholarship.contactInfo as any).website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  )}
                  {scholarship.contactInfo.email && (
                    <p><strong>Email:</strong> {scholarship.contactInfo.email}</p>
                  )}
                  {scholarship.contactInfo.phone && (
                    <p><strong>Phone:</strong> {scholarship.contactInfo.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Application Button */}
            <div className="pt-4 border-t">
              {scholarship.applicationLink ? (
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d]"
                >
                  <a
                    href={scholarship.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Globe className="h-5 w-5" />
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled
                >
                  Contact Provider for Application Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

