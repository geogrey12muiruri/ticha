/**
 * API Route: Generate Form with AI
 * POST /api/forms/generate
 */

import { NextRequest, NextResponse } from 'next/server'
import { FormGenerationService } from '@/services/form-generation.service'
import { RBACService } from '@/services/rbac.service'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Verify JWT token and get user ID
    // For now, we'll use a placeholder
    const userId = 'temp-user-id' // Replace with actual user extraction

    // Check if user is provider or admin
    const role = await RBACService.getUserRole(userId)
    if (!['provider', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Only providers and admins can generate forms' },
        { status: 403 }
      )
    }

    const { scholarshipDescription, requirements, eligibility } = await req.json()

    if (!scholarshipDescription || !requirements || !Array.isArray(requirements)) {
      return NextResponse.json(
        { error: 'scholarshipDescription and requirements are required' },
        { status: 400 }
      )
    }

    const formStructure = await FormGenerationService.generateForm(
      scholarshipDescription,
      requirements,
      eligibility
    )

    return NextResponse.json({ form: formStructure })
  } catch (error: any) {
    console.error('Error generating form:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate form' },
      { status: 500 }
    )
  }
}


