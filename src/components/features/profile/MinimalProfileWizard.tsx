/**
 * Minimal Profile Wizard - For Prototyping
 * Collects only essential information needed for matching
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, GraduationCap, Target, ArrowRight } from 'lucide-react'
import { 
  PROTOTYPE_COUNTIES, 
  getConstituenciesForCounty, 
  getSubcountiesForConstituency,
  getCountyNames 
} from '@/constants/locations'
import type { StudentProfile } from '@/types/student-profile'

interface MinimalProfileWizardProps {
  onComplete: (profile: Partial<StudentProfile>) => void
  initialData?: Partial<StudentProfile>
}

const ACADEMIC_STAGES = [
  { value: 'Primary', label: 'Primary (Grades 1-6)' },
  { value: 'JuniorSecondary', label: 'Junior Secondary (Grades 7-9)' },
  { value: 'SeniorSecondary', label: 'Senior Secondary (Forms 1-4)' },
  { value: 'TVET', label: 'TVET' },
  { value: 'University', label: 'University' },
]

const COMMON_SUBJECTS = [
  'Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology',
  'Geography', 'History', 'Business Studies', 'Computer Studies', 'Agriculture'
]

const CAREER_GOALS = [
  'Software Engineering', 'Medicine', 'Engineering', 'Business', 'Education',
  'Law', 'Agriculture', 'Healthcare', 'Finance', 'Design', 'Other'
]

export function MinimalProfileWizard({ onComplete, initialData }: MinimalProfileWizardProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<StudentProfile>>(initialData || {
    personal: {
      firstName: '',
      lastName: '',
      county: '',
    },
    academicStage: {
      stage: 'SeniorSecondary',
      currentClassOrLevel: '',
    },
    subjectsCompetencies: {
      subjectsTaken: [],
    },
    careerGoals: {
      longTerm: '',
    },
  })

  // Get constituencies and subcounties based on selected county
  const selectedCounty = profile.personal?.county || ''
  const constituencies = selectedCounty ? getConstituenciesForCounty(selectedCounty) : []
  const selectedConstituency = (profile.personal as any)?.constituency || ''
  const subcounties = selectedCounty && selectedConstituency 
    ? getSubcountiesForConstituency(selectedCounty, selectedConstituency) 
    : []

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1)
    } else {
      onComplete(profile)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        // Location step: county is required, constituency and subcounty are optional
        return !!(profile.personal?.county)
      case 2:
        return !!(profile.personal?.firstName && profile.personal?.lastName)
      case 3:
        // Only stage is required, class/level can be auto-filled
        return !!(profile.academicStage?.stage)
      case 4:
        return !!(profile.careerGoals?.longTerm && (profile.subjectsCompetencies?.subjectsTaken?.length || 0) > 0)
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg border p-6 sm:p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Complete Your Profile</h2>
            <span className="text-sm text-muted-foreground">Step {step} of 4</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Where are you located?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This helps us find location-specific opportunities for you
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="county">County *</Label>
                <Select
                  value={profile.personal?.county || ''}
                  onValueChange={(value) => {
                    // Reset constituency and subcounty when county changes
                    updateProfile({
                      personal: { 
                        ...profile.personal, 
                        county: value,
                        constituency: undefined,
                        subcounty: undefined,
                      } as any
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your county" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCountyNames().map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCounty && constituencies.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="constituency">Constituency (Optional)</Label>
                  <Select
                    value={selectedConstituency}
                    onValueChange={(value) => {
                      updateProfile({
                        personal: { 
                          ...profile.personal, 
                          constituency: value,
                          subcounty: undefined, // Reset subcounty when constituency changes
                        } as any
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your constituency" />
                    </SelectTrigger>
                    <SelectContent>
                      {constituencies.map((constituency) => (
                        <SelectItem key={constituency.name} value={constituency.name}>
                          {constituency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedCounty && selectedConstituency && subcounties.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="subcounty">Subcounty (Optional)</Label>
                  <Select
                    value={(profile.personal as any)?.subcounty || ''}
                    onValueChange={(value) => {
                      updateProfile({
                        personal: { 
                          ...profile.personal, 
                          subcounty: value,
                        } as any
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your subcounty" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcounties.map((subcounty) => (
                        <SelectItem key={subcounty.name} value={subcounty.name}>
                          {subcounty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={profile.personal?.firstName || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setProfile(prev => ({
                      ...prev,
                      personal: {
                        firstName: value,
                        lastName: prev.personal?.lastName || '',
                        county: prev.personal?.county || '',
                        ...prev.personal,
                      }
                    }))
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={profile.personal?.lastName || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setProfile(prev => ({
                      ...prev,
                      personal: {
                        firstName: prev.personal?.firstName || '',
                        lastName: value,
                        county: prev.personal?.county || '',
                        ...prev.personal,
                      }
                    }))
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Education Level */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">What's your education level?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We believe education should be accessible to everyone. Your current level helps us find the right opportunities for you.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stage">I'm currently in *</Label>
                <Select
                  value={profile.academicStage?.stage || ''}
                  onValueChange={(value) => {
                    // Auto-set class/level based on stage
                    let defaultClass = ''
                    if (value === 'Primary') defaultClass = 'Grade 6'
                    else if (value === 'JuniorSecondary') defaultClass = 'Grade 8'
                    else if (value === 'SeniorSecondary') defaultClass = 'Form 2'
                    else if (value === 'TVET') defaultClass = 'TVET Level 2'
                    else if (value === 'University') defaultClass = 'Year 1'
                    
                    updateProfile({
                      academicStage: { 
                        ...profile.academicStage, 
                        stage: value as any,
                        currentClassOrLevel: defaultClass
                      }
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_STAGES.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classLevel">Current Class/Level *</Label>
                <Input
                  id="classLevel"
                  placeholder="e.g., Form 2, Grade 8, TVET Level 3, Year 1"
                  value={profile.academicStage?.currentClassOrLevel || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setProfile(prev => ({
                      ...prev,
                      academicStage: {
                        stage: prev.academicStage?.stage || 'SeniorSecondary',
                        currentClassOrLevel: value,
                        ...prev.academicStage,
                      }
                    }))
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  You can edit this if the default doesn't match your exact level
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> We don't require exam scores or grades. 
                Our system focuses on finding opportunities that match your interests and goals, 
                making education accessible to everyone regardless of past performance.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Interests & Goals */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Career & Interests</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="careerGoal">Career Goal *</Label>
              <Select
                value={profile.careerGoals?.longTerm || ''}
                onValueChange={(value) => updateProfile({
                  careerGoals: { ...profile.careerGoals, longTerm: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="What do you want to become?" />
                </SelectTrigger>
                <SelectContent>
                  {CAREER_GOALS.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subjects You're Taking * (Select at least one)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {COMMON_SUBJECTS.map((subject) => {
                  const isSelected = profile.subjectsCompetencies?.subjectsTaken?.includes(subject)
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => {
                        const current = profile.subjectsCompetencies?.subjectsTaken || []
                        const updated = isSelected
                          ? current.filter(s => s !== subject)
                          : [...current, subject]
                        updateProfile({
                          subjectsCompetencies: { ...profile.subjectsCompetencies, subjectsTaken: updated }
                        })
                      }}
                      className={`text-sm px-3 py-2 rounded-md border transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      {subject}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {profile.subjectsCompetencies?.subjectsTaken?.length || 0}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            {step === 4 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

