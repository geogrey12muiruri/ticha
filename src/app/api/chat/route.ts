import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/services/ai.service'

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const response = await AIService.generateResponse({ message, context })

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error('Error generating tutor response:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    )
  }
}

