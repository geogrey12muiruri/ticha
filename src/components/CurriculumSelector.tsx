'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Curriculum } from '@/types'
import { BookOpen, GraduationCap } from 'lucide-react'

interface CurriculumSelectorProps {
  selectedCurriculum?: Curriculum
  onSelect: (curriculum: Curriculum) => void
}

export function CurriculumSelector({ selectedCurriculum, onSelect }: CurriculumSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card 
        className={`cursor-pointer transition-all ${
          selectedCurriculum === '8-4-4' 
            ? 'ring-2 ring-[#b5838d] bg-[#ffcdb2]/30 dark:bg-[#b5838d]/20' 
            : 'hover:shadow-md'
        }`}
        onClick={() => onSelect('8-4-4')}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <GraduationCap className="h-5 w-5" />
            8-4-4 System
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            Traditional Kenyan curriculum (Primary, Secondary)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant="outline">KCPE</Badge>
            <Badge variant="outline">KCSE</Badge>
            <p className="text-sm text-muted-foreground mt-2 leading-6">
              Standard subjects: Math, English, Kiswahili, Sciences
            </p>
          </div>
        </CardContent>
      </Card>

      <Card 
        className={`cursor-pointer transition-all ${
          selectedCurriculum === 'CBC' 
            ? 'ring-2 ring-[#e5989b] bg-[#ffb4a2]/30 dark:bg-[#e5989b]/20' 
            : 'hover:shadow-md'
        }`}
        onClick={() => onSelect('CBC')}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5" />
            CBC Curriculum
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            Competency-Based Curriculum (New System)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant="outline">Pre-Primary</Badge>
            <Badge variant="outline">Lower Primary</Badge>
            <Badge variant="outline">Upper Primary</Badge>
            <p className="text-sm text-muted-foreground mt-2 leading-6">
              Focus on competencies and practical skills
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

