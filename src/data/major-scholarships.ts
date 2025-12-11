/**
 * Major International Scholarships Data
 * Official application and information links for major scholarships
 * Always check the respective website in January of the application year
 */

import type { Scholarship } from '@/types/scholarship'

export interface ScholarshipSource {
  name: string
  description: string
  type: Scholarship['type']
  provider: string
  links: {
    label: string
    url: string
    description?: string
  }[]
  notes?: string
  eligibility?: {
    countries?: string[]
    minKCSE?: string
    minKCPE?: number
    fieldOfStudy?: string[]
  }
}

export const MAJOR_SCHOLARSHIPS: ScholarshipSource[] = [
  {
    name: 'Chevening Scholarship',
    description: 'UK government\'s global scholarship programme that offers future leaders the unique opportunity to study in the UK. Funded by the Foreign, Commonwealth & Development Office.',
    type: 'scholarship',
    provider: 'UK Government (FCDO)',
    links: [
      {
        label: 'Chevening Kenya Specific Page',
        url: 'https://www.chevening.org/scholarship/kenya/',
        description: 'Start here for eligibility and requirements for Kenyan nationals'
      },
      {
        label: 'General Chevening Apply Page',
        url: 'https://www.chevening.org/apply/',
        description: 'The portal where the online application is submitted during the application window'
      }
    ],
    eligibility: {
      countries: ['Kenya'],
      minKCSE: 'B+',
    }
  },
  {
    name: 'DAAD Scholarship',
    description: 'German Academic Exchange Service (DAAD) offers scholarships for study and research in Germany. Includes In-Country/In-Region scholarships and various German-funded programmes.',
    type: 'scholarship',
    provider: 'DAAD (German Academic Exchange Service)',
    links: [
      {
        label: 'DAAD Regional Office Nairobi / Kenya',
        url: 'https://www.daad-kenya.org/',
        description: 'Information on In-Country/In-Region scholarships and various German-funded programmes'
      },
      {
        label: 'DAAD Global Scholarship Database',
        url: 'https://www.daad.de/stipdb-redirect/',
        description: 'Use this tool to find specific DAAD programs tailored to your field and academic status'
      }
    ],
    eligibility: {
      countries: ['Kenya'],
    }
  },
  {
    name: 'Fulbright Foreign Student Program',
    description: 'The Fulbright Program is the flagship international educational exchange program sponsored by the U.S. government. Provides funding for graduate study, research, and teaching in the United States.',
    type: 'scholarship',
    provider: 'U.S. Department of State',
    links: [
      {
        label: 'U.S. Embassy in Kenya Program Information',
        url: 'https://ke.usembassy.gov/fulbright-foreign-students-program-2026-2027/',
        description: 'This page provides the most direct link to the application management system for Kenyan applicants'
      },
      {
        label: 'Fulbright Foreign Student Program General Apply Page',
        url: 'https://foreign.fulbrightonline.org/apply',
        description: 'Official international portal'
      }
    ],
    eligibility: {
      countries: ['Kenya'],
    }
  },
  {
    name: 'MEXT Scholarship',
    description: 'Japanese Government (Monbukagakusho) Scholarship for research students, undergraduate students, and college of technology students. Fully funded scholarship to study in Japan.',
    type: 'scholarship',
    provider: 'Japanese Government (MEXT)',
    links: [
      {
        label: 'Embassy of Japan in Kenya - Research Students',
        url: 'https://www.ke.emb-japan.go.jp/itpr_en/Postgraduate.html',
        description: 'The official page for postgraduate (Master\'s/PhD) MEXT scholarships for Kenyans, including application timelines'
      },
      {
        label: 'Embassy of Japan in Kenya - College of Technology',
        url: 'https://www.ke.emb-japan.go.jp/itpr_en/College_of_Technology.html',
        description: 'Information for undergraduate/technical college level applications'
      }
    ],
    notes: 'This program requires you to obtain and submit physical application forms from the local Aga Khan Foundation, Aga Khan Education Services, or Aga Khan Education Board office in your current country of residence (like Kenya). The application process is not purely online.',
    eligibility: {
      countries: ['Kenya'],
    }
  },
  {
    name: 'Aga Khan Foundation International Scholarship Programme (AKF ISP)',
    description: 'The Aga Khan Foundation provides a limited number of scholarships each year for postgraduate studies to outstanding students from select developing countries who have no other means of financing their studies.',
    type: 'scholarship',
    provider: 'Aga Khan Foundation',
    links: [
      {
        label: 'AKF ISP Application Procedure Overview',
        url: 'https://www.postgraduatestudentships.co.uk/opportunity/aga-khan-foundation-international-scholarships/19521',
        description: 'Explains the decentralized application process, which requires contacting the local Aga Khan Foundation/Education Services office in your country of residence to obtain application forms'
      },
      {
        label: 'General AKF ISP Program Information',
        url: 'https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme',
        description: 'Provides details on eligibility, award conditions, and focus areas'
      }
    ],
    notes: 'This program requires you to obtain and submit physical application forms from the local Aga Khan Foundation, Aga Khan Education Services, or Aga Khan Education Board office in your current country of residence (like Kenya). The application process is not purely online.',
    eligibility: {
      countries: ['Kenya'],
    }
  }
]

export interface MOOCPlatform {
  name: string
  description: string
  type: 'learning' | 'bootcamp'
  provider: string
  url: string
  focusAreas: string[]
  notes: string
  cost: 'free' | 'free-audit' | 'paid-certificate'
}

export const MOOC_PLATFORMS: MOOCPlatform[] = [
  {
    name: 'edX',
    description: 'Non-profit MOOC provider founded by Harvard and MIT. Offers courses from hundreds of top universities globally.',
    type: 'learning',
    provider: 'edX (Harvard & MIT)',
    url: 'https://www.edx.org/courses?q=free+online+courses',
    focusAreas: ['Tech', 'Business', 'Data Science'],
    notes: 'Free to audit most courses; pay for official certificates',
    cost: 'free-audit'
  },
  {
    name: 'Coursera',
    description: 'Offers courses, specializations, and degrees from universities and companies (Google, Meta).',
    type: 'learning',
    provider: 'Coursera',
    url: 'https://www.coursera.org/courses?query=free',
    focusAreas: ['Professional Certificates', 'IT', 'Health'],
    notes: 'Courses are free to audit',
    cost: 'free-audit'
  },
  {
    name: 'atingi',
    description: 'A digital learning platform designed with GIZ/German Development Cooperation partners specifically for learners in emerging markets, including Africa.',
    type: 'learning',
    provider: 'GIZ/German Development Cooperation',
    url: 'https://www.atingi.org/',
    focusAreas: ['Digital and Professional Skills', 'Entrepreneurship', 'Vocational Training'],
    notes: '100% Free courses and certificates (often)',
    cost: 'free'
  },
  {
    name: 'Khan Academy',
    description: 'Non-profit focusing on foundational academic skills for K-12 and early university levels. Completely free content and personalized learning.',
    type: 'learning',
    provider: 'Khan Academy',
    url: 'https://www.khanacademy.org/',
    focusAreas: ['Maths', 'Science', 'Economics', 'Humanities'],
    notes: 'Completely free content and personalized learning',
    cost: 'free'
  },
  {
    name: 'FutureLearn',
    description: 'Offers courses from UK universities and international partners, often focusing on social sciences and humanities.',
    type: 'learning',
    provider: 'FutureLearn',
    url: 'https://www.futurelearn.com/courses',
    focusAreas: ['Health', 'Psychology', 'Arts & Culture'],
    notes: 'Free to audit for a limited time; pay for certificates',
    cost: 'free-audit'
  },
  {
    name: 'Alison',
    description: 'Irish-based platform offering free, certified workplace and skills training.',
    type: 'learning',
    provider: 'Alison',
    url: 'https://alison.com/',
    focusAreas: ['IT', 'Health', 'Management', 'Language'],
    notes: 'Free enrollment and course completion; pay for paper certificates',
    cost: 'free'
  },
  {
    name: 'FAO elearning Academy',
    description: 'Resources from the UN Food and Agriculture Organization. Offers free, certified multilingual courses.',
    type: 'learning',
    provider: 'UN Food and Agriculture Organization',
    url: 'https://elearning.fao.org/',
    focusAreas: ['Agriculture', 'Food Security', 'Climate Change', 'Nutrition'],
    notes: 'Offers free, certified multilingual courses',
    cost: 'free'
  },
  {
    name: 'YALI Network',
    description: 'Young African Leaders Initiative (YALI) online training. Free courses and certificates specifically for young African leaders.',
    type: 'learning',
    provider: 'U.S. Department of State',
    url: 'https://yali.state.gov/yali-courses',
    focusAreas: ['Leadership', 'Business & Entrepreneurship', 'Civic Leadership', 'Public Management'],
    notes: 'Free courses and certificates specifically for young African leaders',
    cost: 'free'
  }
]

/**
 * Convert scholarship sources to Scholarship objects for database
 */
export function convertScholarshipSourceToScholarship(source: ScholarshipSource): Partial<Scholarship> {
  return {
    name: source.name,
    description: source.description,
    provider: source.provider,
    type: source.type,
    eligibility: source.eligibility || {},
    applicationLink: source.links[0]?.url,
    contactInfo: {
      source: source.provider,
      website: source.links[0]?.url,
    },
    notes: source.notes,
    requirements: source.links.map(link => `${link.label}: ${link.url}`),
  }
}

/**
 * Convert MOOC platform to Scholarship object
 */
export function convertMOOCToScholarship(platform: MOOCPlatform): Partial<Scholarship> {
  return {
    name: platform.name,
    description: platform.description,
    provider: platform.provider,
    type: platform.type,
    applicationLink: platform.url,
    learningDetails: {
      cost: platform.cost === 'free' ? 'free' : platform.cost === 'free-audit' ? 'free' : 'paid',
      certification: true,
      format: 'online',
    },
    contactInfo: {
      source: platform.provider,
      website: platform.url,
    },
    notes: platform.notes,
    requirements: [`Focus Areas: ${platform.focusAreas.join(', ')}`],
  }
}

