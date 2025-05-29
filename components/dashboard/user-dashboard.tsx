"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Target, Calendar, Code, CheckCircle, Award, Flame } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { db } from "@/lib/database"
import { ProfileEditor } from "./profile-editor"
import Link from "next/link"

interface UserStats {
  totalProblems: number
  solvedProblems: number
  attemptedProblems: number
  totalSubmissions: number
  acceptedSubmissions: number
}

export function UserDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return

      try {
        const userStats = await db.getUserStats(user.id)
        setStats(userStats)
      } catch (error) {
        console.error("Failed to load user stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [user])

  if (!user) return null

  const getProgressPercentage = () => {
    if (!stats) return 0
    return Math.round((stats.solvedProblems / stats.totalProblems) * 100)
  }

  const getAccuracyPercentage = () => {
    if (!stats || stats.totalSubmissions === 0) return 0
    return Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600"
    if (streak >= 14) return "text-orange-600"
    if (streak >= 7) return "text-blue-600"
    return "text-gray-600"
  }

  const achievements = [
    {
      id: "first-solve",
      title: "First Steps",
      description: "Solved your first problem",
      icon: Trophy,
      unlocked: (stats?.solvedProblems || 0) >= 1,
      color: "text-yellow-600",
    },
    {
      id: "problem-solver",
      title: "Problem Solver",
      description: "Solved 10 problems",
      icon: Target,
      unlocked: (stats?.solvedProblems || 0) >= 10,
      color: "text-blue-600",
    },
    {
      id: "streak-master",
      title: "Streak Master",
      description: "Maintained a 7-day streak",
      icon: Flame,
      unlocked: user.streak >= 7,
      color: "text-orange-600",
    },
    {
      id: "accuracy-expert",
      title: "Accuracy Expert",
      description: "Achieved 80% accuracy",
      icon: Award,
      unlocked: getAccuracyPercentage() >= 80,
      color: "text-green-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600 mt-1">Track your progress and continue learning</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Flame className={`w-4 h-4 ${getStreakColor(user.streak)}`} />
                <span>{user.streak} day streak</span>
              </Badge>
              <Link href="/practice">
                <Button>
                  <Code className="w-4 h-4 mr-2" />
                  Practice Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.solvedProblems || 0}</div>
                  <p className="text-xs text-muted-foreground">out of {stats?.totalProblems || 0} total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getAccuracyPercentage()}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.acceptedSubmissions || 0} / {stats?.totalSubmissions || 0} submissions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <Flame className={`h-4 w-4 ${getStreakColor(user.streak)}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.streak}</div>
                  <p className="text-xs text-muted-foreground">days in a row</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your overall progress across all problem categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{getProgressPercentage()}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats?.solvedProblems || 0}</div>
                    <div className="text-sm text-green-700">Solved</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats?.attemptedProblems || 0}</div>
                    <div className="text-sm text-yellow-700">Attempted</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {(stats?.totalProblems || 0) - (stats?.solvedProblems || 0) - (stats?.attemptedProblems || 0)}
                    </div>
                    <div className="text-sm text-gray-700">Not Started</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Progress</CardTitle>
                <CardDescription>Track your progress across different problem categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Array", "String", "Dynamic Programming", "Tree", "Graph"].map((category) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span>0/0</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Unlock badges as you progress through your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.unlocked ? "bg-white border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-green-100" : "bg-gray-100"}`}>
                          <achievement.icon
                            className={`w-6 h-6 ${achievement.unlocked ? achievement.color : "text-gray-400"}`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="mt-1">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
