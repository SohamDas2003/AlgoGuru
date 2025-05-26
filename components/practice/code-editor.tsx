"use client"

import React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface CodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState<number[]>([])

  const updateLineNumbers = (text: string) => {
    const lines = text.split("\n").length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    updateLineNumbers(newValue)
  }

  // Initialize line numbers
  React.useEffect(() => {
    updateLineNumbers(value)
  }, [value])

  return (
    <div className="relative border rounded-lg overflow-hidden">
      <div className="bg-gray-800 text-gray-100 px-3 py-2 text-sm font-medium">
        {language === "cpp" ? "C++" : language === "python" ? "Python" : "Java"}
      </div>
      <div className="flex">
        {/* Line Numbers */}
        <div className="bg-gray-50 px-3 py-2 text-gray-500 text-sm font-mono select-none border-r">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1">
          <Textarea
            value={value}
            onChange={handleChange}
            className="min-h-[400px] border-0 rounded-none font-mono text-sm resize-none focus:ring-0"
            placeholder="Write your code here..."
            style={{
              lineHeight: "1.5",
              tabSize: 4,
            }}
          />
        </div>
      </div>
    </div>
  )
}
