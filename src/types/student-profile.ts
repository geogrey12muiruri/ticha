/**
 * Comprehensive Student Profile Schema
 * Research-grounded mapping to Kenya's 2025 education landscape (CBC, KCSE/KNEC, TVET, KUCCPS/KNQF)
 */

export type AcademicStage = 
  | 'PrePrimary' 
  | 'Primary' 
  | 'JuniorSecondary' 
  | 'SeniorSecondary' 
  | 'TVET' 
  | 'University' 
  | 'Graduate'

export type Gender = 'M' | 'F' | 'Other' | 'PreferNot'

export type SchoolType = 'Public' | 'Private' | 'HomeSchool' | 'TVET' | 'University'

export type PreferredStream = 'STEM' | 'Humanities' | 'Arts' | 'Commerce' | 'Vocational'

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type OpportunityTypePreference = 
  | 'Scholarship' 
  | 'FreeCourse' 
  | 'MicroCert' 
  | 'Bootcamp' 
  | 'Mentorship' 
  | 'Internship'

export type LocationPreference = 'National' | 'CountyOnly' | 'RemoteOnly'

export type CostPreference = 'Free' | 'Affordable' | 'Paid'

export type InternetAccess = 'Regular' | 'Intermittent' | 'None'

export type Device = 'Phone' | 'Laptop' | 'Tablet' | 'None'

export type VerificationStatus = 'unverified' | 'pending' | 'verified'

export interface PersonalInfo {
  firstName: string
  lastName: string
  preferredName?: string
  dateOfBirth?: string // YYYY-MM-DD
  gender?: Gender
  county: string
  schoolName?: string
  schoolType?: SchoolType
  schoolContact?: {
    phone?: string
    email?: string
  }
  locationGeo?: {
    lat: number
    lng: number
  }
}

export interface AcademicStageInfo {
  stage: AcademicStage
  currentClassOrLevel: string // e.g., "Grade 6" / "Form 3" / "TVET Level 4"
  enrollmentYear?: number
}

export interface AssessmentGrade {
  year?: number
  score?: number | string
  meanGrade?: string // KCSE: "A", "A-", "B+", etc.
}

export interface MilestoneAssessment {
  name: string
  year: number
  subjects: Record<string, string> // { "Mathematics": "B2", "English": "B3" }
}

export interface AssessmentsAndGrades {
  kcpe?: AssessmentGrade
  kcse?: AssessmentGrade
  milestoneAssessments?: MilestoneAssessment[]
  transcriptUpload?: string // URL or file ID
}

export interface SubjectsCompetencies {
  subjectsTaken: string[]
  competencyTags?: string[] // ["Critical thinking", "Digital literacy", "Communication", "Numeracy"]
  preferredStream?: PreferredStream
}

export interface SkillCertification {
  skill: string
  proficiency: ProficiencyLevel
  evidence?: {
    link?: string // GitHub, Behance, etc.
    score?: number
    certificateUrl?: string
  }
}

export interface ProjectPortfolio {
  title: string
  type: 'Project' | 'Competition' | 'Research' | 'Other'
  link?: string // GitHub, Behance, YouTube, website
  description?: string
  technologies?: string[]
  year?: number
}

export interface ExtracurricularAward {
  type: string // "Debate team captain", "Science Club", etc.
  years?: string // "2022-2024"
  details?: string // "Regional runner-up"
}

export interface CareerGoals {
  shortTerm?: string
  longTerm?: string
  preferredModes?: ('Online' | 'In-person' | 'Hybrid')[]
}

export interface AccessReadiness {
  internetAccess?: InternetAccess
  device?: Device
  preferredLanguage?: string // "English", "Kiswahili", "Sheng", etc.
  availabilityHoursPerWeek?: number
}

export interface PreferencesFilters {
  opportunityTypes?: OpportunityTypePreference[]
  locationPreference?: LocationPreference
  costPreference?: CostPreference
  startDateRange?: {
    from?: string // YYYY-MM-DD
    to?: string // YYYY-MM-DD
  }
}

export interface VerifiedDocument {
  type: string // "School letter", "Transcript", etc.
  file: string // File ID or URL
  verifiedBy?: string
  verifiedAt?: string
}

export interface Verification {
  schoolVerificationStatus?: VerificationStatus
  verifiedDocuments?: VerifiedDocument[]
  selfDeclared?: boolean
}

export interface StudentProfile {
  id?: string // UUID
  personal: PersonalInfo
  academicStage: AcademicStageInfo
  assessmentsAndGrades?: AssessmentsAndGrades
  subjectsCompetencies: SubjectsCompetencies
  skillsAndCertifications?: SkillCertification[]
  projectsPortfolio?: ProjectPortfolio[]
  extracurricularsAndAwards?: ExtracurricularAward[]
  careerGoals: CareerGoals
  accessAndReadiness?: AccessReadiness
  preferencesAndFilters?: PreferencesFilters
  verification?: Verification
  meta?: {
    createdAt?: string
    lastUpdated?: string
    embeddingVectorId?: string // For vector DB
  }
}

// Legacy compatibility - map to new schema
export function mapLegacyProfile(legacy: any): Partial<StudentProfile> {
  return {
    personal: {
      firstName: legacy.name?.split(' ')[0] || '',
      lastName: legacy.name?.split(' ').slice(1).join(' ') || '',
      county: legacy.county || '',
      schoolName: legacy.currentSchool,
      schoolType: legacy.schoolType as SchoolType,
    },
    academicStage: {
      stage: mapGradeToStage(legacy.grade),
      currentClassOrLevel: legacy.grade ? `Grade ${legacy.grade}` : '',
    },
    subjectsCompetencies: {
      subjectsTaken: legacy.subjects || [],
      preferredStream: mapFieldToStream(legacy.preferredField),
    },
    skillsAndCertifications: legacy.currentSkills?.map((skill: string) => ({
      skill,
      proficiency: 'Intermediate' as ProficiencyLevel,
    })),
    projectsPortfolio: legacy.projects,
    careerGoals: {
      shortTerm: legacy.learningGoals?.[0],
      longTerm: legacy.careerInterest,
    },
  }
}

function mapGradeToStage(grade?: number): AcademicStage {
  if (!grade) return 'Primary'
  if (grade <= 6) return 'Primary'
  if (grade <= 9) return 'JuniorSecondary'
  if (grade <= 12) return 'SeniorSecondary'
  return 'SeniorSecondary'
}

function mapFieldToStream(field?: string): PreferredStream | undefined {
  if (!field) return undefined
  const stem = ['Engineering', 'Medicine', 'Science', 'Technology', 'Mathematics']
  const humanities = ['History', 'Literature', 'Languages', 'Philosophy']
  const arts = ['Art', 'Design', 'Music', 'Drama']
  const commerce = ['Business', 'Economics', 'Finance', 'Accounting']
  
  if (stem.some(f => field.includes(f))) return 'STEM'
  if (humanities.some(f => field.includes(f))) return 'Humanities'
  if (arts.some(f => field.includes(f))) return 'Arts'
  if (commerce.some(f => field.includes(f))) return 'Commerce'
  return undefined
}


