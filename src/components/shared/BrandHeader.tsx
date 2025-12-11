/**
 * Brand Header Component
 * Reusable brand/logo section
 */

import { Badge } from '@/components/ui/badge'
import { BookOpen, MapPin } from 'lucide-react'

export function BrandHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e5989b] to-[#b5838d] mb-4 shadow-lg">
        <BookOpen className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-5xl font-bold bg-gradient-to-r from-[#e5989b] to-[#b5838d] bg-clip-text text-transparent mb-3 tracking-tight">
        Jifunze AI
      </h1>
      <p className="text-lg text-muted-foreground font-medium mb-3">
        Your AI-powered learning companion
      </p>
      <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
        <MapPin className="h-3 w-3 mr-1.5" />
        Built for Kenya
      </Badge>
    </div>
  )
}

