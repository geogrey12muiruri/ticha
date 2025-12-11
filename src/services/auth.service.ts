/**
 * Authentication Service
 * Business logic for authentication operations
 */

import { supabase } from '@/lib/supabaseClient'
import { saveOfflineSession, clearOfflineSession } from '@/lib/offlineAuth'
import type { OfflineUser, OfflineSession } from '@/lib/offlineAuth'

export interface SignUpParams {
  email: string
  password: string
}

export interface SignInParams {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  error?: string
  user?: any
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp({ email, password }: SignUpParams): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create account' }
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn({ email, password }: SignInParams): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Save session for offline access
      if (data.user && data.session) {
        saveOfflineSession(
          {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name,
            avatar_url: data.user.user_metadata?.avatar_url,
            created_at: data.user.created_at,
          },
          {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
          }
        )
      }

      return { success: true, user: data.user }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to sign in' }
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      clearOfflineSession()
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string, redirectUrl: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send reset email' }
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(password: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to reset password' }
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error: any) {
      return { user: null, error }
    }
  }

  /**
   * Sign in with OAuth provider
   */
  static async signInWithOAuth(provider: 'google', redirectTo: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'OAuth sign-in failed' }
    }
  }
}




