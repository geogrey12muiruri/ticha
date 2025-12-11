/**
 * Role-Based Access Control Service
 * Manages user roles and permissions
 */

import { supabase } from '@/lib/supabaseClient'

export type UserRole = 'student' | 'provider' | 'verifier' | 'admin'

export interface UserProfile {
  id: string
  role: UserRole
  organization_name?: string
  organization_type?: string
  verified: boolean
  created_at: string
  updated_at: string
}

export class RBACService {
  /**
   * Get user role
   */
  static async getUserRole(userId: string): Promise<UserRole> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle() // Use maybeSingle() instead of single() to handle 0 rows gracefully

      // Handle PGRST116 error (0 rows) or other errors
      if (error) {
        // PGRST116 = "Cannot coerce the result to a single JSON object" (0 rows)
        if (error.code === 'PGRST116' || error.message?.includes('0 rows') || error.message?.includes('JSON object')) {
          // Profile doesn't exist - try to create it
          console.log('User profile not found, creating default profile...')
          const created = await this.createUserProfile(userId, 'student')
          if (created) {
            return 'student'
          }
        }
        // Default to student if error or no profile exists
        return 'student'
      }

      if (!data) {
        // No data returned - try to create profile
        const created = await this.createUserProfile(userId, 'student')
        return 'student'
      }

      return data.role as UserRole
    } catch (error) {
      console.error('Error getting user role:', error)
      return 'student' // Default
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Use maybeSingle() instead of single() to handle 0 rows gracefully

      // Handle PGRST116 error (0 rows) or other errors
      if (error) {
        // PGRST116 = "Cannot coerce the result to a single JSON object" (0 rows)
        if (error.code === 'PGRST116' || error.message?.includes('0 rows') || error.message?.includes('JSON object')) {
          // Profile doesn't exist - try to create it
          console.log('User profile not found, creating default profile...')
          const created = await this.createUserProfile(userId, 'student')
          if (created) {
            // Retry fetching the newly created profile
            const { data: newData } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle()
            return newData as UserProfile | null
          }
        }
        return null
      }

      if (!data) {
        // No data returned - try to create profile
        const created = await this.createUserProfile(userId, 'student')
        if (created) {
          // Retry fetching the newly created profile
          const { data: newData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle()
          return newData as UserProfile | null
        }
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  /**
   * Create user profile (default: student)
   */
  static async createUserProfile(
    userId: string,
    role: UserRole = 'student'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          role,
          verified: role === 'student', // Students auto-verified
        })

      if (error) {
        console.error('Error creating user profile:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error creating user profile:', error)
      return false
    }
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(
    userId: string,
    newRole: UserRole,
    adminId: string
  ): Promise<boolean> {
    // Verify admin
    const adminRole = await this.getUserRole(adminId)
    if (adminRole !== 'admin') {
      throw new Error('Only admins can update roles')
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user role:', error)
        return false
      }

      // Log audit
      await this.logAudit({
        user_id: adminId,
        action: 'update_role',
        resource_type: 'user',
        resource_id: userId,
        details: { new_role: newRole },
      })

      return true
    } catch (error) {
      console.error('Error updating user role:', error)
      return false
    }
  }

  /**
   * Request provider role
   */
  static async requestProviderRole(
    userId: string,
    organizationData: {
      name: string
      type: string
      website?: string
      email: string
      phone?: string
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          role: 'provider',
          organization_name: organizationData.name,
          organization_type: organizationData.type,
          verified: false, // Requires verification
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Error requesting provider role:', error)
        return false
      }

      // TODO: Notify admins/verifiers for approval

      return true
    } catch (error) {
      console.error('Error requesting provider role:', error)
      return false
    }
  }

  /**
   * Verify provider (verifier/admin only)
   */
  static async verifyProvider(
    providerId: string,
    verifierId: string
  ): Promise<boolean> {
    const verifierRole = await this.getUserRole(verifierId)
    if (!['verifier', 'admin'].includes(verifierRole)) {
      throw new Error('Only verifiers/admins can verify providers')
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', providerId)

      if (error) {
        console.error('Error verifying provider:', error)
        return false
      }

      // Log audit
      await this.logAudit({
        user_id: verifierId,
        action: 'verify_provider',
        resource_type: 'user',
        resource_id: providerId,
      })

      return true
    } catch (error) {
      console.error('Error verifying provider:', error)
      return false
    }
  }

  /**
   * Check if user has permission
   */
  static async hasPermission(
    userId: string,
    permission: string
  ): Promise<boolean> {
    const role = await this.getUserRole(userId)
    return this.roleHasPermission(role, permission)
  }

  /**
   * Check if role has permission
   */
  private static roleHasPermission(role: UserRole, permission: string): boolean {
    const permissions: Record<UserRole, string[]> = {
      student: [
        'view_scholarships',
        'create_profile',
        'get_matches',
        'view_templates',
        'track_applications',
      ],
      provider: [
        'view_scholarships',
        'create_scholarship',
        'edit_own_scholarship',
        'upload_forms',
        'view_own_applications',
        'view_own_analytics',
      ],
      verifier: [
        'view_scholarships',
        'verify_scholarship',
        'approve_scholarship',
        'reject_scholarship',
        'flag_suspicious',
      ],
      admin: [
        'all', // Admins have all permissions
      ],
    }

    const rolePerms = permissions[role] || []
    return rolePerms.includes('all') || rolePerms.includes(permission)
  }

  /**
   * Check if user can perform action on resource
   */
  static async can(
    userId: string,
    action: string,
    resourceType: string,
    resourceId?: string
  ): Promise<boolean> {
    const role = await this.getUserRole(userId)

    // Admin can do everything
    if (role === 'admin') {
      return true
    }

    // Check ownership for edit/delete actions
    if (['edit', 'delete', 'update'].includes(action) && resourceId) {
      const isOwner = await this.isResourceOwner(userId, resourceType, resourceId)
      if (isOwner) {
        return true
      }
    }

    // Check role permissions
    return this.roleHasPermission(role, `${action}_${resourceType}`)
  }

  /**
   * Check if user owns resource
   */
  private static async isResourceOwner(
    userId: string,
    resourceType: string,
    resourceId: string
  ): Promise<boolean> {
    try {
      if (resourceType === 'scholarship') {
        const { data, error } = await supabase
          .from('scholarships')
          .select('provider_id')
          .eq('id', resourceId)
          .maybeSingle() // Use maybeSingle() to handle 0 rows gracefully

        if (error || !data) {
          return false
        }

        return data.provider_id === userId
      }

      // Add other resource types as needed
      return false
    } catch (error) {
      console.error('Error checking resource ownership:', error)
      return false
    }
  }

  /**
   * Log audit event
   */
  private static async logAudit(data: {
    user_id: string
    action: string
    resource_type?: string
    resource_id?: string
    details?: any
  }): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        ...data,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error logging audit:', error)
      // Don't throw - audit logging failure shouldn't break the app
    }
  }

  /**
   * Get pending provider requests
   */
  static async getPendingProviders(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'provider')
        .eq('verified', false)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting pending providers:', error)
        return []
      }

      return data as UserProfile[]
    } catch (error) {
      console.error('Error getting pending providers:', error)
      return []
    }
  }
}


