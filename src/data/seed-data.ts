/**
 * Seed Data for Testing
 * Comprehensive test data covering all opportunity types
 */

import type { Scholarship } from '@/types/scholarship'

export interface SeedScholarship {
  name: string
  description: string
  provider: string
  type: Scholarship['type']
  category?: string
  eligibility: {
    counties?: string[]
    constituencies?: string[]
    minGrade?: number
    maxGrade?: number
    curriculum?: ('8-4-4' | 'CBC')[]
    subjects?: string[]
    fieldOfStudy?: string[]
    minKCSE?: string
    minKCPE?: number
  }
  amount?: string
  coverage?: string[]
  duration?: string
  bootcampDetails?: any
  learningDetails?: any
  applicationDeadline?: string
  applicationLink?: string
  contactInfo?: {
    email?: string
    phone?: string
    website?: string
    address?: string
  }
  requirements?: string[]
  documents?: string[]
  notes?: string
  priority?: number
}

export const SEED_SCHOLARSHIPS: SeedScholarship[] = [
  // ===== SCHOLARSHIPS =====
  {
    name: 'Nairobi County Full Scholarship',
    description: 'Full scholarship covering tuition, accommodation, and books for top-performing students in Nairobi County',
    provider: 'Nairobi County Government',
    type: 'scholarship',
    category: 'Education',
    eligibility: {
      counties: ['Nairobi'],
      minGrade: 9,
      maxGrade: 12,
      curriculum: ['8-4-4', 'CBC'],
      minKCSE: 'B+',
    },
    amount: 'KES 150,000 per year',
    coverage: ['tuition', 'books', 'accommodation', 'meals'],
    duration: '4 years (renewable annually)',
    applicationDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    applicationLink: 'https://www.nairobi.go.ke/scholarships',
    contactInfo: {
      email: 'scholarships@nairobi.go.ke',
      phone: '+254 20 222 2181',
      website: 'https://www.nairobi.go.ke',
    },
    requirements: [
      'Must be a resident of Nairobi County',
      'KCSE grade B+ or higher',
      'Proof of admission to a recognized institution',
      'Letter of recommendation from school principal',
    ],
    documents: [
      'Application form',
      'KCSE certificate',
      'Birth certificate',
      'Proof of residence',
      'School admission letter',
      'Parent/Guardian ID',
      'Passport photo',
    ],
    priority: 10,
  },
  {
    name: 'Kiambu County STEM Scholarship',
    description: 'Scholarship for students pursuing Science, Technology, Engineering, and Mathematics courses',
    provider: 'Kiambu County Government',
    type: 'scholarship',
    category: 'STEM',
    eligibility: {
      counties: ['Kiambu'],
      minGrade: 9,
      maxGrade: 12,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      minKCSE: 'B',
    },
    amount: 'KES 120,000 per year',
    coverage: ['tuition', 'books'],
    duration: '4 years',
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: {
      email: 'education@kiambu.go.ke',
      website: 'https://www.kiambu.go.ke',
    },
    requirements: [
      'Resident of Kiambu County',
      'KCSE grade B or higher',
      'Pursuing STEM course',
    ],
    documents: ['Application form', 'KCSE certificate', 'Proof of residence'],
    priority: 9,
  },
  {
    name: 'Mombasa County Arts & Culture Scholarship',
    description: 'Supporting students in creative arts, music, and cultural studies',
    provider: 'Mombasa County Government',
    type: 'scholarship',
    category: 'Arts',
    eligibility: {
      counties: ['Mombasa'],
      minGrade: 9,
      maxGrade: 12,
    },
    amount: 'KES 80,000 per year',
    coverage: ['tuition', 'books'],
    duration: '3-4 years',
    applicationDeadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: {
      website: 'https://www.mombasa.go.ke',
    },
    priority: 8,
  },

  // ===== BURSARIES =====
  {
    name: 'Nairobi County Bursary Fund',
    description: 'Financial support for needy students in Nairobi County',
    provider: 'Nairobi County Government',
    type: 'bursary',
    category: 'Financial Aid',
    eligibility: {
      counties: ['Nairobi'],
      minGrade: 1,
      maxGrade: 12,
    },
    amount: 'KES 10,000 - 50,000 per year',
    coverage: ['tuition', 'books'],
    duration: 'Annual (renewable)',
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
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
    priority: 7,
  },
  {
    name: 'Kiambu County Bursary Program',
    description: 'Annual bursary for students from low-income families in Kiambu County',
    provider: 'Kiambu County Government',
    type: 'bursary',
    eligibility: {
      counties: ['Kiambu'],
      minGrade: 1,
      maxGrade: 12,
    },
    amount: 'KES 15,000 - 40,000 per year',
    coverage: ['tuition'],
    duration: 'Annual',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 6,
  },

  // ===== BOOTCAMPS =====
  {
    name: 'ALX Software Engineering Bootcamp',
    description: '12-month intensive software engineering bootcamp with job placement support',
    provider: 'ALX Africa',
    type: 'bootcamp',
    category: 'Tech',
    eligibility: {
      minGrade: 12,
      fieldOfStudy: ['Computer Science', 'Software Engineering', 'IT'],
    },
    bootcampDetails: {
      duration: '12 months',
      format: 'online',
      schedule: 'full-time',
      cost: 'Free (sponsored)',
      certification: true,
      jobPlacement: true,
      technologies: ['Python', 'JavaScript', 'React', 'Node.js', 'Databases'],
    },
    applicationLink: 'https://www.alxafrica.com/software-engineering',
    contactInfo: {
      website: 'https://www.alxafrica.com',
      email: 'info@alxafrica.com',
    },
    requirements: [
      'High school completion',
      'Basic computer skills',
      'Commitment to full-time program',
    ],
    priority: 10,
  },
  {
    name: 'Moringa School Web Development Bootcamp',
    description: 'Intensive 5-month web development bootcamp with industry mentorship',
    provider: 'Moringa School',
    type: 'bootcamp',
    category: 'Tech',
    eligibility: {},
    bootcampDetails: {
      duration: '5 months',
      format: 'hybrid',
      schedule: 'full-time',
      cost: 'KES 150,000 (scholarships available)',
      certification: true,
      jobPlacement: true,
      technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Ruby on Rails'],
    },
    applicationLink: 'https://moringaschool.com',
    contactInfo: {
      website: 'https://moringaschool.com',
      email: 'admissions@moringaschool.com',
    },
    priority: 9,
  },
  {
    name: 'Andela Technical Leadership Program',
    description: 'Remote software engineering program with mentorship and career support',
    provider: 'Andela',
    type: 'bootcamp',
    category: 'Tech',
    eligibility: {},
    bootcampDetails: {
      duration: '6 months',
      format: 'online',
      schedule: 'full-time',
      cost: 'Free (with income share agreement)',
      certification: true,
      jobPlacement: true,
    },
    applicationLink: 'https://andela.com/engineers',
    priority: 8,
  },

  // ===== LEARNING OPPORTUNITIES =====
  {
    name: 'Coursera Professional Certificates',
    description: 'Free access to professional certificates from Google, Meta, IBM, and more',
    provider: 'Coursera',
    type: 'learning',
    category: 'Professional Development',
    eligibility: {},
    learningDetails: {
      format: 'online',
      cost: 'free-audit',
      certification: true,
      selfPaced: true,
      courses: ['Google IT Support', 'Meta Social Media Marketing', 'IBM Data Science'],
    },
    applicationLink: 'https://www.coursera.org/courses?query=free',
    contactInfo: {
      website: 'https://www.coursera.org',
    },
    notes: 'Free to audit courses; pay for certificates if desired',
    priority: 9,
  },
  {
    name: 'edX Free Online Courses',
    description: 'Free courses from Harvard, MIT, and other top universities',
    provider: 'edX',
    type: 'learning',
    category: 'Academic',
    eligibility: {},
    learningDetails: {
      format: 'online',
      cost: 'free-audit',
      certification: true,
      selfPaced: true,
    },
    applicationLink: 'https://www.edx.org/courses',
    contactInfo: {
      website: 'https://www.edx.org',
    },
    priority: 8,
  },
  {
    name: 'Khan Academy - Free Learning',
    description: 'Completely free educational content for all levels',
    provider: 'Khan Academy',
    type: 'learning',
    category: 'Academic',
    eligibility: {},
    learningDetails: {
      format: 'online',
      cost: 'free',
      certification: false,
      selfPaced: true,
    },
    applicationLink: 'https://www.khanacademy.org',
    contactInfo: {
      website: 'https://www.khanacademy.org',
    },
    priority: 7,
  },
  {
    name: 'YALI Network Online Courses',
    description: 'Free leadership and entrepreneurship courses for young African leaders',
    provider: 'U.S. Department of State',
    type: 'learning',
    category: 'Leadership',
    eligibility: {
      minGrade: 12,
    },
    learningDetails: {
      format: 'online',
      cost: 'free',
      certification: true,
      selfPaced: true,
    },
    applicationLink: 'https://yali.state.gov/yali-courses',
    contactInfo: {
      website: 'https://yali.state.gov',
    },
    priority: 8,
  },

  // ===== MENTORSHIPS =====
  {
    name: 'Tech Mentorship Program - Nairobi',
    description: 'One-on-one mentorship with experienced software engineers in Nairobi',
    provider: 'Tech Community Nairobi',
    type: 'mentorship',
    category: 'Tech',
    eligibility: {
      counties: ['Nairobi'],
      minGrade: 10,
      fieldOfStudy: ['Computer Science', 'Software Engineering'],
    },
    duration: '6 months',
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: {
      email: 'mentorship@technairobi.org',
      website: 'https://technairobi.org',
    },
    requirements: [
      'Interest in software development',
      'Basic programming knowledge',
      'Commitment to regular meetings',
    ],
    notes: 'Mentors are volunteers from local tech companies',
    priority: 7,
  },
  {
    name: 'Women in STEM Mentorship',
    description: 'Mentorship program connecting female students with women in STEM careers',
    provider: 'Women in Tech Kenya',
    type: 'mentorship',
    category: 'STEM',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      fieldOfStudy: ['Science', 'Technology', 'Engineering', 'Mathematics'],
    },
    duration: '1 year',
    applicationLink: 'https://womenintechkenya.org/mentorship',
    contactInfo: {
      email: 'mentorship@womenintechkenya.org',
      website: 'https://womenintechkenya.org',
    },
    priority: 8,
  },

  // ===== INTERNSHIPS =====
  {
    name: 'Safaricom Digital Talent Programme',
    description: 'Paid internship program for recent graduates in technology and business',
    provider: 'Safaricom',
    type: 'internship',
    category: 'Tech',
    eligibility: {
      minGrade: 12,
      fieldOfStudy: ['Computer Science', 'IT', 'Business', 'Engineering'],
    },
    amount: 'KES 50,000 - 80,000 per month',
    duration: '6-12 months',
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    applicationLink: 'https://www.safaricom.co.ke/careers',
    contactInfo: {
      website: 'https://www.safaricom.co.ke',
      email: 'careers@safaricom.co.ke',
    },
    requirements: [
      'Recent graduate (within 2 years)',
      'Relevant degree',
      'Strong academic performance',
    ],
    documents: ['CV', 'Cover letter', 'Academic transcripts', 'ID copy'],
    priority: 10,
  },
  {
    name: 'Equity Bank Internship Program',
    description: 'Internship opportunities in banking, technology, and business operations',
    provider: 'Equity Bank',
    type: 'internship',
    category: 'Business',
    eligibility: {
      minGrade: 12,
    },
    amount: 'KES 30,000 - 50,000 per month',
    duration: '3-6 months',
    applicationLink: 'https://www.equitybankgroup.com/careers',
    contactInfo: {
      website: 'https://www.equitybankgroup.com',
    },
    priority: 9,
  },
  {
    name: 'Microsoft Kenya Internship',
    description: 'Software engineering internship with Microsoft Kenya',
    provider: 'Microsoft',
    type: 'internship',
    category: 'Tech',
    eligibility: {
      minGrade: 12,
      fieldOfStudy: ['Computer Science', 'Software Engineering'],
    },
    amount: 'Competitive stipend',
    duration: '3 months',
    applicationLink: 'https://careers.microsoft.com',
    contactInfo: {
      website: 'https://www.microsoft.com/ke',
    },
    requirements: [
      'Strong programming skills',
      'Portfolio of projects',
      'Good communication skills',
    ],
    priority: 10,
  },

  // ===== GRANTS =====
  {
    name: 'Innovation Grant for Students',
    description: 'Grant funding for student innovation projects and startups',
    provider: 'Kenya Innovation Agency',
    type: 'grant',
    category: 'Innovation',
    eligibility: {
      minGrade: 10,
    },
    amount: 'KES 100,000 - 500,000',
    duration: 'One-time',
    applicationDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    requirements: [
      'Innovative project idea',
      'Business plan',
      'Team of 2-5 members',
    ],
    documents: ['Project proposal', 'Business plan', 'Team CVs'],
    priority: 8,
  },
]

/**
 * Convert seed data to database format
 */
export function convertSeedToDatabase(seed: SeedScholarship): any {
  return {
    name: seed.name,
    description: seed.description,
    provider: seed.provider,
    type: seed.type,
    category: seed.category || null,
    eligibility: seed.eligibility || {},
    amount: seed.amount || null,
    coverage: seed.coverage || [],
    duration: seed.duration || null,
    bootcamp_details: seed.bootcampDetails || null,
    learning_details: seed.learningDetails || null,
    application_deadline: seed.applicationDeadline || null,
    application_link: seed.applicationLink || null,
    contact_info: seed.contactInfo || {},
    requirements: seed.requirements || [],
    documents: seed.documents || [],
    notes: seed.notes || null,
    priority: seed.priority || 0,
    verified: true, // Seed data is pre-verified
    status: 'active',
    published_at: new Date().toISOString(),
  }
}

