"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Code, Clock, HelpCircle } from "lucide-react"

interface QuickActionsProps {
  onQuickAction: (message: string) => void
  disabled?: boolean
}

const quickTopics = [
  {
    icon: BookOpen,
    label: "Data Structures",
    message: "Explain the main data structures and when to use them",
  },
  {
    icon: Code,
    label: "Algorithms",
    message: "What are the most important algorithms to learn?",
  },
  {
    icon: Clock,
    label: "Big O",
    message: "Explain Big O notation with simple examples",
  },
  {
    icon: HelpCircle,
    label: "Interview Tips",
    message: "Give me tips for coding interviews",
  },
]

export function QuickActions({ onQuickAction, disabled = false }: QuickActionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick topics:</p>
      <div className="grid grid-cols-2 gap-2">
        {quickTopics.map((topic) => {
          const Icon = topic.icon
          return (
            <Button
              key={topic.label}
              variant="outline"
              size="sm"
              onClick={() => onQuickAction(topic.message)}
              disabled={disabled}
              className="h-auto p-2 flex flex-col items-center space-y-1 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Icon className="h-4 w-4" />
              <span>{topic.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
