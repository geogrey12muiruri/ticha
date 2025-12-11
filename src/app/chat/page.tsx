'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserWithOfflineFallback } from '@/lib/supabaseClient'
import { isOnline } from '@/lib/offlineAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Send, Loader2, WifiOff, ArrowLeft } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { ROUTES } from '@/constants'
import Link from 'next/link'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const router = useRouter()
  const { messages, loading, messagesEndRef, sendMessage } = useChat()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { user } = await getUserWithOfflineFallback()
    if (!user) {
      router.push(ROUTES.LOGIN)
      return
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const messageContent = input
    setInput('')
    await sendMessage(messageContent)
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header - Mobile Responsive */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex-shrink-0"
          >
            <Link href={ROUTES.DASHBOARD}>
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
              EduPath AI Tutor
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
              Ask me anything about your studies!
            </p>
          </div>
          {!isOnline() && (
            <Badge variant="outline" className="text-xs flex-shrink-0">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </header>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 sm:space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
                👋 Welcome! I'm here to help with your studies.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                Ask me questions in English or Kiswahili about any subject, and I'll provide clear, culturally relevant explanations.
              </p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 sm:gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#e5989b] to-[#b5838d] flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-semibold">AI</span>
              </div>
            )}
            
            <div
              className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-lg px-3 sm:px-4 py-2 sm:py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-[#e5989b] to-[#b5838d] text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
              </p>
            </div>
            
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-semibold">You</span>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-2 sm:gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#e5989b] to-[#b5838d] flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-semibold">AI</span>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3">
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-[#e5989b]" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Sticky Bottom */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4">
        <form onSubmit={handleSend} className="flex gap-2 sm:gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question in English or Kiswahili..."
            disabled={loading}
            className="flex-1 text-sm sm:text-base h-10 sm:h-11"
          />
          <Button 
            type="submit" 
            disabled={loading || !input.trim()}
            size="default"
            className="h-10 sm:h-11 w-10 sm:w-11 p-0 flex-shrink-0 bg-gradient-to-r from-[#e5989b] to-[#b5838d] hover:from-[#d4888b] hover:to-[#a5737d]"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
