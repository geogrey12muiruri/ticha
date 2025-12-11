/**
 * Student Profile View Page
 * LinkedIn-style profile display
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserWithOfflineFallback } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Code, 
  Target,
  Link as LinkIcon,
  Languages,
  Edit,
  ExternalLink,
  Briefcase,
  Calendar
} from 'lucide-react'
import type { StudentProfile } from '@/types/student-profile'
import { DashboardLayout } from '@/components/shared/DashboardLayout'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Partial<StudentProfile> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = await getUserWithOfflineFallback()
        if (!currentUser) {
          router.push('/login')
          return
        }

        setUser(currentUser)

        // Load profile from localStorage or API
        const savedProfile = localStorage.getItem('student_profile')
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile))
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading profile:', error)
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e5989b] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
            <p className="text-muted-foreground mb-6">Complete your profile to get personalized recommendations</p>
            <Button onClick={() => router.push('/dashboard')}>
              Complete Profile
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Cover Image Placeholder */}
          <div className="h-32 sm:h-48 bg-gradient-to-br from-[#e5989b] to-[#b5838d]"></div>
          
          {/* Profile Header */}
          <div className="px-4 sm:px-6 pb-6 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#e5989b] to-[#b5838d] border-4 border-white dark:border-gray-800 flex items-center justify-center">
                  <User className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                </div>
                <div className="pb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {profile.personal?.firstName} {profile.personal?.lastName}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {profile.academicStage?.currentClassOrLevel} • {profile.academicStage?.stage}
                  </p>
                  {profile.personal?.schoolName && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile.personal.schoolName}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* About Section */}
        {profile.careerGoals?.longTerm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Career Goal</p>
                <p className="text-base">{profile.careerGoals.longTerm}</p>
              </div>
              {profile.careerGoals.shortTerm && (
                <div>
                  <p className="font-semibold text-sm text-muted-foreground mb-1">Short-term Goal</p>
                  <p className="text-base">{profile.careerGoals.shortTerm}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Academic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-[#e5989b]" />
            <h2 className="text-xl font-bold">Academic Information</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Education Stage</p>
                <p className="text-base">{profile.academicStage?.stage}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Current Level</p>
                <p className="text-base">{profile.academicStage?.currentClassOrLevel}</p>
              </div>
              {profile.personal?.county && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Location</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{profile.personal.county}</p>
                  </div>
                </div>
              )}
              {profile.subjectsCompetencies?.preferredStream && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Preferred Stream</p>
                  <Badge variant="secondary">{profile.subjectsCompetencies.preferredStream}</Badge>
                </div>
              )}
            </div>

            {profile.assessmentsAndGrades?.kcpe?.score && (
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Exam Results</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">KCPE Score</p>
                    <p className="text-lg font-semibold">{profile.assessmentsAndGrades.kcpe.score}</p>
                  </div>
                  {profile.assessmentsAndGrades.kcse?.meanGrade && (
                    <div>
                      <p className="text-xs text-muted-foreground">KCSE Grade</p>
                      <p className="text-lg font-semibold">{profile.assessmentsAndGrades.kcse.meanGrade}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subjects */}
        {profile.subjectsCompetencies?.subjectsTaken && profile.subjectsCompetencies.subjectsTaken.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-[#e5989b]" />
              <h2 className="text-xl font-bold">Subjects</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.subjectsCompetencies.subjectsTaken.map((subject) => (
                <Badge key={subject} variant="secondary">{subject}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {profile.skillsAndCertifications && profile.skillsAndCertifications.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-[#e5989b]" />
              <h2 className="text-xl font-bold">Skills & Certifications</h2>
            </div>
            <div className="space-y-2">
              {profile.skillsAndCertifications.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{skill.skill}</span>
                    <Badge variant="outline">{skill.proficiency}</Badge>
                  </div>
                  {skill.evidence?.link && (
                    <a href={skill.evidence.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {profile.projectsPortfolio && profile.projectsPortfolio.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="h-5 w-5 text-[#e5989b]" />
              <h2 className="text-xl font-bold">Projects & Portfolio</h2>
            </div>
            <div className="space-y-4">
              {profile.projectsPortfolio.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{project.title}</h3>
                        <Badge variant="outline">{project.type}</Badge>
                      </div>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-[#e5989b] hover:underline flex items-center gap-1"
                        >
                          View Project <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracurriculars & Awards */}
        {profile.extracurricularsAndAwards && profile.extracurricularsAndAwards.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-[#e5989b]" />
              <h2 className="text-xl font-bold">Extracurricular Activities & Awards</h2>
            </div>
            <div className="space-y-3">
              {profile.extracurricularsAndAwards.map((activity, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{activity.type}</p>
                      {activity.years && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {activity.years}
                        </p>
                      )}
                      {activity.details && (
                        <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages & Access */}
        {(profile.accessAndReadiness?.preferredLanguage || profile.accessAndReadiness?.device) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="h-5 w-5 text-[#e5989b]" />
              <h2 className="text-xl font-bold">Languages & Access</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.accessAndReadiness.preferredLanguage && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Preferred Language</p>
                  <p className="text-base">{profile.accessAndReadiness.preferredLanguage}</p>
                </div>
              )}
              {profile.accessAndReadiness.device && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Device</p>
                  <p className="text-base">{profile.accessAndReadiness.device}</p>
                </div>
              )}
              {profile.accessAndReadiness.internetAccess && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Internet Access</p>
                  <p className="text-base">{profile.accessAndReadiness.internetAccess}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}


