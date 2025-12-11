/**
 * Comprehensive Profile Completion Wizard
 * Collects all data for the AI Student Pathfinder platform
 * Maps to StudentProfile schema with Kenyan education context
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Target,
  Code,
  X,
  User,
  Award,
  Globe,
  Link as LinkIcon,
  Plus,
  FileText,
  Languages
} from 'lucide-react'
import { KENYAN_COUNTIES, FIELDS_OF_STUDY } from '@/constants/scholarships'
import type { StudentProfile, ProjectPortfolio, SkillCertification, ExtracurricularAward } from '@/types/student-profile'

interface ComprehensiveProfileWizardProps {
  onComplete: (profile: Partial<StudentProfile>) => void
  initialData?: Partial<StudentProfile>
}

const TOTAL_STEPS = 8

// Common skills
const COMMON_SKILLS = [
  'Mathematics', 'English', 'Kiswahili', 'Science', 'Computer Skills',
  'JavaScript', 'Python', 'Web Development', 'Data Analysis', 'Design',
  'Communication', 'Leadership', 'Problem Solving', 'Critical Thinking',
  'Public Speaking', 'Writing', 'Research'
]

// Career interests
const CAREER_INTERESTS = [
  'Software Engineering', 'Data Science', 'Medicine', 'Engineering',
  'Business', 'Education', 'Law', 'Architecture', 'Design',
  'Agriculture', 'Healthcare', 'Finance', 'Marketing', 'Journalism'
]

// Languages
const LANGUAGE_OPTIONS = [
  'English', 'Kiswahili', 'French', 'German', 'Spanish', 'Chinese', 'Arabic', 'Kikuyu', 'Luo', 'Kalenjin', 'Other'
]

// Project types
const PROJECT_TYPES = ['Project', 'Competition', 'Research', 'Other'] as const

// Proficiency levels
const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

export function ComprehensiveProfileWizard({ onComplete, initialData }: ComprehensiveProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<Partial<StudentProfile>>(initialData || {
    personal: { firstName: '', lastName: '', county: '' },
    academicStage: { stage: 'Primary', currentClassOrLevel: '' },
    subjectsCompetencies: { subjectsTaken: [] },
    careerGoals: {},
  })

  // Input states
  const [subjectInput, setSubjectInput] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [projectType, setProjectType] = useState<'Project' | 'Competition' | 'Research' | 'Other'>('Project')
  const [extracurricularType, setExtracurricularType] = useState('')
  const [extracurricularYears, setExtracurricularYears] = useState('')
  const [extracurricularDetails, setExtracurricularDetails] = useState('')

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete(profile)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!(profile.personal?.firstName && profile.personal?.lastName && profile.personal?.county)
      case 2: return !!(profile.academicStage?.stage && profile.academicStage?.currentClassOrLevel)
      case 3: return !!(profile.subjectsCompetencies?.subjectsTaken && profile.subjectsCompetencies.subjectsTaken.length > 0)
      case 4: return true // Academic performance is optional
      case 5: return !!(profile.careerGoals?.longTerm || profile.careerGoals?.shortTerm)
      case 6: return true // Skills are optional
      case 7: return true // Projects/extracurriculars are optional
      case 8: return true // Languages are optional
      default: return false
    }
  }

  const addSubject = () => {
    if (subjectInput && !profile.subjectsCompetencies?.subjectsTaken?.includes(subjectInput)) {
      updateProfile({
        subjectsCompetencies: {
          ...profile.subjectsCompetencies,
          subjectsTaken: [...(profile.subjectsCompetencies?.subjectsTaken || []), subjectInput]
        }
      })
      setSubjectInput('')
    }
  }

  const removeSubject = (subject: string) => {
    updateProfile({
      subjectsCompetencies: {
        ...profile.subjectsCompetencies,
        subjectsTaken: profile.subjectsCompetencies?.subjectsTaken?.filter(s => s !== subject) || []
      }
    })
  }

  const addSkill = () => {
    if (skillInput && !profile.skillsAndCertifications?.some(s => s.skill === skillInput)) {
      updateProfile({
        skillsAndCertifications: [
          ...(profile.skillsAndCertifications || []),
          { skill: skillInput, proficiency: 'Intermediate' }
        ]
      })
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    updateProfile({
      skillsAndCertifications: profile.skillsAndCertifications?.filter(s => s.skill !== skill) || []
    })
  }

  const addProject = () => {
    if (projectTitle && projectUrl) {
      updateProfile({
        projectsPortfolio: [
          ...(profile.projectsPortfolio || []),
          {
            title: projectTitle,
            type: projectType,
            link: projectUrl,
            description: ''
          }
        ]
      })
      setProjectTitle('')
      setProjectUrl('')
      setProjectType('Project')
    }
  }

  const removeProject = (index: number) => {
    updateProfile({
      projectsPortfolio: profile.projectsPortfolio?.filter((_, i) => i !== index) || []
    })
  }

  const addExtracurricular = () => {
    if (extracurricularType) {
      updateProfile({
        extracurricularsAndAwards: [
          ...(profile.extracurricularsAndAwards || []),
          {
            type: extracurricularType,
            years: extracurricularYears || undefined,
            details: extracurricularDetails || undefined
          }
        ]
      })
      setExtracurricularType('')
      setExtracurricularYears('')
      setExtracurricularDetails('')
    }
  }

  const removeExtracurricular = (index: number) => {
    updateProfile({
      extracurricularsAndAwards: profile.extracurricularsAndAwards?.filter((_, i) => i !== index) || []
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Complete Your Academic Profile</h2>
            <span className="text-xs sm:text-sm text-muted-foreground">Step {currentStep} of {TOTAL_STEPS}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-4 sm:p-6 md:p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Personal Information</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Tell us about yourself</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={profile.personal?.firstName || ''}
                      onChange={(e) => updateProfile({
                        personal: { ...profile.personal, firstName: e.target.value }
                      })}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={profile.personal?.lastName || ''}
                      onChange={(e) => updateProfile({
                        personal: { ...profile.personal, lastName: e.target.value }
                      })}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={profile.personal?.schoolName || ''}
                    onChange={(e) => updateProfile({
                      personal: { ...profile.personal, schoolName: e.target.value }
                    })}
                    placeholder="Nairobi High School"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="county">County *</Label>
                  <Select
                    value={profile.personal?.county || ''}
                    onValueChange={(value) => updateProfile({
                      personal: { ...profile.personal, county: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your county" />
                    </SelectTrigger>
                    <SelectContent>
                      {KENYAN_COUNTIES.map((county) => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Stage */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Academic Level</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Your current education stage</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stage">Education Stage *</Label>
                  <Select
                    value={profile.academicStage?.stage || ''}
                    onValueChange={(value) => updateProfile({
                      academicStage: {
                        ...profile.academicStage,
                        stage: value as any
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="JuniorSecondary">Junior Secondary (CBC)</SelectItem>
                      <SelectItem value="SeniorSecondary">Senior Secondary (Form 1-4)</SelectItem>
                      <SelectItem value="TVET">TVET</SelectItem>
                      <SelectItem value="University">University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classLevel">Current Class/Level *</Label>
                  <Input
                    id="classLevel"
                    value={profile.academicStage?.currentClassOrLevel || ''}
                    onChange={(e) => updateProfile({
                      academicStage: {
                        ...profile.academicStage,
                        currentClassOrLevel: e.target.value
                      }
                    })}
                    placeholder="e.g., Grade 6, Form 3, TVET Level 4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Subjects */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Subjects & Stream</h3>
                <p className="text-sm sm:text-base text-muted-foreground">What subjects are you taking?</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                    placeholder="Add subject (e.g., Mathematics)"
                  />
                  <Button type="button" onClick={addSubject} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.subjectsCompetencies?.subjectsTaken?.map((subject) => (
                    <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                      {subject}
                      <button onClick={() => removeSubject(subject)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stream">Preferred Stream</Label>
                  <Select
                    value={profile.subjectsCompetencies?.preferredStream || ''}
                    onValueChange={(value) => updateProfile({
                      subjectsCompetencies: {
                        ...profile.subjectsCompetencies,
                        preferredStream: value as any
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stream (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STEM">STEM</SelectItem>
                      <SelectItem value="Humanities">Humanities</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Commerce">Commerce</SelectItem>
                      <SelectItem value="Vocational">Vocational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Academic Performance (Optional) */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Academic Performance</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Optional: Your exam results</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kcpeScore">KCPE Score</Label>
                    <Input
                      id="kcpeScore"
                      type="number"
                      value={profile.assessmentsAndGrades?.kcpe?.score?.toString() || ''}
                      onChange={(e) => updateProfile({
                        assessmentsAndGrades: {
                          ...profile.assessmentsAndGrades,
                          kcpe: {
                            score: e.target.value ? parseInt(e.target.value) : undefined
                          }
                        }
                      })}
                      placeholder="e.g., 380"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kcseGrade">KCSE Mean Grade</Label>
                    <Input
                      id="kcseGrade"
                      value={profile.assessmentsAndGrades?.kcse?.meanGrade || ''}
                      onChange={(e) => updateProfile({
                        assessmentsAndGrades: {
                          ...profile.assessmentsAndGrades,
                          kcse: {
                            meanGrade: e.target.value || undefined
                          }
                        }
                      })}
                      placeholder="e.g., A, B+"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Career Goals */}
          {currentStep === 5 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Career Goals</h3>
                <p className="text-sm sm:text-base text-muted-foreground">What do you want to become?</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="longTerm">Long-term Career Goal *</Label>
                  <Input
                    id="longTerm"
                    value={profile.careerGoals?.longTerm || ''}
                    onChange={(e) => updateProfile({
                      careerGoals: {
                        ...profile.careerGoals,
                        longTerm: e.target.value
                      }
                    })}
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortTerm">Short-term Goal</Label>
                  <Input
                    id="shortTerm"
                    value={profile.careerGoals?.shortTerm || ''}
                    onChange={(e) => updateProfile({
                      careerGoals: {
                        ...profile.careerGoals,
                        shortTerm: e.target.value
                      }
                    })}
                    placeholder="e.g., Get a diploma in IT"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Skills */}
          {currentStep === 6 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <Code className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Skills & Certifications</h3>
                <p className="text-sm sm:text-base text-muted-foreground">What skills do you have?</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add skill (e.g., Python, JavaScript)"
                  />
                  <Button type="button" onClick={addSkill} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {profile.skillsAndCertifications?.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant="outline">{skill.proficiency}</Badge>
                      </div>
                      <button onClick={() => removeSkill(skill.skill)}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Projects & Extracurriculars */}
          {currentStep === 7 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <LinkIcon className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Projects & Activities</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Showcase your work and activities</p>
              </div>

              <div className="space-y-6">
                {/* Projects */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Projects (GitHub, Behance, Videos)</h4>
                  <div className="space-y-2">
                    <Input
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Project title"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={projectUrl}
                        onChange={(e) => setProjectUrl(e.target.value)}
                        placeholder="URL (GitHub, Behance, YouTube, etc.)"
                      />
                      <Select value={projectType} onValueChange={(value: any) => setProjectType(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={addProject} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {profile.projectsPortfolio?.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{project.title}</span>
                          <Badge variant="outline" className="ml-2">{project.type}</Badge>
                        </div>
                        <button onClick={() => removeProject(index)}>
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extracurriculars */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Extracurricular Activities & Awards</h4>
                  <div className="space-y-2">
                    <Input
                      value={extracurricularType}
                      onChange={(e) => setExtracurricularType(e.target.value)}
                      placeholder="Activity type (e.g., Debate Team, Science Club)"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={extracurricularYears}
                        onChange={(e) => setExtracurricularYears(e.target.value)}
                        placeholder="Years (e.g., 2022-2024)"
                      />
                      <Input
                        value={extracurricularDetails}
                        onChange={(e) => setExtracurricularDetails(e.target.value)}
                        placeholder="Details (e.g., Regional runner-up)"
                      />
                      <Button type="button" onClick={addExtracurricular} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {profile.extracurricularsAndAwards?.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{activity.type}</span>
                          {activity.years && <span className="text-sm text-muted-foreground ml-2">({activity.years})</span>}
                        </div>
                        <button onClick={() => removeExtracurricular(index)}>
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Languages & Preferences */}
          {currentStep === 8 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <Languages className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Languages & Preferences</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Final touches</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Languages Spoken</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map(lang => {
                      const isSelected = profile.accessAndReadiness?.preferredLanguage === lang
                      return (
                        <Badge
                          key={lang}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => updateProfile({
                            accessAndReadiness: {
                              ...profile.accessAndReadiness,
                              preferredLanguage: isSelected ? undefined : lang
                            }
                          })}
                        >
                          {lang}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="device">Device Available</Label>
                  <Select
                    value={profile.accessAndReadiness?.device || ''}
                    onValueChange={(value) => updateProfile({
                      accessAndReadiness: {
                        ...profile.accessAndReadiness,
                        device: value as any
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internet">Internet Access</Label>
                  <Select
                    value={profile.accessAndReadiness?.internetAccess || ''}
                    onValueChange={(value) => updateProfile({
                      accessAndReadiness: {
                        ...profile.accessAndReadiness,
                        internetAccess: value as any
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Intermittent">Intermittent</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === TOTAL_STEPS ? 'Complete' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


