/**
 * Login Form Component
 * Extracted form logic for reusability
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AuthValidator } from '@/validators/auth.validator'
import Link from 'next/link'
import { ROUTES } from '@/constants'

interface LoginFormProps {
  initialMode?: 'signin' | 'signup'
}

export function LoginForm({ initialMode = 'signin' }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    try {
      // Validate input
      const validation = isSignUp
        ? AuthValidator.validateSignUp(email, password)
        : AuthValidator.validateSignIn(email, password)

      if (!validation.valid) {
        setErrorMessage(validation.error || 'Invalid input')
        return
      }

      const success = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (success && isSignUp) {
        // Reset form after successful signup
        setEmail('')
        setPassword('')
        setIsSignUp(false)
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {errorMessage && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
            {errorMessage}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrorMessage(null)
              }}
              className="pl-9 h-11"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrorMessage(null)
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
          {isSignUp && (
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d] text-white shadow-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignUp ? 'Creating account...' : 'Signing in...'}
            </>
          ) : (
            isSignUp ? 'Create Account' : 'Sign In'
          )}
        </Button>

        <div className="text-center space-y-2">
          {!isSignUp && (
            <Link href={ROUTES.FORGOT_PASSWORD}>
              <Button
                type="button"
                variant="link"
                className="text-sm text-muted-foreground hover:text-primary p-0 h-auto"
                disabled={isLoading}
              >
                Forgot your password?
              </Button>
            </Link>
          )}
          <Button
            type="button"
            variant="ghost"
            className="w-full text-sm"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setErrorMessage(null)
            }}
            disabled={isLoading}
          >
            {isSignUp ? (
              <>
                Already have an account? <span className="text-primary font-semibold ml-1">Sign in</span>
              </>
            ) : (
              <>
                Don't have an account? <span className="text-primary font-semibold ml-1">Sign up</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  )
}

