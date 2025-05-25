"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Play, BookOpen, Code, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

const algorithmCategories = [
  {
    title: "Sorting Algorithms",
    description: "Visualize how different sorting algorithms work",
    algorithms: [
      { name: "Bubble Sort", difficulty: "Easy", time: "O(n²)" },
      { name: "Quick Sort", difficulty: "Medium", time: "O(n log n)" },
      { name: "Merge Sort", difficulty: "Medium", time: "O(n log n)" },
      { name: "Heap Sort", difficulty: "Hard", time: "O(n log n)" },
    ],
    color: "bg-blue-500",
  },
  {
    title: "Tree Algorithms",
    description: "Explore tree data structures and operations",
    algorithms: [
      { name: "Binary Search Tree", difficulty: "Medium", time: "O(log n)" },
      { name: "AVL Tree", difficulty: "Hard", time: "O(log n)" },
    ],
    color: "bg-green-500",
  },
  {
    title: "Graph Algorithms",
    description: "Understand graph traversal and shortest path algorithms",
    algorithms: [{ name: "Dijkstra's Algorithm", difficulty: "Hard", time: "O(V²)" }],
    color: "bg-purple-500",
  },
  {
    title: "Data Structures",
    description: "Interactive visualization of fundamental data structures",
    algorithms: [
      { name: "Stack Operations", difficulty: "Easy", time: "O(1)" },
      { name: "Queue Operations", difficulty: "Easy", time: "O(1)" },
      { name: "Linked List", difficulty: "Easy", time: "O(n)" },
      { name: "Hash Table", difficulty: "Medium", time: "O(1)" },
    ],
    color: "bg-orange-500",
  },
]

const features = [
  {
    icon: Play,
    title: "Interactive Visualizations",
    description: "Step-by-step animations with play, pause, and speed controls",
  },
  {
    icon: Code,
    title: "Code Implementation",
    description: "View actual code alongside visualizations in multiple languages",
  },
  {
    icon: BookOpen,
    title: "Detailed Explanations",
    description: "Comprehensive explanations of algorithm logic and complexity",
  },
  {
    icon: Zap,
    title: "Performance Analysis",
    description: "Real-time complexity analysis and performance comparisons",
  },
]

const stats = [
  { label: "Algorithms", value: "50+" },
  { label: "Data Structures", value: "15+" },
  { label: "Students", value: "10K+" },
  { label: "Success Rate", value: "95%" },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")

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

  const filteredCategories = algorithmCategories
    .map((category) => ({
      ...category,
      algorithms: category.algorithms.filter((algo) => algo.name.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
    .filter((category) => category.algorithms.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AlgoGuru
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#algorithms" className="text-gray-600 hover:text-gray-900">
                Algorithms
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Master Data Structures & Algorithms
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Interactive visualizations, step-by-step explanations, and hands-on practice to help you understand and
              master DSA concepts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline">
                <BookOpen className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose AlgoGuru?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines visual learning with practical implementation to make complex algorithms easy to
              understand.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section id="algorithms" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Explore Algorithms</h3>
            <p className="text-gray-600 mb-8">Choose from our comprehensive collection of algorithm visualizations</p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search algorithms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {filteredCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.algorithms.map((algo, algoIndex) => (
                      <Link
                        key={algoIndex}
                        href={`/visualizer/${algo.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{algo.name}</span>
                            <Badge className={getDifficultyColor(algo.difficulty)}>{algo.difficulty}</Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-500">
                            <span className="text-sm font-mono">{algo.time}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Master Algorithms?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who have improved their coding skills with AlgoGuru
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            <Play className="w-5 h-5 mr-2" />
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">AlgoGuru</h4>
              </div>
              <p className="text-gray-400">Making algorithms accessible through interactive visualizations.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Algorithms</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Sorting</li>
                <li>Trees</li>
                <li>Graphs</li>
                <li>Dynamic Programming</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Tutorials</li>
                <li>Practice Problems</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-gray-400">
                <li>GitHub</li>
                <li>Discord</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AlgoGuru. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
