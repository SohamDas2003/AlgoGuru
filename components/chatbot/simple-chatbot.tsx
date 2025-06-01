"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimpleChatbotProps {
  className?: string
}

export function SimpleChatbot({ className }: SimpleChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm AlgoBot 🤖\n\nI can help you with Data Structures & Algorithms:\n• Explain concepts\n• Analyze complexity\n• Solve problems\n• Code examples\n\nWhat would you like to learn?",
      },
    ],
    onError: (error) => {
      console.error("useChat error:", error)
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
      handleSubmit(e)
    }
  }

  const handleRetry = () => {
    reload()
  }

  const handleClearError = () => {
    // Remove the last message if it was from user and caused error
    if (messages.length > 1 && messages[messages.length - 1]?.role === "user") {
      setMessages(messages.slice(0, -1))
    }
  }

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-[9999]", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 border-2 border-white dark:border-gray-800"
        >
          <MessageCircle className="h-8 w-8 text-white" fill="white" strokeWidth={0} />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-[9999]", className)}>
      <Card
        className={cn(
          "w-80 sm:w-96 transition-all duration-300 shadow-2xl bg-white dark:bg-gray-900 border",
          isMinimized ? "h-16" : "h-[500px]",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <div>
              <CardTitle className="text-sm">AlgoBot</CardTitle>
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
          <CardContent className="flex flex-col h-[calc(500px-4rem)] p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start space-x-2",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 bg-blue-600">
                        <AvatarFallback className="text-white text-xs">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 bg-gray-600">
                        <AvatarFallback className="text-white text-xs">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8 bg-blue-600">
                      <AvatarFallback className="text-white text-xs">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8 bg-red-500">
                      <AvatarFallback className="text-white text-xs">
                        <AlertTriangle className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 flex-1">
                      <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                        I'm having trouble right now. Please try again.
                      </p>
                      <div className="flex space-x-2">
                        <Button onClick={handleRetry} size="sm" variant="outline" className="text-xs">
                          Retry
                        </Button>
                        <Button onClick={handleClearError} size="sm" variant="ghost" className="text-xs">
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="border-t p-4">
              <form onSubmit={handleFormSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about DSA..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
