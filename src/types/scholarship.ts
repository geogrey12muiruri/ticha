/**
 * Opportunity-related types
 * Expanded to include scholarships, bootcamps, and learning opportunities
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

/**
 * Student Academic Profile - Comprehensive Pathfinder Profile
 * LinkedIn-style profile focusing on academic qualifications, projects, and career goals
 * No financial information - that's handled in actual scholarship applications
 */
export interface ScholarshipProfile {
  // Basic Information
  name?: string // Student's name
  county?: string // County (for location-specific opportunities)
  constituency?: string // Constituency (optional)
  
  // Academic Information
  currentSchool?: string // Current school name
  schoolType?: 'public' | 'private' | 'boarding' | 'day'
  grade?: number // Current grade level (1-12)
  curriculum?: '8-4-4' | 'CBC'
  
  // Subjects & Grades
  subjects?: string[] // Subjects student is taking
  subjectGrades?: Record<string, string> // Grades per subject (e.g., { "Mathematics": "A", "English": "B+" })
  
  // Academic Performance & Qualifications
  kcpeScore?: number // KCPE score (if completed)
  kcseGrade?: string // KCSE grade (if completed)
  averageGrade?: 'A' | 'B' | 'C' | 'D' | 'E' // Current average grade
  
  // Extracurricular Activities
  extracurriculars?: string[] // Extracurricular activities (e.g., ["Debate Club", "Football", "Science Club"])
  
  // Skills & Interests
  currentSkills?: string[] // Skills student already has (e.g., ["JavaScript", "Python", "Design"])
  skillsWanted?: string[] // Skills student wants to learn
  interests?: string[] // General interests (e.g., ["Technology", "Art", "Music"])
  
  // Projects & Portfolio
  projects?: Array<{
    title: string
    description?: string
    type: 'github' | 'behance' | 'video' | 'website' | 'other'
    url: string
    technologies?: string[] // Technologies used
    year?: number
  }>
  
  // Career Aspirations
  careerInterest?: string // Primary career goal (e.g., "Software Engineer", "Doctor")
  careerGoals?: string[] // Multiple career interests
  preferredField?: string // Field of study interest (e.g., "Engineering", "Medicine")
  
  // Certificates & Awards
  certifications?: Array<{
    name: string
    issuer?: string
    date?: string
    url?: string // Link to certificate
  }>
  achievements?: string[] // Academic achievements, awards
  
  // Languages
  languages?: string[] // Languages spoken (e.g., ["English", "Kiswahili", "French"])
  
  // Learning Preferences
  learningGoals?: string[] // Learning objectives
  preferredFormat?: 'online' | 'in-person' | 'hybrid' | 'any'
  timeAvailability?: 'full-time' | 'part-time' | 'weekends' | 'evenings' | 'flexible'
  
  // Bio/Summary
  bio?: string // Professional summary about academic journey and goals
}

export interface Scholarship {
  id: string
  name: string
  description: string
  provider: string // e.g., "County Government", "NGO", "Private Foundation", "Tech Company"
  type: OpportunityType
  
  // Eligibility Criteria
  eligibility: {
    counties?: string[]
    constituencies?: string[]
    minGrade?: number
    maxGrade?: number
    curriculum?: ('8-4-4' | 'CBC')[]
    minKCSE?: string
    minKCPE?: number
    incomeLevel?: ('low' | 'medium' | 'high')[]
    specialConditions?: string[] // e.g., "orphan", "disability", "single_parent"
    fieldOfStudy?: string[]
    // Bootcamp/Learning specific
    skillsRequired?: string[] // Prerequisites for bootcamps
    careerInterests?: string[] // Matching career interests
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'any'
  }
  
  // Award Details (for scholarships)
  amount?: string // e.g., "KES 50,000/year" or "Full tuition"
  coverage?: string[] // e.g., ["tuition", "books", "accommodation"]
  duration?: string // e.g., "4 years" or "Until graduation"
  
  // Bootcamp/Learning Details
  bootcampDetails?: {
    duration?: string // e.g., "12 weeks", "6 months"
    format?: 'online' | 'in-person' | 'hybrid'
    schedule?: 'full-time' | 'part-time' | 'weekends' | 'evenings' | 'flexible'
    skillsTaught?: string[] // Technologies, languages, frameworks
    certification?: boolean
    certificationType?: string // e.g., "Certificate of Completion", "Industry Certification"
    prerequisites?: string[] // Required knowledge/skills
    cost?: 'free' | 'paid' | 'partial' | 'scholarship-available'
    costAmount?: string // If paid, how much
  }
  
  learningDetails?: {
    courseType?: 'mooc' | 'workshop' | 'course' | 'seminar' | 'webinar'
    platform?: string // e.g., "Coursera", "ALX", "Udemy", "Local Provider"
    duration?: string
    format?: 'online' | 'in-person' | 'hybrid'
    certification?: boolean
    cost?: 'free' | 'paid' | 'affordable' | 'partial'
    costAmount?: string
    language?: string[] // Languages of instruction
  }
  
  mentorshipDetails?: {
    duration?: string // e.g., "3 months", "6 months"
    format?: 'online' | 'in-person' | 'hybrid'
    frequency?: string // e.g., "Weekly", "Bi-weekly"
    mentorType?: 'industry' | 'academic' | 'peer' | 'any'
    focus?: string[] // Focus areas
  }
  
  internshipDetails?: {
    duration?: string // e.g., "3 months", "6 months"
    format?: 'remote' | 'on-site' | 'hybrid'
    stipend?: boolean
    stipendAmount?: string
    applicationMethod?: 'online' | 'email' | 'portal'
    requirements?: string[] // Requirements
  }
  
  // Application Info
  applicationDeadline?: string
  applicationLink?: string
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
  }
  
  // Additional Info
  requirements?: string[]
  documents?: string[]
  notes?: string
  priority?: number // For ranking (1 = highest priority)
  category?: string // e.g., "Tech", "Business", "Education", "Healthcare"
}

export interface ScholarshipMatch {
  scholarship: Scholarship
  matchScore: number // 0-100
  matchReasons: string[] // Why this scholarship matches
  applicationSteps: string[]
  estimatedChance: 'high' | 'medium' | 'low'
}

