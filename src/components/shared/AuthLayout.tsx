/**
 * Authentication Layout Component
 * Shared layout for all auth pages
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BrandHeader } from './BrandHeader'
import Link from 'next/link'

interface AuthLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffb4a2]/40 dark:bg-[#b5838d]/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#e5989b]/40 dark:bg-[#b5838d]/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <BrandHeader />

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-center tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-center text-base leading-6">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>

        {/* Back to home link */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

