/**
 * Application Constants
 * Centralized configuration and constants
 */

export const APP_CONFIG = {
  name: 'Jifunze AI',
  description: 'AI-powered learning companion for Kenyan students',
  version: '1.0.0',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/login', // Same page, different mode
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  CHAT: '/chat',
  SCHOLARSHIPS: '/scholarships',
  AUTH_CALLBACK: '/auth/callback',
} as const

export const AUTH_CONFIG = {
  SESSION_EXPIRY_HOURS: 24,
  PASSWORD_MIN_LENGTH: 6,
  RESET_TOKEN_EXPIRY_HOURS: 1,
} as const

export const AI_CONFIG = {
  DEFAULT_MODEL: 'llama-3.1-70b-versatile',
  DEFAULT_TEMPERATURE: 0.7,
  MAX_TOKENS: 1000,
  CACHE_SIZE: 100,
} as const

export const STORAGE_KEYS = {
  OFFLINE_USER: 'jifunze_offline_user',
  OFFLINE_SESSION: 'jifunze_offline_session',
  OFFLINE_EXPIRY: 'jifunze_session_expiry',
  AI_CACHE: 'ai_responses_cache',
} as const

export const DB_CONFIG = {
  NAME: 'jifunze_ai_db',
  VERSION: 1,
  STORES: {
    MESSAGES: 'messages',
    USER_PREFS: 'user_prefs',
    CACHE: 'cache',
  },
} as const

export const CURRICULUM_OPTIONS = {
  '8-4-4': {
    label: '8-4-4 System',
    description: 'Traditional Kenyan curriculum (Primary, Secondary)',
    badges: ['KCPE', 'KCSE'],
  },
  CBC: {
    label: 'CBC Curriculum',
    description: 'Competency-Based Curriculum (New System)',
    badges: ['Pre-Primary', 'Lower Primary', 'Upper Primary'],
  },
} as const

export const SUBJECTS = [
  'Mathematics',
  'English',
  'Kiswahili',
  'Science',
  'Social Studies',
  'History',
  'Geography',
  'General',
] as const

export const LANGUAGES = {
  EN: { code: 'en', label: 'English' },
  SW: { code: 'sw', label: 'Kiswahili' },
} as const

export const OPPORTUNITY_TYPES = {
  SCHOLARSHIP: 'scholarship',
  BURSARY: 'bursary',
  LOAN: 'loan',
  GRANT: 'grant',
  BOOTCAMP: 'bootcamp',
  LEARNING: 'learning',
  MENTORSHIP: 'mentorship',
  INTERNSHIP: 'internship',
} as const

export const OPPORTUNITY_CATEGORIES = [
  'Tech',
  'Business',
  'Education',
  'Healthcare',
  'Engineering',
  'Arts',
  'Agriculture',
  'General',
] as const

export const OPPORTUNITY_TYPE_LABELS = {
  scholarship: 'Scholarship',
  bursary: 'Bursary',
  loan: 'Loan',
  grant: 'Grant',
  bootcamp: 'Bootcamp',
  learning: 'Free Course',
  mentorship: 'Mentorship',
  internship: 'Internship',
} as const

export const FORMAT_OPTIONS = {
  ONLINE: 'online',
  IN_PERSON: 'in-person',
  HYBRID: 'hybrid',
  ANY: 'any',
} as const

export const SCHEDULE_OPTIONS = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  WEEKENDS: 'weekends',
  EVENINGS: 'evenings',
  FLEXIBLE: 'flexible',
} as const

export const EXPERIENCE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  ANY: 'any',
} as const

