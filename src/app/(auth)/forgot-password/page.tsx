'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuthLayout } from '@/components/shared/AuthLayout'
import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password?"
      description="Enter your email address and we'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}

