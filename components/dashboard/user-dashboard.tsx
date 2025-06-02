"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Code, Trophy, Target, TrendingUp, Clock, CheckCircle, Play, BarChart3, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth"
import Link from "next/link"

export function UserDashboard() {
  const { user } = useAuth()

  if (!user) return null

  // Mock data for demonstration
  const stats = {
    problemsSolved: 23,
    totalProblems: 150,
    currentStreak: 5,
    accuracy: 78,
    rank: 1247,
    weeklyGoal: 10,
    weeklyProgress: 7,
  }

  const recentActivity = [
    { problem: "Two Sum", difficulty: "Easy", status: "solved", time: "2 hours ago" },
    { problem: "Valid Parentheses", difficulty: "Easy", status: "solved", time: "1 day ago" },
    { problem: "Binary Search", difficulty: "Easy", status: "attempted", time: "2 days ago" },
    { problem: "Merge Sort", difficulty: "Medium", status: "solved", time: "3 days ago" },
  ]

  const recommendations = [
    { title: "Arrays & Hashing", problems: 12, completed: 8 },
    { title: "Two Pointers", problems: 8, completed: 3 },
    { title: "Stack", problems: 10, completed: 5 },
    { title: "Binary Search", problems: 6, completed: 2 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to continue your DSA journey? Let's solve some problems!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.problemsSolved}</div>
            <p className="text-xs text-muted-foreground">of {stats.totalProblems} total</p>
            <Progress value={(stats.problemsSolved / stats.totalProblems) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <p className="text-xs text-muted-foreground">success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{stats.rank}</div>
            <p className="text-xs text-muted-foreground">worldwide</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Goal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Weekly Goal</span>
            </CardTitle>
            <CardDescription>Track your weekly problem-solving progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {stats.weeklyProgress} of {stats.weeklyGoal} problems
                </span>
                <Badge variant={stats.weeklyProgress >= stats.weeklyGoal ? "default" : "secondary"}>
                  {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%
                </Badge>
              </div>
              <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Keep going! {stats.weeklyGoal - stats.weeklyProgress} more to reach your goal</span>
                <span>Resets in 3 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into your learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/practice" className="block">
              <Button className="w-full justify-start" variant="default">
                <Play className="mr-2 h-4 w-4" />
                Start Practicing
              </Button>
            </Link>
            <Link href="/visualizer" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Code className="mr-2 h-4 w-4" />
                Algorithm Visualizer
              </Button>
            </Link>
            <Link href="/learn" className="block">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Learning Resources
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Your latest problem-solving sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "solved" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{activity.problem}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        activity.difficulty === "Easy"
                          ? "secondary"
                          : activity.difficulty === "Medium"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {activity.difficulty}
                    </Badge>
                    <Badge variant={activity.status === "solved" ? "default" : "outline"}>{activity.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recommended</span>
            </CardTitle>
            <CardDescription>Topics to focus on next</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{topic.title}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {topic.completed}/{topic.problems}
                    </span>
                  </div>
                  <Progress value={(topic.completed / topic.problems) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
