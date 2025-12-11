/**
 * Scholarship types for MCP server
 * Local copy to avoid dependency on main app
 */

export type OpportunityType = 
  | 'scholarship' 
  | 'bursary' 
  | 'loan' 
  | 'grant' 
  | 'bootcamp' 
  | 'learning'
  | 'mentorship'
  | 'internship'

export interface ScholarshipEligibility {
  counties?: string[]
  constituencies?: string[]
  minGrade?: number
  maxGrade?: number
  minKCPE?: number
  minKCSE?: string
  incomeLevel?: ('low' | 'medium' | 'high')[]
  specialConditions?: ('orphan' | 'disability' | 'single_parent')[]
  fieldOfStudy?: string[]
  careerInterests?: string[]
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'any'
  countries?: string[]
}

export interface Scholarship {
  id?: string
  name: string
  description?: string
  provider: string
  type: OpportunityType
  category?: string
  eligibility: ScholarshipEligibility
  amount?: string
  coverage?: string[]
  duration?: string
  bootcampDetails?: any
  learningDetails?: any
  mentorshipDetails?: any
  internshipDetails?: any
  applicationDeadline?: string
  applicationLink?: string
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
    website?: string
    source?: string
  }
  requirements?: string[]
  documents?: string[]
  notes?: string
  priority?: number
}

