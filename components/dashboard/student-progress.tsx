"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, TrendingUp, TrendingDown, Minus, Eye, Award } from "lucide-react"

interface StudentStats {
  userId: string
  userName: string
  userEmail: string
  totalProblems: number
  solvedProblems: number
  attemptedProblems: number
  totalSubmissions: number
  acceptedSubmissions: number
  joinedAt: string
  lastActive: string
  streak: number
}

export function StudentProgress() {
  const [students, setStudents] = useState<StudentStats[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentStats[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"name" | "solved" | "accuracy" | "streak">("solved")

  useEffect(() => {
    loadStudentData()
  }, [])

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.userName.localeCompare(b.userName)
        case "solved":
          return b.solvedProblems - a.solvedProblems
        case "accuracy":
          const aAccuracy = a.totalSubmissions > 0 ? (a.acceptedSubmissions / a.totalSubmissions) * 100 : 0
          const bAccuracy = b.totalSubmissions > 0 ? (b.acceptedSubmissions / b.totalSubmissions) * 100 : 0
          return bAccuracy - aAccuracy
        case "streak":
          return b.streak - a.streak
        default:
          return 0
      }
    })

    setFilteredStudents(sorted)
  }, [students, searchTerm, sortBy])

  const loadStudentData = async () => {
    try {
      // Mock student data - in a real app, this would come from the database
      const mockStudents: StudentStats[] = [
        {
          userId: "2",
          userName: "John Doe",
          userEmail: "user@example.com",
          totalProblems: 50,
          solvedProblems: 12,
          attemptedProblems: 8,
          totalSubmissions: 25,
          acceptedSubmissions: 15,
          joinedAt: "2024-01-15",
          lastActive: "2024-01-20",
          streak: 5,
        },
        {
          userId: "3",
          userName: "Jane Smith",
          userEmail: "jane@example.com",
          totalProblems: 50,
          solvedProblems: 28,
          attemptedProblems: 5,
          totalSubmissions: 45,
          acceptedSubmissions: 35,
          joinedAt: "2024-01-10",
          lastActive: "2024-01-21",
          streak: 12,
        },
        {
          userId: "4",
          userName: "Mike Johnson",
          userEmail: "mike@example.com",
          totalProblems: 50,
          solvedProblems: 8,
          attemptedProblems: 12,
          totalSubmissions: 30,
          acceptedSubmissions: 12,
          joinedAt: "2024-01-20",
          lastActive: "2024-01-19",
          streak: 0,
        },
      ]

      setStudents(mockStudents)
    } catch (error) {
      console.error("Failed to load student data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAccuracyPercentage = (student: StudentStats) => {
    if (student.totalSubmissions === 0) return 0
    return Math.round((student.acceptedSubmissions / student.totalSubmissions) * 100)
  }

  const getProgressPercentage = (student: StudentStats) => {
    return Math.round((student.solvedProblems / student.totalProblems) * 100)
  }

  const getTrendIcon = (student: StudentStats) => {
    const accuracy = getAccuracyPercentage(student)
    if (accuracy >= 70) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (accuracy >= 50) return <Minus className="w-4 h-4 text-yellow-600" />
    return <TrendingDown className="w-4 h-4 text-red-600" />
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 14) return "text-purple-600"
    if (streak >= 7) return "text-blue-600"
    if (streak >= 3) return "text-green-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Student Progress Monitoring</CardTitle>
              <CardDescription>Track individual student performance and engagement</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="solved">Sort by Problems Solved</option>
                <option value="accuracy">Sort by Accuracy</option>
                <option value="streak">Sort by Streak</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading student data...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No students found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <Card key={student.userId} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder.svg" alt={student.userName} />
                        <AvatarFallback>
                          {student.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{student.userName}</h3>
                        <p className="text-sm text-gray-600">{student.userEmail}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Joined {new Date(student.joinedAt).toLocaleDateString()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Last active {new Date(student.lastActive).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      {/* Problems Solved */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{student.solvedProblems}</div>
                        <div className="text-xs text-gray-600">Solved</div>
                        <div className="w-16 mt-1">
                          <Progress value={getProgressPercentage(student)} className="h-1" />
                        </div>
                      </div>

                      {/* Accuracy */}
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-2xl font-bold">{getAccuracyPercentage(student)}%</span>
                          {getTrendIcon(student)}
                        </div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                        <div className="text-xs text-gray-500">
                          {student.acceptedSubmissions}/{student.totalSubmissions}
                        </div>
                      </div>

                      {/* Streak */}
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getStreakColor(student.streak)}`}>{student.streak}</div>
                        <div className="text-xs text-gray-600">Day Streak</div>
                        {student.streak >= 7 && <Award className="w-4 h-4 text-yellow-500 mx-auto mt-1" />}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Details */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Problems:</span>
                        <span className="ml-2 font-medium">{student.totalProblems}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Attempted:</span>
                        <span className="ml-2 font-medium text-yellow-600">{student.attemptedProblems}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Not Started:</span>
                        <span className="ml-2 font-medium text-gray-500">
                          {student.totalProblems - student.solvedProblems - student.attemptedProblems}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="ml-2 font-medium">{getAccuracyPercentage(student)}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0
                ? Math.round(students.reduce((sum, s) => sum + getProgressPercentage(s), 0) / students.length)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Problems completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0
                ? Math.round(students.reduce((sum, s) => sum + getAccuracyPercentage(s), 0) / students.length)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Submission success</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter((s) => s.streak > 0).length}</div>
            <p className="text-xs text-muted-foreground">Students with streaks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
