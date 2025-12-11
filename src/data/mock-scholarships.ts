/**
 * Mock Scholarships Data
 * Comprehensive test data for prototyping without database
 * Generated from seed-data.ts
 */

import type { Scholarship } from '@/types/scholarship'
import { SEED_SCHOLARSHIPS, convertSeedToDatabase } from './seed-data'

/**
 * Convert seed data to full Scholarship objects
 */
function convertToScholarship(seed: any): Scholarship {
  // Generate consistent ID from name
  const id = `mock-${seed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
  
  return {
    id,
    name: seed.name,
    description: seed.description,
    provider: seed.provider,
    type: seed.type,
    category: seed.category,
    eligibility: seed.eligibility || {},
    amount: seed.amount,
    coverage: seed.coverage || [],
    duration: seed.duration,
    bootcampDetails: seed.bootcampDetails,
    learningDetails: seed.learningDetails,
    applicationDeadline: seed.applicationDeadline 
      ? (typeof seed.applicationDeadline === 'string' 
          ? seed.applicationDeadline 
          : new Date(seed.applicationDeadline).toISOString())
      : undefined,
    applicationLink: seed.applicationLink || undefined,
    contactInfo: seed.contactInfo || {},
    requirements: seed.requirements || [],
    documents: seed.documents || [],
    notes: seed.notes,
    priority: seed.priority || 0,
  }
}

/**
 * Mock scholarships data - all opportunity types
 */
export const MOCK_SCHOLARSHIPS: Scholarship[] = SEED_SCHOLARSHIPS.map(convertToScholarship)

/**
 * Get mock scholarships with optional filtering
 */
export function getMockScholarships(filters?: {
  type?: string
  county?: string
  category?: string
  limit?: number
}): Scholarship[] {
  let scholarships = [...MOCK_SCHOLARSHIPS]

  // Apply filters
  if (filters?.type) {
    scholarships = scholarships.filter(s => s.type === filters.type)
  }

  if (filters?.county) {
    scholarships = scholarships.filter(s => {
      const counties = s.eligibility?.counties || []
      return counties.length === 0 || counties.includes(filters.county!)
    })
  }

  if (filters?.category) {
    scholarships = scholarships.filter(s => s.category === filters.category)
  }

  // Limit
  if (filters?.limit) {
    scholarships = scholarships.slice(0, filters.limit)
  }

  return scholarships
}

/**
 * Get mock scholarship by ID
 */
export function getMockScholarshipById(id: string): Scholarship | null {
  return MOCK_SCHOLARSHIPS.find(s => s.id === id) || null
}

