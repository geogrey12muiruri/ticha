/**
 * Scholarship Questionnaire Component
 * Collects student profile information for scholarship matching
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { KENYAN_COUNTIES, FIELDS_OF_STUDY } from '@/constants/scholarships'
import type { ScholarshipProfile } from '@/types/scholarship'

interface QuestionnaireProps {
  onComplete: (profile: ScholarshipProfile) => void
}

const TOTAL_QUESTIONS = 7

export function ScholarshipQuestionnaire({ onComplete }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<ScholarshipProfile>({})

  const updateProfile = (updates: Partial<ScholarshipProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < TOTAL_QUESTIONS) {
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

  const progress = (currentStep / TOTAL_QUESTIONS) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl">Find Your Scholarships</CardTitle>
          <CardDescription>
            Answer a few questions to find scholarships that match your profile
          </CardDescription>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground text-center">
            Question {currentStep} of {TOTAL_QUESTIONS}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question 1: Location */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Where are you located?</h3>
            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <Select
                value={profile.county || ''}
                onValueChange={(value) => updateProfile({ county: value })}
              >
                <SelectTrigger id="county">
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
              <Label htmlFor="constituency">Constituency (Optional)</Label>
              <Input
                id="constituency"
                placeholder="Enter your constituency"
                value={profile.constituency || ''}
                onChange={(e) => updateProfile({ constituency: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Question 2: Academic Level */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What's your current academic level?</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Curriculum</Label>
                <RadioGroup
                  value={profile.curriculum || ''}
                  onValueChange={(value) => updateProfile({ curriculum: value as '8-4-4' | 'CBC' })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CBC" id="cbc" />
                    <Label htmlFor="cbc">CBC (Competency-Based Curriculum)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="8-4-4" id="844" />
                    <Label htmlFor="844">8-4-4 System</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Current Grade/Form</Label>
                <Input
                  id="grade"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="e.g., 8"
                  value={profile.grade || ''}
                  onChange={(e) => updateProfile({ grade: parseInt(e.target.value) || undefined })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Question 3: Academic Performance */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Academic Performance</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kcpe">KCPE Score (if applicable)</Label>
                <Input
                  id="kcpe"
                  type="number"
                  min="0"
                  max="500"
                  placeholder="e.g., 380"
                  value={profile.kcpeScore || ''}
                  onChange={(e) => updateProfile({ kcpeScore: parseInt(e.target.value) || undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kcse">KCSE Grade (if applicable)</Label>
                <Select
                  value={profile.kcseGrade || ''}
                  onValueChange={(value) => updateProfile({ kcseGrade: value })}
                >
                  <SelectTrigger id="kcse">
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
          </div>
        )}

        {/* Question 4: Financial Situation */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Family Financial Situation</h3>
            <div className="space-y-2">
              <Label>Family Income Level</Label>
              <RadioGroup
                value={profile.familyIncome || ''}
                onValueChange={(value) => updateProfile({ familyIncome: value as 'low' | 'medium' | 'high' })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low (Struggling to afford school fees)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium (Can afford some costs)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High (Can afford most costs)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Question 5: Special Circumstances */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Special Circumstances</h3>
            <p className="text-sm text-muted-foreground">
              Select any that apply to you (this helps find specialized scholarships)
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="orphan"
                  checked={profile.orphanStatus || false}
                  onCheckedChange={(checked) => updateProfile({ orphanStatus: checked as boolean })}
                />
                <Label htmlFor="orphan">Orphan (Lost one or both parents)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="single-parent"
                  checked={profile.singleParent || false}
                  onCheckedChange={(checked) => updateProfile({ singleParent: checked as boolean })}
                />
                <Label htmlFor="single-parent">Single Parent Household</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disability"
                  checked={profile.disability || false}
                  onCheckedChange={(checked) => updateProfile({ disability: checked as boolean })}
                />
                <Label htmlFor="disability">Living with Disability</Label>
              </div>
            </div>
          </div>
        )}

        {/* Question 6: Field of Interest */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Field of Study Interest</h3>
            <div className="space-y-2">
              <Label htmlFor="field">Preferred Field (Optional)</Label>
              <Select
                value={profile.preferredField || ''}
                onValueChange={(value) => updateProfile({ preferredField: value })}
              >
                <SelectTrigger id="field">
                  <SelectValue placeholder="Select field of interest" />
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
          </div>
        )}

        {/* Question 7: Review */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            <div className="space-y-3 text-sm">
              {profile.county && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span><strong>Location:</strong> {profile.county}</span>
                </div>
              )}
              {profile.curriculum && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span><strong>Curriculum:</strong> {profile.curriculum}</span>
                </div>
              )}
              {profile.grade && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span><strong>Grade:</strong> {profile.grade}</span>
                </div>
              )}
              {profile.familyIncome && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span><strong>Income Level:</strong> {profile.familyIncome}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Ready to find scholarships that match your profile?
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d]"
          >
            {currentStep === TOTAL_QUESTIONS ? 'Find Scholarships' : 'Next'}
            {currentStep < TOTAL_QUESTIONS && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}



