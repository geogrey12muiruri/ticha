/**
 * Offline-first authentication utilities
 * Caches user session locally for offline access
 */

const OFFLINE_USER_KEY = 'jifunze_offline_user'
const OFFLINE_SESSION_KEY = 'jifunze_offline_session'
const OFFLINE_EXPIRY_KEY = 'jifunze_session_expiry'

export interface OfflineUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}

export interface OfflineSession {
  access_token: string
  refresh_token?: string
  expires_at?: number
}

/**
 * Check if we're online
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine
}

/**
 * Save user session to local storage for offline access
 */
export function saveOfflineSession(user: OfflineUser, session: OfflineSession): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(user))
    localStorage.setItem(OFFLINE_SESSION_KEY, JSON.stringify(session))
    
    // Set expiry (24 hours from now)
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000
    localStorage.setItem(OFFLINE_EXPIRY_KEY, expiresAt.toString())
  } catch (error) {
    console.error('Failed to save offline session:', error)
  }
}

/**
 * Get cached user session from local storage
 */
export function getOfflineSession(): { user: OfflineUser; session: OfflineSession } | null {
  if (typeof window === 'undefined') return null

  try {
    const userStr = localStorage.getItem(OFFLINE_USER_KEY)
    const sessionStr = localStorage.getItem(OFFLINE_SESSION_KEY)
    const expiryStr = localStorage.getItem(OFFLINE_EXPIRY_KEY)

    if (!userStr || !sessionStr) return null

    // Check if session expired
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10)
      if (Date.now() > expiry) {
        clearOfflineSession()
        return null
      }
    }

    return {
      user: JSON.parse(userStr),
      session: JSON.parse(sessionStr),
    }
  } catch (error) {
    console.error('Failed to get offline session:', error)
    return null
  }
}

/**
 * Clear offline session
 */
export function clearOfflineSession(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(OFFLINE_USER_KEY)
    localStorage.removeItem(OFFLINE_SESSION_KEY)
    localStorage.removeItem(OFFLINE_EXPIRY_KEY)
  } catch (error) {
    console.error('Failed to clear offline session:', error)
  }
}

/**
 * Check if user has valid offline session
 */
export function hasOfflineSession(): boolean {
  return getOfflineSession() !== null
}





