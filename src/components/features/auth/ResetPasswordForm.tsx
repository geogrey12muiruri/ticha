/**
 * Reset Password Form Component
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AuthValidator } from '@/validators/auth.validator'
import { supabase } from '@/lib/supabaseClient'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/constants'

export function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  
  const { resetPassword } = useAuth()

  useEffect(() => {
    // Handle reset token from URL
    const handleResetToken = async () => {
      try {
        const hash = window.location.hash
        const code = searchParams.get('code')
        
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            setError('Invalid or expired reset link. Please request a new password reset.')
            return
          }
        } else if (hash) {
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get('access_token')
          const type = params.get('type')
          
          if (type === 'recovery' && accessToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: params.get('refresh_token') || '',
            })
            
            if (sessionError) {
              setError('Invalid or expired reset link. Please request a new password reset.')
              return
            }
          } else {
            setError('Invalid reset link. Please request a new password reset.')
            return
          }
        } else {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) {
            setError('Invalid or expired reset link. Please request a new password reset.')
            return
          }
        }
      } catch (err) {
        console.error('Reset token handling error:', err)
        setError('An error occurred. Please try again.')
      }
    }

    handleResetToken()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validation = AuthValidator.validatePasswordReset(password, confirmPassword)
    if (!validation.valid) {
      setError(validation.error || 'Invalid password')
      return
    }

    setIsLoading(true)
    await resetPassword(password)
    setIsLoading(false)
  }

  if (error && !password) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
        <div className="space-y-2">
          <Link href={ROUTES.FORGOT_PASSWORD}>
            <Button className="w-full h-11 bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d] text-white shadow-lg">
              Request New Reset Link
            </Button>
          </Link>
          <Link href={ROUTES.LOGIN}>
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
            {error}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(null)
            }}
            className="pl-9 pr-9 h-11"
            required
            disabled={isLoading}
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Must be at least 6 characters
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setError(null)
            }}
            className="pl-9 pr-9 h-11"
            required
            disabled={isLoading}
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d] text-white shadow-lg transition-all"
        disabled={isLoading || !password || !confirmPassword}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting Password...
          </>
        ) : (
          'Reset Password'
        )}
      </Button>

      <Link href={ROUTES.LOGIN}>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </Link>
    </form>
  )
}

