"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { QuickActions } from "./quick-actions"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedChatbotProps {
  className?: string
}

export function EnhancedChatbot({ className }: EnhancedChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, error, reload } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm AlgoBot 🤖\n\nI can help you with:\n• Data Structures & Algorithms\n• Problem solving strategies\n• Code explanations\n• Interview preparation\n\nWhat would you like to learn about?",
      },
    ],
    onFinish: () => {
      setShowQuickActions(false)
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      setShowQuickActions(false)
      handleSubmit(e)
    }
  }

  const handleQuickAction = (message: string) => {
    if (isLoading) return

    setInput(message)
    setShowQuickActions(false)

    // Trigger form submission
    setTimeout(() => {
      const form = document.createElement("form")
      const event = new Event("submit", { bubbles: true, cancelable: true })
      Object.defineProperty(event, "target", { value: form })
      Object.defineProperty(event, "preventDefault", { value: () => {} })
      handleSubmit(event as any)
    }, 100)
  }

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-[9999]", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-white dark:border-gray-800"
        >
          <MessageCircle className="h-8 w-8 text-white drop-shadow-lg" fill="currentColor" strokeWidth={0} />
          <span className="sr-only">Open AlgoBot</span>
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-[9999]", className)}>
      <Card
        className={cn(
          "w-80 sm:w-96 transition-all duration-300 shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
          isMinimized ? "h-16" : "h-[600px]",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-6 w-6 text-white" fill="currentColor" />
              <div
                className={cn(
                  "absolute -top-1 -right-1 h-3 w-3 rounded-full border border-white",
                  error ? "bg-red-400" : "bg-green-400 animate-pulse",
                )}
              />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">AlgoBot</CardTitle>
              <p className="text-xs opacity-90">DSA Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[calc(600px-5rem)] p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={message.id}>
                    <div
                      className={cn(
                        "flex items-start space-x-2",
                        message.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600">
                          <AvatarFallback className="text-white text-xs bg-transparent">
                            <Bot className="h-4 w-4" fill="currentColor" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                        )}
                      >
                        <div className="whitespace-pre-wrap break-words">{message.content}</div>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 bg-gray-600">
                          <AvatarFallback className="text-white text-xs bg-transparent">
                            <User className="h-4 w-4" fill="currentColor" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Quick actions after welcome message */}
                    {index === 0 && showQuickActions && !error && (
                      <div className="mt-3 ml-10">
                        <QuickActions onQuickAction={handleQuickAction} disabled={isLoading} />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600">
                      <AvatarFallback className="text-white text-xs bg-transparent">
                        <Bot className="h-4 w-4" fill="currentColor" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8 bg-red-500">
                      <AvatarFallback className="text-white text-xs bg-transparent">
                        <AlertCircle className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 flex-1">
                      <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                        Sorry, I'm having trouble right now. Please try again.
                      </p>
                      <Button onClick={() => reload()} size="sm" variant="outline" className="text-xs h-7">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleFormSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about DSA topics..."
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Powered by Groq</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
