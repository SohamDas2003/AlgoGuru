"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, TrendingUp, Settings, Plus, BarChart3, Activity, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth"
import Link from "next/link"

export function AdminDashboard() {
  const { user } = useAuth()

  if (!user) return null

  // Mock admin data
  const adminStats = {
    totalUsers: 1247,
    totalProblems: 150,
    activeUsers: 89,
    newUsersToday: 12,
    problemsAddedThisWeek: 5,
    averageAccuracy: 72,
  }

  const recentActivity = [
    { user: "John Doe", action: "Solved Two Sum", time: "5 min ago" },
    { user: "Jane Smith", action: "Registered", time: "15 min ago" },
    { user: "Mike Johnson", action: "Solved Binary Search", time: "1 hour ago" },
    { user: "Sarah Wilson", action: "Started practice session", time: "2 hours ago" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Admin Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard 🛠️</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your DSA learning platform</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+{adminStats.newUsersToday} today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalProblems}</div>
            <p className="text-xs text-muted-foreground">+{adminStats.problemsAddedThisWeek} this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">online now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.averageAccuracy}%</div>
            <p className="text-xs text-muted-foreground">platform wide</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/problems" className="block">
              <Button className="w-full justify-start" variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Add New Problem
              </Button>
            </Link>
            <Link href="/admin/users" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/analytics" className="block">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
            <Link href="/admin/settings" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Platform Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent User Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest user actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-400">Database</p>
                  <p className="text-sm text-green-600 dark:text-green-500">Operational</p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-400">API</p>
                  <p className="text-sm text-green-600 dark:text-green-500">Response time: 120ms</p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-400">Storage</p>
                  <p className="text-sm text-blue-600 dark:text-blue-500">78% used</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400">Normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
