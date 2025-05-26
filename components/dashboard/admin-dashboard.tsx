"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, TrendingUp, Eye, Edit, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { db, type Problem } from "@/lib/database"
import { ProblemManager } from "./problem-manager"
import { StudentProgress } from "./student-progress"

export function AdminDashboard() {
  const { user } = useAuth()
  const [problems, setProblems] = useState<Problem[]>([])
  const [stats, setStats] = useState({
    totalProblems: 0,
    totalUsers: 0,
    totalSubmissions: 0,
    averageAccuracy: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [problemsData, allUserStats] = await Promise.all([db.getProblems(), db.getAllUserStats()])

        setProblems(problemsData)

        const totalSubmissions = allUserStats.reduce((sum, user) => sum + user.totalSubmissions, 0)
        const totalAccepted = allUserStats.reduce((sum, user) => sum + user.acceptedSubmissions, 0)

        setStats({
          totalProblems: problemsData.length,
          totalUsers: allUserStats.length,
          totalSubmissions,
          averageAccuracy: totalSubmissions > 0 ? Math.round((totalAccepted / totalSubmissions) * 100) : 0,
        })
      } catch (error) {
        console.error("Failed to load admin data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage content and monitor student progress</p>
            </div>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Administrator</span>
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProblems}</div>
                  <p className="text-xs text-muted-foreground">Active problems</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                  <p className="text-xs text-muted-foreground">All time submissions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
                  <p className="text-xs text-muted-foreground">Platform wide</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Problems</CardTitle>
                <CardDescription>Latest problems added to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {problems.slice(0, 5).map((problem) => (
                    <div key={problem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{problem.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{problem.category}</Badge>
                            <Badge
                              className={
                                problem.difficulty === "Easy"
                                  ? "bg-green-100 text-green-800"
                                  : problem.difficulty === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {problem.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="space-y-6">
            <ProblemManager />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <StudentProgress />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Detailed insights into platform usage and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">Detailed analytics and reporting features will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
