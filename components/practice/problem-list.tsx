"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
  starterCode: {
    cpp: string
    python: string
    java: string
  }
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
}

interface ProblemListProps {
  problems: Problem[]
  selectedProblem: Problem
  onProblemSelect: (problem: Problem) => void
}

export function ProblemList({ problems, selectedProblem, onProblemSelect }: ProblemListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Problems</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => onProblemSelect(problem)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedProblem.id === problem.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="space-y-2">
                <h3 className="font-medium text-sm">{problem.title}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {problem.category}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
