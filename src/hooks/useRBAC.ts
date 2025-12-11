/**
 * RBAC Hook
 * Custom hook for role-based access control
 */

import { useState, useEffect } from 'react'
import { RBACService, type UserRole } from '@/services/rbac.service'
import { useAuth } from './useAuth'

export function useRBAC() {
  const { user } = useAuth()
  const [role, setRole] = useState<UserRole>('student')
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      loadRole()
    } else {
      setRole('student')
      setLoading(false)
    }
  }, [user])

  const loadRole = async () => {
    if (!user?.id) return

    try {
      const userRole = await RBACService.getUserRole(user.id)
      setRole(userRole)
      setPermissions(getPermissionsForRole(userRole))
    } catch (error) {
      console.error('Error loading role:', error)
      setRole('student')
    } finally {
      setLoading(false)
    }
  }

  const getPermissionsForRole = (userRole: UserRole): string[] => {
    const rolePermissions: Record<UserRole, string[]> = {
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
      admin: ['all'],
    }

    return rolePermissions[userRole] || []
  }

  const hasPermission = (permission: string): boolean => {
    if (role === 'admin') return true
    return permissions.includes(permission)
  }

  const can = async (action: string, resourceType: string, resourceId?: string): Promise<boolean> => {
    if (!user?.id) return false
    return RBACService.can(user.id, action, resourceType, resourceId)
  }

  const isProvider = role === 'provider'
  const isVerifier = role === 'verifier'
  const isAdmin = role === 'admin'
  const isStudent = role === 'student'

  return {
    role,
    loading,
    permissions,
    hasPermission,
    can,
    isProvider,
    isVerifier,
    isAdmin,
    isStudent,
    refreshRole: loadRole,
  }
}


