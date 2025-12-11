'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserWithOfflineFallback } from '@/lib/supabaseClient'
import { isOnline } from '@/lib/offlineAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Loader2, WifiOff } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { LanguageToggle } from '@/components/LanguageToggle'
import { CurriculumSelector } from '@/components/CurriculumSelector'
import { ROUTES } from '@/constants'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const router = useRouter()
  const { messages, loading, context, messagesEndRef, sendMessage, updateContext } = useChat()

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
    <div className="flex h-screen flex-col bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b] dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto flex h-full max-w-4xl flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Jifunze AI Tutor
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                Ask me anything about your studies!
              </p>
              {!isOnline() && (
                <Badge variant="outline" className="text-xs">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CurriculumSelector
              curriculum={context.curriculum || 'CBC'}
              onCurriculumChange={(curriculum) => updateContext({ curriculum })}
            />
            <LanguageToggle 
              language={context.language || 'en'}
              onLanguageChange={(lang) => updateContext({ language: lang })}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <Card className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Start by asking a question in English or Kiswahili.
              </p>
            </Card>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar>
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === 'user'
                    ? 'bg-[#b5838d] text-white'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </Card>
              {message.role === 'user' && (
                <Avatar>
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3 justify-start">
              <Avatar>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-white dark:bg-gray-800">
                <Loader2 className="h-4 w-4 animate-spin" />
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question in English or Kiswahili..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

