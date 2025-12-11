import { createClient } from '@supabase/supabase-js'
import { saveOfflineSession, getOfflineSession, clearOfflineSession } from './offlineAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Listen for auth state changes to cache session offline
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // Save session for offline access
      saveOfflineSession(
        {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
        },
        {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        }
      )
    } else if (event === 'SIGNED_OUT') {
      clearOfflineSession()
    }
  })
}

// Server-side client for API routes
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Get user with offline fallback
 */
export async function getUserWithOfflineFallback() {
  // Try to get user from Supabase first
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (user && !error) return { user, isOffline: false }
  } catch (error) {
    // Network error, try offline
  }

  // Fallback to offline session
  const offlineSession = getOfflineSession()
  if (offlineSession) {
    return {
      user: offlineSession.user,
      isOffline: true,
    }
  }

  return { user: null, isOffline: false }
}

