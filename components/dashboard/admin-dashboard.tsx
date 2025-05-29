"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  BookOpen,
  TrendingUp,
  Eye,
  Edit,
  BarChart3,
  LogOut,
  Settings,
  Sun,
  Moon,
  Monitor,
  Code,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useTheme } from "@/lib/theme"
import { db, type Problem } from "@/lib/database"
import { ProblemManager } from "./problem-manager"
import { StudentProgress } from "./student-progress"
import { useRouter } from "next/navigation"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
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

    // Set up real-time data updates
    const interval = setInterval(loadData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Admin Header - Completely isolated */}
      <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AlgoGuru Admin
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator Dashboard</p>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="flex items-center space-x-4">
              {/* Live Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Live Data</span>
              </div>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ThemeIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <Badge variant="secondary" className="w-fit mt-1">
                        Administrator
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Real-time Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="dark:bg-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-white">Total Problems</CardTitle>
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{stats.totalProblems}</div>
                  <p className="text-xs text-muted-foreground">Active problems</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-white">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered students</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-white">Total Submissions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{stats.totalSubmissions}</div>
                  <p className="text-xs text-muted-foreground">All time submissions</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-white">Average Accuracy</CardTitle>
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{stats.averageAccuracy}%</div>
                  <p className="text-xs text-muted-foreground">Platform wide</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Recent Problems</CardTitle>
                <CardDescription className="dark:text-gray-400">Latest problems added to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {problems.slice(0, 5).map((problem) => (
                    <div
                      key={problem.id}
                      className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium dark:text-white">{problem.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{problem.category}</Badge>
                            <Badge
                              className={
                                problem.difficulty === "Easy"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : problem.difficulty === "Medium"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
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
            <Card className="dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Platform Analytics</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Real-time insights into platform usage and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Real-time Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Advanced analytics dashboard coming soon with live data visualization.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
