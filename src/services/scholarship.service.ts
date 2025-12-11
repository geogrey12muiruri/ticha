/**
 * Scholarship Matching Service
 * Matches student profiles to available scholarships
 * 
 * NOTE: This service now uses API data. For backward compatibility,
 * it still has methods that work with static data.
 */

import { SCHOLARSHIPS } from '@/constants/scholarships'
import type { ScholarshipProfile, Scholarship, ScholarshipMatch } from '@/types/scholarship'

export class ScholarshipService {
  /**
   * Match student profile to scholarships
   * @deprecated Use ScholarshipAPIService.matchScholarships() instead
   */
  static matchScholarships(profile: ScholarshipProfile): ScholarshipMatch[] {
    const matches: ScholarshipMatch[] = []

    for (const scholarship of SCHOLARSHIPS) {
      const matchScore = this.calculateMatchScore(profile, scholarship)
      
      if (matchScore > 0) {
        const matchReasons = this.getMatchReasons(profile, scholarship)
        const applicationSteps = this.generateApplicationSteps(scholarship)
        const estimatedChance = this.estimateChance(matchScore)

        matches.push({
          scholarship,
          matchScore,
          matchReasons,
          applicationSteps,
          estimatedChance,
        })
      }
    }

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore)
  }

  /**
   * Calculate match score (0-100)
   * Type-specific matching logic for all opportunity types
   * Made public for use by API service
   */
  static calculateMatchScore(
    profile: ScholarshipProfile,
    scholarship: Scholarship
  ): number {
    // Route to type-specific matching
    if (scholarship.type === 'bootcamp') {
      return this.calculateBootcampMatch(profile, scholarship)
    }
    if (scholarship.type === 'learning') {
      return this.calculateLearningMatch(profile, scholarship)
    }
    if (scholarship.type === 'mentorship') {
      return this.calculateMentorshipMatch(profile, scholarship)
    }
    if (scholarship.type === 'internship') {
      return this.calculateInternshipMatch(profile, scholarship)
    }
    // Default: scholarship matching
    return this.calculateScholarshipMatch(profile, scholarship)
  }

  /**
   * Calculate match score for scholarships (original logic)
   */
  private static calculateScholarshipMatch(
    profile: ScholarshipProfile,
    scholarship: Scholarship
  ): number {
    let score = 0
    const maxScore = 100
    const weights = {
      location: 20,
      academic: 35,
      financial: 20, // Now used for career/field match
      special: 15, // Now used for skills match
      field: 10,
    }

    const eligibility = scholarship.eligibility

    // Location match (25 points)
    if (eligibility.counties && profile.county) {
      if (eligibility.counties.includes(profile.county)) {
        score += weights.location
      }
    } else if (!eligibility.counties) {
      // No location restriction = available to all
      score += weights.location * 0.5
    }

    // Academic match (30 points)
    if (profile.grade) {
      const inGradeRange =
        (!eligibility.minGrade || profile.grade >= eligibility.minGrade) &&
        (!eligibility.maxGrade || profile.grade <= eligibility.maxGrade)
      
      if (inGradeRange) {
        score += weights.academic * 0.5
      }
    }

    if (eligibility.curriculum && profile.curriculum) {
      if (eligibility.curriculum.includes(profile.curriculum)) {
        score += weights.academic * 0.3
      }
    }

    if (profile.kcpeScore && eligibility.minKCPE) {
      if (profile.kcpeScore >= eligibility.minKCPE) {
        score += weights.academic * 0.2
      }
    }

    if (profile.kcseGrade && eligibility.minKCSE) {
      const gradeOrder = ['E', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A']
      const profileIndex = gradeOrder.indexOf(profile.kcseGrade)
      const minIndex = gradeOrder.indexOf(eligibility.minKCSE)
      if (profileIndex >= minIndex) {
        score += weights.academic * 0.2
      }
    }

    // Career/Field match (20 points) - Replaces financial match
    if (eligibility.careerInterests && profile.careerInterest) {
      const careerMatch = eligibility.careerInterests.some(
        interest => interest.toLowerCase().includes(profile.careerInterest!.toLowerCase()) ||
                   profile.careerInterest!.toLowerCase().includes(interest.toLowerCase())
      )
      if (careerMatch) {
        score += weights.financial // Reusing financial weight for career match
      }
    } else if (eligibility.fieldOfStudy && profile.preferredField) {
      const fieldMatch = eligibility.fieldOfStudy.some(
        field => field.toLowerCase().includes(profile.preferredField!.toLowerCase()) ||
                 profile.preferredField!.toLowerCase().includes(field.toLowerCase())
      )
      if (fieldMatch) {
        score += weights.financial * 0.8
      }
    } else if (!eligibility.incomeLevel && !eligibility.careerInterests && !eligibility.fieldOfStudy) {
      // No specific requirements = available to all
      score += weights.financial * 0.5
    }

    // Skills match (15 points) - Replaces special conditions
    if (eligibility.skillsRequired && profile.currentSkills) {
      const skillsMatch = eligibility.skillsRequired.some(required =>
        profile.currentSkills!.some(current =>
          current.toLowerCase().includes(required.toLowerCase()) ||
          required.toLowerCase().includes(current.toLowerCase())
        )
      )
      if (skillsMatch) {
        score += weights.special
      }
    } else if (profile.skillsWanted && eligibility.skillsRequired) {
      // Match on skills wanted
      const wantedMatch = profile.skillsWanted.some(wanted =>
        eligibility.skillsRequired!.some(required =>
          wanted.toLowerCase().includes(required.toLowerCase()) ||
          required.toLowerCase().includes(wanted.toLowerCase())
        )
      )
      if (wantedMatch) {
        score += weights.special * 0.7
      }
    }

    // Field of study match (10 points)
    if (eligibility.fieldOfStudy && profile.preferredField) {
      const fieldMatch = eligibility.fieldOfStudy.some(
        field => field.toLowerCase().includes(profile.preferredField!.toLowerCase()) ||
                 profile.preferredField!.toLowerCase().includes(field.toLowerCase())
      )
      if (fieldMatch) {
        score += weights.field
      }
    } else if (!eligibility.fieldOfStudy) {
      score += weights.field * 0.5
    }

    // Bonus for priority scholarships
    if (scholarship.priority === 1) {
      score += 5
    }

    return Math.min(Math.round(score), maxScore)
  }

  /**
   * Calculate match score for bootcamps
   */
  private static calculateBootcampMatch(
    profile: ScholarshipProfile,
    scholarship: Scholarship
  ): number {
    let score = 0
    const maxScore = 100
    const weights = {
      careerInterest: 40,
      skills: 30,
      location: 15,
      schedule: 10,
      experience: 5,
    }

    const eligibility = scholarship.eligibility
    const bootcamp = scholarship.bootcampDetails

    // Career interest match (40 points)
    if (eligibility.careerInterests && profile.careerInterest) {
      const interestMatch = eligibility.careerInterests.some(
        interest => interest.toLowerCase().includes(profile.careerInterest!.toLowerCase()) ||
                   profile.careerInterest!.toLowerCase().includes(interest.toLowerCase())
      )
      if (interestMatch) {
        score += weights.careerInterest
      }
    } else if (!eligibility.careerInterests) {
      score += weights.careerInterest * 0.5
    }

    // Skills match (30 points)
    if (bootcamp?.skillsTaught && profile.skillsWanted) {
      const skillsMatch = bootcamp.skillsTaught.some(skill =>
        profile.skillsWanted!.some(wanted =>
          skill.toLowerCase().includes(wanted.toLowerCase()) ||
          wanted.toLowerCase().includes(skill.toLowerCase())
        )
      )
      if (skillsMatch) {
        score += weights.skills
      }
    } else if (bootcamp?.skillsTaught && profile.learningGoals) {
      // Match on learning goals if skills wanted not provided
      const goalMatch = profile.learningGoals.some(goal =>
        bootcamp.skillsTaught!.some(skill =>
          goal.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(goal.toLowerCase())
        )
      )
      if (goalMatch) {
        score += weights.skills * 0.7
      }
    }

    // Location match (15 points)
    if (eligibility.counties && profile.county) {
      if (eligibility.counties.includes(profile.county)) {
        score += weights.location
      }
    } else if (!eligibility.counties) {
      score += weights.location * 0.5
    }

    // Schedule match (10 points)
    if (bootcamp?.schedule && profile.timeAvailability) {
      if (bootcamp.schedule === profile.timeAvailability) {
        score += weights.schedule
      } else if (bootcamp.schedule === 'flexible' || profile.timeAvailability === 'flexible') {
        score += weights.schedule * 0.7
      }
    } else if (!bootcamp?.schedule) {
      score += weights.schedule * 0.5
    }

    // Format match (bonus)
    if (bootcamp?.format && profile.preferredFormat) {
      if (bootcamp.format === profile.preferredFormat || profile.preferredFormat === 'any') {
        score += 3
      }
    }

    // Experience level match (5 points)
    if (eligibility.experienceLevel && profile.currentSkills) {
      // Simple heuristic: if has skills, likely intermediate+
      if (eligibility.experienceLevel === 'any' || eligibility.experienceLevel === 'beginner') {
        score += weights.experience
      } else if (profile.currentSkills.length > 0 && eligibility.experienceLevel === 'intermediate') {
        score += weights.experience
      }
    } else if (eligibility.experienceLevel === 'any' || !eligibility.experienceLevel) {
      score += weights.experience
    }

    // Bonus for free bootcamps
    if (bootcamp?.cost === 'free') {
      score += 5
    }

    return Math.min(Math.round(score), maxScore)
  }

  /**
   * Calculate match score for learning opportunities
   */
  private static calculateLearningMatch(
    profile: ScholarshipProfile,
    scholarship: Scholarship
  ): number {
    let score = 0
    const maxScore = 100
    const weights = {
      careerInterest: 35,
      skillsGap: 35,
      availability: 20,
      cost: 10,
    }

    const eligibility = scholarship.eligibility
    const learning = scholarship.learningDetails

    // Career interest match (35 points)
    if (eligibility.careerInterests && profile.careerInterest) {
      const interestMatch = eligibility.careerInterests.some(
        interest => interest.toLowerCase().includes(profile.careerInterest!.toLowerCase()) ||
                   profile.careerInterest!.toLowerCase().includes(interest.toLowerCase())
      )
      if (interestMatch) {
        score += weights.careerInterest
      }
    } else if (!eligibility.careerInterests) {
      score += weights.careerInterest * 0.5
    }

    // Skills gap match (35 points) - what student wants but doesn't have
    if (profile.skillsWanted && profile.currentSkills) {
      const skillsGap = profile.skillsWanted.filter(
        wanted => !profile.currentSkills!.some(current =>
          current.toLowerCase().includes(wanted.toLowerCase()) ||
          wanted.toLowerCase().includes(current.toLowerCase())
        )
      )
      // If learning opportunity teaches skills in the gap
      if (learning?.courseType && skillsGap.length > 0) {
        score += weights.skillsGap * 0.8 // Partial match
      }
    } else if (profile.learningGoals && learning?.courseType) {
      // Match on learning goals
      score += weights.skillsGap * 0.7
    }

    // Availability match (20 points)
    if (learning?.format && profile.preferredFormat) {
      if (learning.format === profile.preferredFormat || profile.preferredFormat === 'any') {
        score += weights.availability
      }
    } else if (!learning?.format) {
      score += weights.availability * 0.5
    }

    // Cost match (10 points) - prefer free
    if (learning?.cost) {
      if (learning.cost === 'free') {
        score += weights.cost
      } else if (learning.cost === 'partial') {
        score += weights.cost * 0.5
      }
    } else {
      score += weights.cost * 0.5
    }

    // Bonus for certification
    if (learning?.certification) {
      score += 3
    }

    return Math.min(Math.round(score), maxScore)
  }

  /**
   * Get reasons why scholarship matches
   * Made public for use by API service
   */
  static getMatchReasons(
    profile: ScholarshipProfile,
    scholarship: Scholarship
  ): string[] {
    const reasons: string[] = []
    const eligibility = scholarship.eligibility

    if (eligibility.counties && profile.county) {
      if (eligibility.counties.includes(profile.county)) {
        reasons.push(`Available in ${profile.county} County`)
      }
    }

    if (profile.grade) {
      const inRange =
        (!eligibility.minGrade || profile.grade >= eligibility.minGrade) &&
        (!eligibility.maxGrade || profile.grade <= eligibility.maxGrade)
      if (inRange) {
        reasons.push(`Suitable for Grade ${profile.grade} students`)
      }
    }

    if (eligibility.careerInterests && profile.careerInterest) {
      const careerMatch = eligibility.careerInterests.some(
        interest => interest.toLowerCase().includes(profile.careerInterest!.toLowerCase()) ||
                   profile.careerInterest!.toLowerCase().includes(interest.toLowerCase())
      )
      if (careerMatch) {
        reasons.push(`Matches your career interest: ${profile.careerInterest}`)
      }
    }

    if (eligibility.fieldOfStudy && profile.preferredField) {
      const fieldMatch = eligibility.fieldOfStudy.some(
        field => field.toLowerCase().includes(profile.preferredField!.toLowerCase()) ||
                 profile.preferredField!.toLowerCase().includes(field.toLowerCase())
      )
      if (fieldMatch) {
        reasons.push(`Matches your field of study: ${profile.preferredField}`)
      }
    }

    if (eligibility.skillsRequired && profile.currentSkills) {
      const skillsMatch = eligibility.skillsRequired.some(required =>
        profile.currentSkills!.some(current =>
          current.toLowerCase().includes(required.toLowerCase()) ||
          required.toLowerCase().includes(current.toLowerCase())
        )
      )
      if (skillsMatch) {
        reasons.push('Matches your current skills')
      }
    }

    if (eligibility.specialConditions) {
      if (profile.orphanStatus && eligibility.specialConditions.includes('orphan')) {
        reasons.push('Supports orphaned students')
      }
      if (profile.singleParent && eligibility.specialConditions.includes('single_parent')) {
        reasons.push('Supports single-parent families')
      }
      if (profile.disability && eligibility.specialConditions.includes('disability')) {
        reasons.push('Supports students with disabilities')
      }
    }

    if (reasons.length === 0) {
      reasons.push('General eligibility criteria met')
    }

    return reasons
  }

  /**
   * Generate application steps
   * Made public for use by API service
   */
  static generateApplicationSteps(scholarship: Scholarship): string[] {
    const steps: string[] = []

    steps.push(`Review the requirements for ${scholarship.name}`)

    if (scholarship.documents && scholarship.documents.length > 0) {
      steps.push(`Gather required documents: ${scholarship.documents.join(', ')}`)
    }

    if (scholarship.applicationLink) {
      steps.push(`Apply online at: ${scholarship.applicationLink}`)
    } else {
      steps.push(`Contact ${scholarship.provider} for application details`)
    }

    if (scholarship.contactInfo?.email) {
      steps.push(`Email: ${scholarship.contactInfo.email}`)
    }

    if (scholarship.contactInfo?.phone) {
      steps.push(`Phone: ${scholarship.contactInfo.phone}`)
    }

    if (scholarship.applicationDeadline) {
      steps.push(`Submit before: ${scholarship.applicationDeadline}`)
    }

    return steps
  }

  /**
   * Estimate chance of success
   * Made public for use by API service
   */
  static estimateChance(matchScore: number): 'high' | 'medium' | 'low' {
    if (matchScore >= 70) return 'high'
    if (matchScore >= 40) return 'medium'
    return 'low'
  }

  /**
   * Get scholarship by ID
   */
  static getScholarshipById(id: string): Scholarship | undefined {
    return SCHOLARSHIPS.find(s => s.id === id)
  }

  /**
   * Get all scholarships
   */
  static getAllScholarships(): Scholarship[] {
    return SCHOLARSHIPS
  }

  /**
   * Calculate match score for mentorships
   */
  private static calculateMentorshipMatch(
    profile: ScholarshipProfile,
    scholarship: Scholarship
  ): number {
    let score = 0
    const maxScore = 100
    const weights = {
      careerInterest: 40,
      skills: 30,
      academic: 20,
      location: 10,
    }

    const eligibility = scholarship.eligibility
    const mentorship = scholarship.mentorshipDetails

    // Career interest match (40 points)
    if (eligibility.careerInterests && profile.careerInterest) {
      const interestMatch = eligibility.careerInterests.some(
        interest => interest.toLowerCase().includes(profile.careerInterest!.toLowerCase()) ||
                   profile.careerInterest!.toLowerCase().includes(interest.toLowerCase())
      )
      if (interestMatch) {
        score += weights.careerInterest
      }
    } else if (!eligibility.careerInterests) {
      score += weights.careerInterest * 0.5
    }

    // Skills match (30 points)
    if (mentorship?.focus && profile.currentSkills) {
      const skillsMatch = mentorship.focus.some(focus =>
        profile.currentSkills!.some(skill =>
          skill.toLowerCase().includes(focus.toLowerCase()) ||
          focus.toLowerCase().includes(skill.toLowerCase())
        )
      )
      if (skillsMatch) {
        score += weights.skills
      }
    } else if (mentorship?.focus && profile.skillsWanted) {
      const wantedMatch = profile.skillsWanted.some(wanted =>
        mentorship.focus!.some(focus =>
          wanted.toLowerCase().includes(focus.toLowerCase()) ||
          focus.toLowerCase().includes(wanted.toLowerCase())
        )
      )
      if (wantedMatch) {
        score += weights.skills * 0.7
      }
    }

    // Academic match (20 points)
    if (eligibility.fieldOfStudy && profile.preferredField) {
      const fieldMatch = eligibility.fieldOfStudy.some(
        field => field.toLowerCase().includes(profile.preferredField!.toLowerCase()) ||
                 profile.preferredField!.toLowerCase().includes(field.toLowerCase())
      )
      if (fieldMatch) {
        score += weights.academic
      }
    } else if (!eligibility.fieldOfStudy) {
      score += weights.academic * 0.5
    }

    // Location match (10 points)
    if (eligibility.counties && profile.county) {
      if (eligibility.counties.includes(profile.county)) {
        score += weights.location
      }
    } else if (!eligibility.counties || mentorship?.format === 'online') {
      score += weights.location * 0.5
    }

    // Format match (bonus)
    if (mentorship?.format && profile.preferredFormat) {
      if (mentorship.format === profile.preferredFormat || profile.preferredFormat === 'any') {
        score += 3
      }
    }

    return Math.min(Math.round(score), maxScore)
  }

  /**
   * Calculate match score for internships
   */
  private static calculateInternshipMatch(
    profile: ScholarshipProfile,
    scholarship: Scholarship
  ): number {
    let score = 0
    const maxScore = 100
    const weights = {
      careerInterest: 35,
      skills: 35,
      academic: 20,
      location: 10,
    }

    const eligibility = scholarship.eligibility
    const internship = scholarship.internshipDetails

    // Career interest match (35 points)
    if (eligibility.careerInterests && profile.careerInterest) {
      const interestMatch = eligibility.careerInterests.some(
        interest => interest.toLowerCase().includes(profile.careerInterest!.toLowerCase()) ||
                   profile.careerInterest!.toLowerCase().includes(interest.toLowerCase())
      )
      if (interestMatch) {
        score += weights.careerInterest
      }
    } else if (!eligibility.careerInterests) {
      score += weights.careerInterest * 0.5
    }

    // Skills match (35 points) - critical for internships
    if (internship?.requirements && profile.currentSkills) {
      const requirementsMet = internship.requirements.filter(req =>
        profile.currentSkills!.some(skill =>
          skill.toLowerCase().includes(req.toLowerCase()) ||
          req.toLowerCase().includes(skill.toLowerCase())
        )
      ).length
      
      if (requirementsMet > 0) {
        score += (weights.skills * requirementsMet) / internship.requirements.length
      }
    } else if (internship?.requirements && profile.skillsWanted) {
      const wantedMatch = profile.skillsWanted.some(wanted =>
        internship.requirements!.some(req =>
          wanted.toLowerCase().includes(req.toLowerCase()) ||
          req.toLowerCase().includes(wanted.toLowerCase())
        )
      )
      if (wantedMatch) {
        score += weights.skills * 0.6
      }
    }

    // Academic match (20 points)
    if (eligibility.fieldOfStudy && profile.preferredField) {
      const fieldMatch = eligibility.fieldOfStudy.some(
        field => field.toLowerCase().includes(profile.preferredField!.toLowerCase()) ||
                 profile.preferredField!.toLowerCase().includes(field.toLowerCase())
      )
      if (fieldMatch) {
        score += weights.academic
      }
    } else if (!eligibility.fieldOfStudy) {
      score += weights.academic * 0.5
    }

    // Location match (10 points)
    if (eligibility.counties && profile.county) {
      if (eligibility.counties.includes(profile.county)) {
        score += weights.location
      }
    } else if (!eligibility.counties || internship?.format === 'remote') {
      score += weights.location * 0.5
    }

    // Format match (bonus)
    if (internship?.format && profile.preferredFormat) {
      if (internship.format === 'remote' && profile.preferredFormat === 'online') {
        score += 3
      } else if (internship.format === profile.preferredFormat || profile.preferredFormat === 'any') {
        score += 3
      }
    }

    // Stipend bonus
    if (internship?.stipend) {
      score += 2
    }

    return Math.min(Math.round(score), maxScore)
  }
}

