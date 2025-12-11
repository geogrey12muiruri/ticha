/**
 * Career Advisor Chat Interface
 * AI-powered career guidance chat
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Send, Sparkles } from 'lucide-react'
import type { StudentProfile } from '@/types/student-profile'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  relatedOpportunities?: Array<{
    name: string
    type: string
    matchReason: string
  }>
}

interface CareerAdvisorChatProps {
  profile?: Partial<StudentProfile>
}

export function CareerAdvisorChat({ profile }: CareerAdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Career Advisor. I can help you with:\n\n• Career guidance based on your strengths\n• Scholarship and opportunity recommendations\n• Learning path suggestions\n• Answering questions about your academic journey\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/career/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          profile,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get advice')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        relatedOpportunities: data.relatedOpportunities,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting career advice:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e5989b] to-[#b5838d] flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">AI Career Advisor</h3>
          <p className="text-xs text-muted-foreground">Ask me anything about your career</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-[#e5989b] text-white'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                {message.relatedOpportunities && message.relatedOpportunities.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-xs font-semibold mb-2">Related Opportunities:</p>
                    <div className="space-y-1">
                      {message.relatedOpportunities.map((opp, index) => (
                        <div key={index} className="text-xs">
                          <span className="font-medium">{opp.name}</span> ({opp.type})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your career..."
            disabled={loading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}


