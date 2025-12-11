'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AuthLayout } from '@/components/shared/AuthLayout'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { useAuth } from '@/hooks/useAuth'
import { Chrome, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const { signInWithGoogle } = useAuth()

  useEffect(() => {
    // Check for OAuth error from callback
    const error = searchParams.get('error')
    if (error) {
      setErrorMessage('Authentication failed. Please try again.')
      toast.error('Authentication failed', {
        description: 'Please try signing in again.',
      })
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signInWithGoogle()
    setIsLoading(false)
  }

  return (
    <AuthLayout
      title="Welcome Back!"
      description="Sign in to continue your learning journey"
    >
      <div className="space-y-5">
        {errorMessage && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
              {errorMessage}
            </div>
          </div>
        )}
        
        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>
        <p className="text-xs text-center text-muted-foreground -mt-3 flex items-center justify-center gap-1">
          <span className="h-1 w-1 rounded-full bg-orange-500"></span>
          Requires internet connection
        </p>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        <LoginForm />

        {/* Footer */}
        <div className="pt-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

