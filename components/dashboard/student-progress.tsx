"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, Users, Award, Target } from "lucide-react"

interface StudentData {
  userId: string
  name: string
  email: string
  problemsSolved: number
  totalSubmissions: number
  accuracy: number
  lastActive: string
  streak: number
  rank: number
}

export function StudentProgress() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rank")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStudentData()
  }, [])

  useEffect(() => {
    filterAndSortStudents()
  }, [students, searchTerm, sortBy])

  const loadStudentData = async () => {
    try {
      // Mock student data since we don't have user management yet
      const mockStudents: StudentData[] = [
        {
          userId: "1",
          name: "Alice Johnson",
          email: "alice@example.com",
          problemsSolved: 45,
          totalSubmissions: 67,
          accuracy: 85.2,
          lastActive: "2024-01-15",
          streak: 12,
          rank: 1,
        },
        {
          userId: "2",
          name: "Bob Smith",
          email: "bob@example.com",
          problemsSolved: 38,
          totalSubmissions: 52,
          accuracy: 78.9,
          lastActive: "2024-01-14",
          streak: 8,
          rank: 2,
        },
        {
          userId: "3",
          name: "Carol Davis",
          email: "carol@example.com",
          problemsSolved: 32,
          totalSubmissions: 48,
          accuracy: 82.1,
          lastActive: "2024-01-13",
          streak: 5,
          rank: 3,
        },
        {
          userId: "4",
          name: "David Wilson",
          email: "david@example.com",
          problemsSolved: 28,
          totalSubmissions: 41,
          accuracy: 76.3,
          lastActive: "2024-01-12",
          streak: 3,
          rank: 4,
        },
        {
          userId: "5",
          name: "Eva Brown",
          email: "eva@example.com",
          problemsSolved: 25,
          totalSubmissions: 35,
          accuracy: 88.6,
          lastActive: "2024-01-11",
          streak: 15,
          rank: 5,
        },
      ]

      setStudents(mockStudents)
    } catch (error) {
      console.error("Failed to load student data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortStudents = () => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "problemsSolved":
          return b.problemsSolved - a.problemsSolved
        case "accuracy":
          return b.accuracy - a.accuracy
        case "streak":
          return b.streak - a.streak
        case "rank":
        default:
          return a.rank - b.rank
      }
    })

    setFilteredStudents(filtered)
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return "text-green-600"
    if (accuracy >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 10) return "text-purple-600"
    if (streak >= 5) return "text-blue-600"
    return "text-gray-600"
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading student progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Problems Solved</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0
                ? Math.round(students.reduce((sum, s) => sum + s.problemsSolved, 0) / students.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per student</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.accuracy, 0) / students.length) : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length > 0 ? students[0]?.name.split(" ")[0] : "N/A"}</div>
            <p className="text-xs text-muted-foreground">Highest rank</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Progress Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>Track individual student performance and progress</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">Rank</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="problemsSolved">Problems Solved</SelectItem>
                <SelectItem value="accuracy">Accuracy</SelectItem>
                <SelectItem value="streak">Streak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Student List */}
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No students found matching your criteria.</p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.userId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      #{student.rank}
                    </div>
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{student.problemsSolved}</div>
                      <div className="text-xs text-gray-600">Problems</div>
                    </div>

                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getAccuracyColor(student.accuracy)}`}>
                        {student.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>

                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getStreakColor(student.streak)}`}>{student.streak}</div>
                      <div className="text-xs text-gray-600">Streak</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600">{new Date(student.lastActive).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-600">Last Active</div>
                    </div>

                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
