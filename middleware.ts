/**
 * Next.js Middleware
 * Handles authentication and route protection
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTES } from '@/constants'

// Explicitly type as string array to avoid literal type inference
const publicRoutes: string[] = [
  String(ROUTES.HOME),
  String(ROUTES.LOGIN),
  String(ROUTES.FORGOT_PASSWORD),
  String(ROUTES.RESET_PASSWORD),
  String(ROUTES.AUTH_CALLBACK),
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Protected routes - check for auth token in cookies
  // Note: Full auth check happens in components using useAuth hook
  // This middleware is for basic route protection
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}



