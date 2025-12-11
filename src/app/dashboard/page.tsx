/**
 * Student Dashboard
 * Main dashboard for students after login
 * Modern design without cards - clean, professional, mobile-first
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserWithOfflineFallback } from '@/lib/supabaseClient'
import { isOnline } from '@/lib/offlineAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  FileText, 
  Award, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Calendar,
  Download,
  ArrowRight,
  WifiOff,
  Target,
  Zap,
  User,
  MoreHorizontal,
  Code,
  GraduationCap,
  Laptop,
  Users,
  Briefcase,
  UserCircle,
  Filter,
  ExternalLink,
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { ROUTES, OPPORTUNITY_TYPE_LABELS } from '@/constants'
import { useRBAC } from '@/hooks/useRBAC'
import { MinimalProfileWizard } from '@/components/features/profile/MinimalProfileWizard'
import type { StudentProfile } from '@/types/student-profile'
import { ScholarshipAPIService } from '@/services/scholarship-api.service'
import { DashboardLayout } from '@/components/shared/DashboardLayout'
import type { ScholarshipProfile, ScholarshipMatch, OpportunityType, Scholarship } from '@/types/scholarship'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCountyNames } from '@/constants/locations'

// Helper function to get icon for opportunity type
const getOpportunityIcon = (type: OpportunityType) => {
  switch (type) {
    case 'bootcamp':
      return <Code className="h-5 w-5 text-white" />
    case 'learning':
      return <GraduationCap className="h-5 w-5 text-white" />
    case 'mentorship':
      return <UserCircle className="h-5 w-5 text-white" />
    case 'internship':
      return <Briefcase className="h-5 w-5 text-white" />
    default:
      return <Award className="h-5 w-5 text-white" />
  }
}

// Helper function to get badge variant for type
const getTypeVariant = (type: OpportunityType): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case 'bootcamp':
      return 'default'
    case 'learning':
      return 'secondary'
    case 'mentorship':
      return 'default'
    case 'internship':
      return 'secondary'
    default:
      return 'outline'
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)
  const [showProfileWizard, setShowProfileWizard] = useState(false)
  const [matches, setMatches] = useState<ScholarshipMatch[]>([])
  const [profile, setProfile] = useState<ScholarshipProfile | null>(null)
  const router = useRouter()
  const { role, isStudent } = useRBAC()
  
  // Scholarship search state
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCounty, setSelectedCounty] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { user: currentUser } = await getUserWithOfflineFallback()
    if (!currentUser) {
      router.push(ROUTES.LOGIN)
      return
    }
    setUser(currentUser)
    
    // Check if profile exists in localStorage
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('student_profile')
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile) as Partial<StudentProfile>
          
          // Validate required fields
          const hasRequiredFields = 
            parsedProfile.personal?.county &&
            parsedProfile.personal?.firstName &&
            parsedProfile.academicStage?.stage
          
          if (hasRequiredFields) {
            // Map to legacy format for compatibility
            const legacyProfile: ScholarshipProfile = {
              county: parsedProfile.personal?.county,
              constituency: parsedProfile.personal?.constituency,
              currentSchool: parsedProfile.personal?.schoolName,
              grade: parseInt(parsedProfile.academicStage?.currentClassOrLevel?.match(/\d+/)?.[0] || '0'),
              curriculum: parsedProfile.academicStage?.stage === 'JuniorSecondary' || parsedProfile.academicStage?.stage === 'Primary' ? 'CBC' : '8-4-4',
              subjects: parsedProfile.subjectsCompetencies?.subjectsTaken || [],
              careerInterest: parsedProfile.careerGoals?.longTerm,
              careerGoals: parsedProfile.careerGoals?.longTerm ? [parsedProfile.careerGoals.longTerm] : [],
              currentSkills: parsedProfile.skillsAndCertifications?.map((s: any) => s.skill) || [],
              skillsWanted: parsedProfile.skillsAndCertifications?.filter((s: any) => s.proficiency === 'Beginner').map((s: any) => s.skill) || [],
              learningGoals: parsedProfile.careerGoals?.shortTerm ? [parsedProfile.careerGoals.shortTerm] : [],
              preferredField: parsedProfile.subjectsCompetencies?.preferredStream,
              projects: parsedProfile.projectsPortfolio || [],
              extracurriculars: parsedProfile.extracurricularsAndAwards?.map((a: any) => a.type) || [],
              achievements: parsedProfile.extracurricularsAndAwards?.map((a: any) => a.type) || [],
              languages: parsedProfile.accessAndReadiness?.preferredLanguage ? [parsedProfile.accessAndReadiness.preferredLanguage] : [],
            }
            
            setProfile(legacyProfile)
            setProfileComplete(true)
            setShowProfileWizard(false)
            
            // Load matches with the loaded profile (use setTimeout to ensure state is set)
            setTimeout(() => {
              loadMatches(legacyProfile)
            }, 100)
          } else {
            // Profile incomplete, show wizard
            console.log('Profile missing required fields, showing wizard')
            setShowProfileWizard(true)
          }
        } catch (error) {
          console.error('Error loading profile from localStorage:', error)
          // If parsing fails, show wizard
          setShowProfileWizard(true)
        }
      } else {
        // No profile found, show wizard
        setShowProfileWizard(true)
      }
    } else {
      // Server-side, show wizard
      setShowProfileWizard(true)
    }
    
    setLoading(false)
  }

  const loadMatches = async (profileToUse?: ScholarshipProfile) => {
    const profileToMatch = profileToUse || profile
    if (!profileToMatch) return
    try {
      const results = await ScholarshipAPIService.matchScholarships(profileToMatch)
      setMatches(results.slice(0, 3)) // Top 3
    } catch (error) {
      console.error('Error loading matches:', error)
      // Fallback to empty array on error
      setMatches([])
    }
  }

  const fetchScholarships = async () => {
    try {
      setSearchLoading(true)
      setSearchError(null)
      
      // Force live scraping by adding live=true
      const params = new URLSearchParams({
        limit: '50',
        live: 'true', // Force live scraping
      })
      
      if (selectedType !== 'all') {
        params.append('type', selectedType)
      }
      
      if (selectedCounty !== 'all') {
        params.append('county', selectedCounty)
      }
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/scholarships?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch scholarships')
      }

      const data = await response.json()
      setScholarships(data.scholarships || [])
    } catch (err: any) {
      console.error('Error fetching scholarships:', err)
      setSearchError(err.message || 'Failed to load scholarships. Please try again.')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchScholarships()
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

  const filteredScholarships = scholarships.filter(scholarship => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        scholarship.name?.toLowerCase().includes(query) ||
        scholarship.provider?.toLowerCase().includes(query) ||
        scholarship.description?.toLowerCase().includes(query)
      )
    }
    return true
  })

  const handleProfileComplete = async (completedProfile: any) => {
    // Map to legacy format for compatibility
    const legacyProfile: ScholarshipProfile = {
      county: completedProfile.personal?.county,
      constituency: completedProfile.personal?.constituency,
      currentSchool: completedProfile.personal?.schoolName,
      grade: parseInt(completedProfile.academicStage?.currentClassOrLevel?.match(/\d+/)?.[0] || '0'),
      curriculum: completedProfile.academicStage?.stage === 'JuniorSecondary' || completedProfile.academicStage?.stage === 'Primary' ? 'CBC' : '8-4-4',
      subjects: completedProfile.subjectsCompetencies?.subjectsTaken || [],
      careerInterest: completedProfile.careerGoals?.longTerm,
      careerGoals: completedProfile.careerGoals?.longTerm ? [completedProfile.careerGoals.longTerm] : [],
      currentSkills: completedProfile.skillsAndCertifications?.map((s: any) => s.skill) || [],
      skillsWanted: completedProfile.skillsAndCertifications?.filter((s: any) => s.proficiency === 'Beginner').map((s: any) => s.skill) || [],
      learningGoals: completedProfile.careerGoals?.shortTerm ? [completedProfile.careerGoals.shortTerm] : [],
      preferredField: completedProfile.subjectsCompetencies?.preferredStream,
      projects: completedProfile.projectsPortfolio || [],
      extracurriculars: completedProfile.extracurricularsAndAwards?.map((a: any) => a.type) || [],
      achievements: completedProfile.extracurricularsAndAwards?.map((a: any) => a.type) || [],
      languages: completedProfile.accessAndReadiness?.preferredLanguage ? [completedProfile.accessAndReadiness.preferredLanguage] : [],
    }
    
    // Save to localStorage FIRST (before state updates)
    if (typeof window !== 'undefined') {
      localStorage.setItem('student_profile', JSON.stringify(completedProfile))
    }
    
    // Update state
    setProfile(legacyProfile)
    setShowProfileWizard(false)
    setProfileComplete(true)
    
    // Load matches (use the profile we just set)
    try {
      const results = await ScholarshipAPIService.matchScholarships(legacyProfile)
      setMatches(results.slice(0, 3))
    } catch (error) {
      console.error('Error loading matches:', error)
      setMatches([])
      // Show user-friendly message if database not set up
      if (error instanceof Error && error.message.includes('table')) {
        console.warn('Database table not found. Please run the migration. See QUICK_DATABASE_FIX.md')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show profile wizard if profile incomplete
  if (showProfileWizard) {
    // Try to load existing profile data if available
    const savedProfile = typeof window !== 'undefined' 
      ? localStorage.getItem('student_profile')
      : null
    const initialData = savedProfile ? JSON.parse(savedProfile) : undefined
    
    return <MinimalProfileWizard onComplete={handleProfileComplete} initialData={initialData} />
  }

  const userName = user?.email?.split('@')[0] || 'Student'
  const online = isOnline()
  
  // Calculate deadlines (mock for now)
  const upcomingDeadlines = matches
    .filter(m => m.scholarship.applicationDeadline)
    .slice(0, 2)
    .map(m => ({
      name: m.scholarship.name,
      date: m.scholarship.applicationDeadline!,
      daysLeft: Math.ceil((new Date(m.scholarship.applicationDeadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    }))

  return (
    <DashboardLayout user={user}>
      <div className="space-y-3 sm:space-y-4">
        {/* Start a Post Section - LinkedIn Style - Fully Responsive */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Start a post..."
              className="flex-1 bg-gray-50 dark:bg-gray-700 border-0 h-9 sm:h-10 text-sm sm:text-base"
              onClick={() => router.push(ROUTES.SCHOLARSHIPS || '/scholarships')}
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-muted-foreground overflow-x-auto scrollbar-hide pb-1">
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Find Scholarships</span>
              <span className="xs:hidden">Find</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Search</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              onClick={() => router.push('/profile')}
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Profile</span>
              <span className="xs:hidden">Me</span>
            </Button>
          </div>
        </section>

        {/* Scholarship Search Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">Browse All Opportunities</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Search live scholarships from Kenya government portals
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Search scholarships, providers, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="default" disabled={searchLoading}>
                {searchLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value)
                      fetchScholarships()
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="scholarship">Scholarships</option>
                    <option value="bursary">Bursaries</option>
                    <option value="grant">Grants</option>
                    <option value="bootcamp">Bootcamps</option>
                    <option value="learning">Learning Opportunities</option>
                    <option value="mentorship">Mentorships</option>
                    <option value="internship">Internships</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">County</label>
                  <select
                    value={selectedCounty}
                    onChange={(e) => {
                      setSelectedCounty(e.target.value)
                      fetchScholarships()
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="all">All Counties</option>
                    {getCountyNames().map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </form>

          {/* Search Results */}
          {searchLoading ? (
            <div className="flex items-center justify-center py-8 mt-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                Loading opportunities from Kenya government portals...
              </span>
            </div>
          ) : searchError ? (
            <Card className="border-red-200 dark:border-red-800 mt-4">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-sm">Error loading opportunities</p>
                    <p className="text-xs text-red-500 dark:text-red-400">{searchError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchScholarships}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : filteredScholarships.length > 0 ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {filteredScholarships.length} {filteredScholarships.length === 1 ? 'opportunity' : 'opportunities'} found
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchScholarships}
                  className="text-xs"
                >
                  Refresh
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredScholarships.slice(0, 10).map((scholarship) => (
                  <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {OPPORTUNITY_TYPE_LABELS[scholarship.type] || scholarship.type}
                        </Badge>
                        {isUpcoming(scholarship.applicationDeadline) && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            Open
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm leading-tight">{scholarship.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs mt-1">
                        <GraduationCap className="h-3 w-3" />
                        {scholarship.provider}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {scholarship.description}
                      </p>
                      <div className="space-y-1 mb-3">
                        {scholarship.eligibility?.counties && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {scholarship.eligibility.counties.length === 1 
                              ? scholarship.eligibility.counties[0]
                              : `${scholarship.eligibility.counties.length} counties`
                            }
                          </div>
                        )}
                        {scholarship.applicationDeadline && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDeadline(scholarship.applicationDeadline)}
                          </div>
                        )}
                        {scholarship.amount && (
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {scholarship.amount}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        asChild
                      >
                        <Link href={`/scholarships/${scholarship.id}`}>
                          View Details
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* Quick Stats - LinkedIn Style - Fully Responsive */}
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#e5989b]" />
              <Badge variant="secondary" className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5 sm:px-2">{matches.length}</Badge>
            </div>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-0.5 sm:mb-1">Matches</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">{matches.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#b5838d]" />
              <Badge variant="secondary" className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5 sm:px-2">0</Badge>
            </div>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-0.5 sm:mb-1">Applications</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">0</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#e5989b]" />
              <Badge variant="secondary" className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5 sm:px-2">{upcomingDeadlines.length}</Badge>
            </div>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-0.5 sm:mb-1">Deadlines</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">{upcomingDeadlines.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#b5838d]" />
              <Badge variant="secondary" className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5 sm:px-2">100%</Badge>
            </div>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-0.5 sm:mb-1">Profile</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">Complete</p>
          </div>
        </section>

        {/* Main Feed Content - Fully Responsive */}
            {/* Top Matches - LinkedIn Post Style */}
            <section>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">Your Top Matches</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      Scholarships ranked by match score
                    </p>
                  </div>
                  <Link href={ROUTES.SCHOLARSHIPS || '/scholarships'} className="flex-shrink-0">
                    <Button variant="ghost" size="sm" className="hidden md:flex h-8 sm:h-9 text-xs sm:text-sm">
                      View All <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </div>

              {matches.length === 0 ? (
                <div className="text-center py-6 sm:py-8 px-2">
                  <Award className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">No matches yet</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 px-2">
                    Complete your profile to find scholarships that match you
                  </p>
                  <Button 
                    onClick={() => setShowProfileWizard(true)}
                    className="bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d] h-9 sm:h-10 text-xs sm:text-sm px-4 sm:px-6"
                  >
                    Complete Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {matches.map((match, index) => (
                    <div
                      key={match.scholarship.id}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Post Header - Responsive */}
                      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#e5989b] to-[#b5838d] flex items-center justify-center flex-shrink-0">
                            {getOpportunityIcon(match.scholarship.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                              <h3 className="font-semibold text-sm sm:text-base truncate flex-1 min-w-0">{match.scholarship.name}</h3>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <Badge 
                                  variant={getTypeVariant(match.scholarship.type)} 
                                  className="text-[10px] sm:text-xs h-5 sm:h-6 px-1.5 sm:px-2"
                                >
                                  {OPPORTUNITY_TYPE_LABELS[match.scholarship.type as keyof typeof OPPORTUNITY_TYPE_LABELS] || match.scholarship.type}
                                </Badge>
                                {match.scholarship.category && (
                                  <Badge variant="secondary" className="text-[10px] sm:text-xs h-5 sm:h-6 px-1.5 sm:px-2 hidden sm:inline-flex">
                                    {match.scholarship.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                              {match.scholarship.provider} • Match: {match.matchScore}%
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0">
                          <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      {/* Post Content - Responsive */}
                      <p className="text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                        {match.scholarship.description}
                      </p>

                      {/* Post Details - Responsive */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700">
                        {/* Scholarship-specific */}
                        {match.scholarship.amount && (
                          <div className="flex items-center gap-1.5">
                            <Zap className="h-3 w-3" />
                            <span>{match.scholarship.amount}</span>
                          </div>
                        )}
                        {/* Bootcamp-specific */}
                        {match.scholarship.bootcampDetails?.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            <span>{match.scholarship.bootcampDetails.duration}</span>
                          </div>
                        )}
                        {match.scholarship.bootcampDetails?.format && (
                          <div className="flex items-center gap-1.5">
                            <Laptop className="h-3 w-3" />
                            <span className="capitalize">{match.scholarship.bootcampDetails.format}</span>
                          </div>
                        )}
                        {match.scholarship.bootcampDetails?.cost === 'free' && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Free
                          </Badge>
                        )}
                        {/* Learning-specific */}
                        {match.scholarship.learningDetails?.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            <span>{match.scholarship.learningDetails.duration}</span>
                          </div>
                        )}
                        {match.scholarship.learningDetails?.cost === 'free' && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Free
                          </Badge>
                        )}
                        {match.scholarship.learningDetails?.certification && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Certificate
                          </Badge>
                        )}
                        {/* Common */}
                        {match.scholarship.applicationDeadline && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>Due {new Date(match.scholarship.applicationDeadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Post Actions - Responsive */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground h-7 sm:h-8 text-xs sm:text-sm">
                            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                            {match.matchScore}% Match
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/scholarships/${match.scholarship.id}`} className="flex-1 sm:flex-none">
                            <Button size="sm" variant="outline" className="w-full sm:w-auto h-8 sm:h-9 text-xs sm:text-sm">
                              View
                            </Button>
                          </Link>
                          {match.scholarship.applicationLink ? (
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d] flex-1 sm:flex-none w-full sm:w-auto h-8 sm:h-9 text-xs sm:text-sm"
                              asChild
                            >
                              <a
                                href={match.scholarship.applicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Apply
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d] flex-1 sm:flex-none w-full sm:w-auto h-8 sm:h-9 text-xs sm:text-sm"
                              asChild
                            >
                              <Link href={`/scholarships/${match.scholarship.id}`}>
                                Apply
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </section>

            {/* Applications Status - LinkedIn Post Style - Fully Responsive */}
            <section id="applications" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">My Applications</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Track your scholarship applications
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="text-center p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mx-auto mb-1.5 sm:mb-2" />
                  <p className="text-lg sm:text-xl font-bold">0</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Submitted</p>
                </div>
                <div className="text-center p-2.5 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mx-auto mb-1.5 sm:mb-2" />
                  <p className="text-lg sm:text-xl font-bold">0</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">In Progress</p>
                </div>
                <div className="text-center p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 mx-auto mb-1.5 sm:mb-2" />
                  <p className="text-lg sm:text-xl font-bold">0</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Draft</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full h-8 sm:h-9 text-xs sm:text-sm">
                View All Applications <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </section>
      </div>
    </DashboardLayout>
  )
}
