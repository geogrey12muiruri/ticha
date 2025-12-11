/**
 * Profile Completion Wizard
 * LinkedIn-style academic profile focusing on qualifications and career goals
 * No financial information - that's handled in actual scholarship applications
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
  X
} from 'lucide-react'
import { KENYAN_COUNTIES, FIELDS_OF_STUDY } from '@/constants/scholarships'
import type { ScholarshipProfile } from '@/types/scholarship'

interface ProfileCompletionWizardProps {
  onComplete: (profile: ScholarshipProfile) => void
  initialData?: Partial<ScholarshipProfile>
}

const TOTAL_STEPS = 5

// Common skills for students
const COMMON_SKILLS = [
  'Mathematics', 'English', 'Kiswahili', 'Science', 'Computer Skills',
  'JavaScript', 'Python', 'Web Development', 'Data Analysis',
  'Communication', 'Leadership', 'Problem Solving', 'Critical Thinking'
]

// Career interests
const CAREER_INTERESTS = [
  'Software Engineering', 'Data Science', 'Medicine', 'Engineering',
  'Business', 'Education', 'Law', 'Architecture', 'Design',
  'Agriculture', 'Healthcare', 'Finance', 'Marketing'
]

export function ProfileCompletionWizard({ onComplete, initialData }: ProfileCompletionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<ScholarshipProfile>(initialData || {})
  const [skillInput, setSkillInput] = useState('')
  const [goalInput, setGoalInput] = useState('')

  const updateProfile = (updates: Partial<ScholarshipProfile>) => {
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
      case 1: return !!profile.county
      case 2: return !!profile.curriculum && !!profile.grade
      case 3: return true // Academic performance is optional
      case 4: return !!profile.careerInterest || (profile.careerGoals && profile.careerGoals.length > 0)
      case 5: return true // Skills are optional but recommended
      default: return false
    }
  }

  const addSkill = (skill: string) => {
    if (skill && !profile.currentSkills?.includes(skill)) {
      updateProfile({
        currentSkills: [...(profile.currentSkills || []), skill]
      })
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    updateProfile({
      currentSkills: profile.currentSkills?.filter(s => s !== skill)
    })
  }

  const addGoal = (goal: string) => {
    if (goal && !profile.learningGoals?.includes(goal)) {
      updateProfile({
        learningGoals: [...(profile.learningGoals || []), goal]
      })
      setGoalInput('')
    }
  }

  const removeGoal = (goal: string) => {
    updateProfile({
      learningGoals: profile.learningGoals?.filter(g => g !== goal)
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
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Where are you located?</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Helps us find location-specific opportunities</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="county" className="text-sm sm:text-base font-medium">County *</Label>
                  <Select
                    value={profile.county || ''}
                    onValueChange={(value) => updateProfile({ county: value })}
                  >
                    <SelectTrigger id="county" className="h-11 sm:h-12">
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
                
                <div className="space-y-2">
                  <Label htmlFor="constituency" className="text-sm sm:text-base font-medium">Constituency (Optional)</Label>
                  <Input
                    id="constituency"
                    placeholder="Enter your constituency"
                    value={profile.constituency || ''}
                    onChange={(e) => updateProfile({ constituency: e.target.value })}
                    className="h-11 sm:h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Level */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#b5838d]/10 mb-3 sm:mb-4">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-[#b5838d]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Academic Information</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Tell us about your current academic level</p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base font-medium">Curriculum *</Label>
                  <RadioGroup
                    value={profile.curriculum || ''}
                    onValueChange={(value) => updateProfile({ curriculum: value as '8-4-4' | 'CBC' })}
                    className="grid grid-cols-2 gap-3 sm:gap-4"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border-2 rounded-lg hover:border-[#e5989b] transition-colors">
                      <RadioGroupItem value="CBC" id="cbc" />
                      <Label htmlFor="cbc" className="flex-1 cursor-pointer font-normal">
                        <div className="font-semibold text-sm sm:text-base">CBC</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Competency-Based</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border-2 rounded-lg hover:border-[#e5989b] transition-colors">
                      <RadioGroupItem value="8-4-4" id="844" />
                      <Label htmlFor="844" className="flex-1 cursor-pointer font-normal">
                        <div className="font-semibold text-sm sm:text-base">8-4-4</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Traditional System</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-sm sm:text-base font-medium">Current Grade/Form *</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="1"
                    max="12"
                    placeholder="e.g., 8"
                    value={profile.grade || ''}
                    onChange={(e) => updateProfile({ grade: parseInt(e.target.value) || undefined })}
                    className="h-11 sm:h-12"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">Enter your current grade level (1-12)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school" className="text-sm sm:text-base font-medium">Current School (Optional)</Label>
                  <Input
                    id="school"
                    placeholder="e.g., Nairobi High School"
                    value={profile.currentSchool || ''}
                    onChange={(e) => updateProfile({ currentSchool: e.target.value })}
                    className="h-11 sm:h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Academic Performance */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Academic Performance</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Optional: Helps us find better matches</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kcpe">KCPE Score</Label>
                    <Input
                      id="kcpe"
                      type="number"
                      min="0"
                      max="500"
                      placeholder="e.g., 380"
                      value={profile.kcpeScore || ''}
                      onChange={(e) => updateProfile({ kcpeScore: parseInt(e.target.value) || undefined })}
                      className="h-11 sm:h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="kcse">KCSE Grade</Label>
                    <Select
                      value={profile.kcseGrade || ''}
                      onValueChange={(value) => updateProfile({ kcseGrade: value })}
                    >
                      <SelectTrigger id="kcse" className="h-11 sm:h-12">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="C+">C+</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="C-">C-</SelectItem>
                        <SelectItem value="D+">D+</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="average">Current Average Grade</Label>
                  <Select
                    value={profile.averageGrade || ''}
                    onValueChange={(value) => updateProfile({ averageGrade: value as 'A' | 'B' | 'C' | 'D' | 'E' })}
                  >
                    <SelectTrigger id="average" className="h-11 sm:h-12">
                      <SelectValue placeholder="Select average grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Career Interests & Goals */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#b5838d]/10 mb-3 sm:mb-4">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-[#b5838d]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Career Interests</h3>
                <p className="text-sm sm:text-base text-muted-foreground">What career path interests you?</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="career" className="text-sm sm:text-base font-medium">Primary Career Interest *</Label>
                  <Select
                    value={profile.careerInterest || ''}
                    onValueChange={(value) => updateProfile({ careerInterest: value })}
                  >
                    <SelectTrigger id="career" className="h-11 sm:h-12">
                      <SelectValue placeholder="Select your career interest" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAREER_INTERESTS.map((career) => (
                        <SelectItem key={career} value={career}>
                          {career}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field" className="text-sm sm:text-base font-medium">Preferred Field of Study</Label>
                  <Select
                    value={profile.preferredField || ''}
                    onValueChange={(value) => updateProfile({ preferredField: value })}
                  >
                    <SelectTrigger id="field" className="h-11 sm:h-12">
                      <SelectValue placeholder="Select field of study" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELDS_OF_STUDY.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-medium">Additional Career Goals (Optional)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.careerGoals?.map((goal) => (
                      <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                        {goal}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateProfile({ careerGoals: profile.careerGoals?.filter(g => g !== goal) })}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Type and press Enter to add"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (goalInput.trim()) {
                          updateProfile({
                            careerGoals: [...(profile.careerGoals || []), goalInput.trim()]
                          })
                          setGoalInput('')
                        }
                      }
                    }}
                    className="h-11 sm:h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Skills & Learning Goals */}
          {currentStep === 5 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e5989b]/10 mb-3 sm:mb-4">
                  <Code className="h-6 w-6 sm:h-8 sm:w-8 text-[#e5989b]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Skills & Learning Goals</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Help us recommend relevant courses and opportunities</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-medium">Current Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.currentSkills?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={skillInput}
                      onValueChange={(value) => {
                        addSkill(value)
                        setSkillInput('')
                      }}
                    >
                      <SelectTrigger className="flex-1 h-11 sm:h-12">
                        <SelectValue placeholder="Select or type a skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_SKILLS.filter(s => !profile.currentSkills?.includes(s)).map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder="Or type a custom skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && skillInput.trim()) {
                        e.preventDefault()
                        addSkill(skillInput.trim())
                      }
                    }}
                    className="h-11 sm:h-12 mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-medium">Skills You Want to Learn</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.skillsWanted?.map((skill) => (
                      <Badge key={skill} variant="outline" className="flex items-center gap-1">
                        {skill}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateProfile({ skillsWanted: profile.skillsWanted?.filter(s => s !== skill) })}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Type a skill you want to learn and press Enter"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && goalInput.trim()) {
                        e.preventDefault()
                        addGoal(goalInput.trim())
                      }
                    }}
                    className="h-11 sm:h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm sm:text-base font-medium">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your academic journey and goals..."
                    value={profile.bio || ''}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    className="min-h-[100px]"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(profile.bio?.length || 0)} / 500 characters
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 sm:pt-6 mt-4 sm:mt-6 border-t gap-2 sm:gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="h-10 sm:h-11"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="h-10 sm:h-11 px-6 sm:px-8 bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d] text-white"
            >
              {currentStep === TOTAL_STEPS ? 'Complete Profile' : 'Continue'}
              {currentStep < TOTAL_STEPS && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
