export type Curriculum = '8-4-4' | 'CBC'
export type Language = 'sw' | 'en'
export type Subject = 
  | 'Mathematics'
  | 'English'
  | 'Kiswahili'
  | 'Science'
  | 'Social Studies'
  | 'History'
  | 'Geography'
  | 'General'

export interface User {
  id: string
  email: string
  name?: string
  curriculum?: Curriculum
  grade?: number
  preferredLanguage?: Language
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  subject?: Subject
  timestamp: Date
  userId: string
}

export interface ChatContext {
  curriculum?: Curriculum
  subject?: Subject
  language?: Language
  grade?: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  subject: Subject
  grade: number
}

