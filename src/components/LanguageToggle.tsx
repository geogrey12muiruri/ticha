'use client'

import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import type { Language } from '@/types'

interface LanguageToggleProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('en')}
      >
        English
      </Button>
      <Button
        variant={language === 'sw' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('sw')}
      >
        Kiswahili
      </Button>
    </div>
  )
}





