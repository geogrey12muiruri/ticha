/**
 * Chat Hook
 * Custom hook for chat operations
 */

import { useState, useEffect, useRef } from 'react'
import { StorageService } from '@/services/storage.service'
import { isOnline } from '@/lib/offlineAuth'
import type { ChatMessage, ChatContext } from '@/types'

export function useChat(initialContext?: ChatContext) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<ChatContext>(initialContext || {
    curriculum: 'CBC',
    language: 'en',
    grade: 8,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    try {
      await StorageService.initialize()
      const savedMessages = await StorageService.getMessages()
      if (savedMessages.length > 0) {
        setMessages(savedMessages)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const sendMessage = async (content: string): Promise<ChatMessage | null> => {
    if (!content.trim() || loading) return null

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      userId: 'current-user',
    }

    setMessages((prev) => [...prev, userMessage])
    await StorageService.saveMessage(userMessage)
    setLoading(true)

    // Check if offline
    if (!isOnline()) {
      const cachedResponse = await StorageService.getCachedAIResponse(content, context)
      
      if (cachedResponse) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cachedResponse,
          timestamp: new Date(),
          userId: 'assistant',
        }
        setMessages((prev) => [...prev, assistantMessage])
        await StorageService.saveMessage(assistantMessage)
        setLoading(false)
        return assistantMessage
      }

      const offlineMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'You are currently offline. AI responses require an internet connection. Your message has been saved and will be processed when you reconnect.',
        timestamp: new Date(),
        userId: 'assistant',
      }
      setMessages((prev) => [...prev, offlineMessage])
      await StorageService.saveMessage(offlineMessage)
      setLoading(false)
      return offlineMessage
    }

    // Online - fetch from API
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context,
        }),
      })

      if (!res.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to get response'
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use status text
          errorMessage = res.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await res.json()
      
      if (!data.response) {
        throw new Error('Invalid response from server')
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        userId: 'assistant',
      }

      setMessages((prev) => [...prev, assistantMessage])
      await StorageService.saveMessage(assistantMessage)
      StorageService.cacheAIResponse(content, data.response, context)
      
      return assistantMessage
    } catch (error: any) {
      console.error('Error sending message:', error)
      
      // Provide more helpful error messages
      let errorContent = 'Sorry, I encountered an error. Please try again.'
      
      if (error.message) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorContent = 'Network error. Please check your internet connection and try again.'
        } else if (error.message.includes('API key') || error.message.includes('GROQ')) {
          errorContent = 'AI service configuration error. Please contact support.'
        } else {
          errorContent = `Error: ${error.message}`
        }
      }
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: !isOnline() 
          ? 'You are offline. Please check your internet connection and try again when online.'
          : errorContent,
        timestamp: new Date(),
        userId: 'assistant',
      }
      setMessages((prev) => [...prev, errorMessage])
      await StorageService.saveMessage(errorMessage)
      return errorMessage
    } finally {
      setLoading(false)
    }
  }

  const updateContext = (updates: Partial<ChatContext>) => {
    setContext((prev) => ({ ...prev, ...updates }))
  }

  const clearMessages = () => {
    setMessages([])
  }

  return {
    messages,
    loading,
    context,
    messagesEndRef,
    sendMessage,
    updateContext,
    clearMessages,
  }
}

