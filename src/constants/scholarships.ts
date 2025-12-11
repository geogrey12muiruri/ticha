/**
 * Kenyan Scholarships Database
 * This is a sample database - in production, this would come from an API or database
 */

import type { Scholarship } from '@/types/scholarship'

export const SCHOLARSHIPS: Scholarship[] = [
  // County Government Scholarships
  {
    id: 'nairobi-county-bursary',
    name: 'Nairobi County Bursary Fund',
    description: 'Financial support for needy students in Nairobi County',
    provider: 'Nairobi County Government',
    type: 'bursary',
    eligibility: {
      counties: ['Nairobi'],
      minGrade: 1,
      maxGrade: 12,
      incomeLevel: ['low', 'medium'],
    },
    amount: 'KES 10,000 - 50,000 per year',
    coverage: ['tuition', 'books'],
    duration: 'Annual (renewable)',
    applicationDeadline: 'March 31',
    requirements: [
      'Must be a resident of Nairobi County',
      'Proof of financial need',
      'School admission letter',
      'Parent/Guardian ID',
    ],
    documents: [
      'Application form',
      'Birth certificate',
      'School fee structure',
      'Parent/Guardian ID copy',
      'Proof of residence',
    ],
    priority: 1,
  },
  {
    id: 'kiambu-county-scholarship',
    name: 'Kiambu County Scholarship Program',
    description: 'Full scholarship for top-performing students in Kiambu County',
    provider: 'Kiambu County Government',
    type: 'scholarship',
    eligibility: {
      counties: ['Kiambu'],
      minKCPE: 350,
      minKCSE: 'B+',
      incomeLevel: ['low', 'medium'],
    },
    amount: 'Full tuition + accommodation',
    coverage: ['tuition', 'accommodation', 'books'],
    duration: '4 years',
    applicationDeadline: 'February 28',
    priority: 1,
  },
  
  // National Scholarships
  {
    id: 'helb-loan',
    name: 'HELB Loan',
    description: 'Higher Education Loans Board - Government student loan',
    provider: 'HELB (Government)',
    type: 'loan',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      curriculum: ['8-4-4', 'CBC'],
    },
    amount: 'KES 40,000 - 150,000 per year',
    coverage: ['tuition', 'accommodation'],
    duration: 'Until graduation',
    applicationLink: 'https://www.helb.co.ke',
    priority: 2,
  },
  {
    id: 'equity-wings-to-fly',
    name: 'Equity Wings to Fly',
    description: 'Scholarship for bright but needy students',
    provider: 'Equity Bank Foundation',
    type: 'scholarship',
    eligibility: {
      minKCPE: 350,
      incomeLevel: ['low'],
      specialConditions: ['orphan', 'single_parent'],
    },
    amount: 'Full scholarship',
    coverage: ['tuition', 'accommodation', 'books', 'uniform'],
    duration: '4 years',
    applicationDeadline: 'January 31',
    applicationLink: 'https://www.equitybank.co.ke/wings-to-fly',
    priority: 1,
  },
  {
    id: 'kcb-foundation',
    name: 'KCB Foundation Scholarship',
    description: 'Scholarship for students from vulnerable backgrounds',
    provider: 'KCB Foundation',
    type: 'scholarship',
    eligibility: {
      minKCPE: 320,
      incomeLevel: ['low'],
      specialConditions: ['orphan', 'disability'],
    },
    amount: 'KES 70,000 per year',
    coverage: ['tuition', 'books'],
    duration: '4 years',
    applicationDeadline: 'February 15',
    priority: 2,
  },
  
  // Special Needs Scholarships
  {
    id: 'disability-fund',
    name: 'National Fund for the Disabled',
    description: 'Support for students with disabilities',
    provider: 'National Fund for the Disabled',
    type: 'grant',
    eligibility: {
      specialConditions: ['disability'],
      minGrade: 1,
      maxGrade: 12,
    },
    amount: 'KES 20,000 - 100,000',
    coverage: ['tuition', 'assistive devices'],
    duration: 'Annual (renewable)',
    applicationDeadline: 'Ongoing',
    priority: 1,
  },
  
  // Field-Specific Scholarships
  {
    id: 'stem-scholarship',
    name: 'STEM Excellence Scholarship',
    description: 'Scholarship for students pursuing Science, Technology, Engineering, or Mathematics',
    provider: 'Ministry of Education',
    type: 'scholarship',
    eligibility: {
      minKCSE: 'B+',
      fieldOfStudy: ['Science', 'Technology', 'Engineering', 'Mathematics'],
      averageGrade: 'A',
    },
    amount: 'KES 100,000 per year',
    coverage: ['tuition', 'books'],
    duration: '4 years',
    applicationDeadline: 'March 15',
    priority: 2,
  },
  
  // Constituency-Based
  {
    id: 'ngcdf-bursary',
    name: 'NG-CDF Bursary',
    description: 'Bursary from National Government Constituency Development Fund',
    provider: 'NG-CDF',
    type: 'bursary',
    eligibility: {
      minGrade: 1,
      maxGrade: 12,
      incomeLevel: ['low', 'medium'],
    },
    amount: 'KES 5,000 - 30,000',
    coverage: ['tuition'],
    duration: 'Annual',
    applicationDeadline: 'Varies by constituency',
    notes: 'Apply at your local constituency office',
    priority: 2,
  },
]

// County list for Kenya (All 47 Counties)
export const KENYAN_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Thika', 'Malindi',
  'Kitale', 'Garissa', 'Kakamega', 'Nyeri', 'Meru', 'Machakos', 'Kiambu',
  'Muranga', 'Kirinyaga', 'Nandi', 'Bungoma', 'Busia', 'Siaya', 'Homa Bay',
  'Migori', 'Kisii', 'Nyamira', 'Kericho', 'Bomet', 'Narok', 'Kajiado',
  'Makueni', 'Kitui', 'Embu', 'Isiolo', 'Marsabit', 'Mandera', 'Wajir',
  'Tana River', 'Lamu', 'Kilifi', 'Taita Taveta', 'Kwale',
  'Samburu', 'Turkana', 'West Pokot', 'Elgeyo Marakwet', 'Trans Nzoia',
  'Baringo', 'Laikipia', 'Nyandarua',
] as const

// Common fields of study
export const FIELDS_OF_STUDY = [
  'Medicine', 'Engineering', 'Law', 'Business', 'Education', 'Agriculture',
  'Science', 'Technology', 'Arts', 'Social Sciences', 'Nursing', 'Pharmacy',
  'Architecture', 'Journalism', 'Hospitality', 'Tourism',
] as const

