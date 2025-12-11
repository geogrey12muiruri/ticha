'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

/**
 * Redirect route for Supabase password reset links
 * Supabase sends links to /auth/reset-password, but our page is at /reset-password
 * This page redirects to the correct route while preserving the hash fragment
 */
export default function AuthResetPasswordRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the hash fragment from the URL (Supabase puts tokens in the hash)
    const hash = window.location.hash
    
    // Also check for query params (some email clients strip the hash)
    const code = searchParams.get('code')
    
    // Use window.location to preserve hash fragments (Next.js router doesn't preserve hash)
    if (code && !hash) {
      // If we have code but no hash, use router
      router.replace(`/reset-password?code=${code}`)
    } else if (hash) {
      // If we have hash, use window.location to preserve it
      window.location.href = `/reset-password${hash}`
    } else {
      // Fallback: redirect without hash
      router.replace('/reset-password')
    }
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting to reset password...</p>
      </div>
    </div>
  )
}

