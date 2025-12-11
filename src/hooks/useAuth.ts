/**
 * Authentication Hook
 * Custom hook for authentication state and operations
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserWithOfflineFallback } from '@/lib/supabaseClient'
import { AuthService } from '@/services/auth.service'
import { toast } from 'sonner'
import { ROUTES } from '@/constants'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { user: currentUser, isOffline: offline } = await getUserWithOfflineFallback()
      setUser(currentUser)
      setIsOffline(offline || false)
      
      if (!currentUser) {
        router.push(ROUTES.LOGIN)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push(ROUTES.LOGIN)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const result = await AuthService.signIn({ email, password })
    
    if (result.success) {
      toast.success('Welcome back!', {
        description: 'Redirecting to your dashboard...',
      })
      router.push(ROUTES.DASHBOARD)
      return true
    } else {
      toast.error('Sign in failed', {
        description: result.error,
      })
      return false
    }
  }

  const signUp = async (email: string, password: string) => {
    const result = await AuthService.signUp({ email, password })
    
    if (result.success) {
      toast.success('Account created!', {
        description: 'Please check your email to verify your account.',
      })
      return true
    } else {
      toast.error('Sign up failed', {
        description: result.error,
      })
      return false
    }
  }

  const signOut = async () => {
    await AuthService.signOut()
    router.push(ROUTES.LOGIN)
  }

  const requestPasswordReset = async (email: string) => {
    const redirectUrl = `${window.location.origin}${ROUTES.RESET_PASSWORD}`
    const result = await AuthService.requestPasswordReset(email, redirectUrl)
    
    if (result.success) {
      toast.success('Password reset email sent!', {
        description: 'Please check your email for the reset link.',
      })
      return true
    } else {
      toast.error('Failed to send reset email', {
        description: result.error,
      })
      return false
    }
  }

  const resetPassword = async (password: string) => {
    const result = await AuthService.resetPassword(password)
    
    if (result.success) {
      toast.success('Password reset successful!', {
        description: 'Your password has been updated. Redirecting to login...',
      })
      setTimeout(() => router.push(ROUTES.LOGIN), 2000)
      return true
    } else {
      toast.error('Password reset failed', {
        description: result.error,
      })
      return false
    }
  }

  const signInWithGoogle = async () => {
    const redirectTo = `${window.location.origin}${ROUTES.AUTH_CALLBACK}`
    const result = await AuthService.signInWithOAuth('google', redirectTo)
    
    if (!result.success) {
      toast.error('Google sign-in failed', {
        description: result.error,
      })
    }
    
    return result.success
  }

  return {
    user,
    loading,
    isOffline,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    resetPassword,
    signInWithGoogle,
    checkUser,
  }
}




