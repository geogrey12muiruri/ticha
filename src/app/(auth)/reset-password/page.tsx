'use client'

import { AuthLayout } from '@/components/shared/AuthLayout'
import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Your Password"
      description="Enter your new password below to complete the reset process."
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}

