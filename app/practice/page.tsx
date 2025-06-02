"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Play, RotateCcw, CheckCircle, XCircle, Clock, Code, BookOpen, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock problems data
const mockProblems = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    starterCode: {
      python: "def two_sum(nums, target):\n    # Your code here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        \n    }\n};",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        \n    }\n}",
    },
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
    ],
  },
  {
    id: "2",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'."],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The string is valid.",
      },
    ],
    starterCode: {
      python: "def is_valid(s):\n    # Your code here\n    pass",
      cpp: "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n        \n    }\n};",
      java: "class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        \n    }\n}",
    },
    testCases: [
      { input: '"()"', expectedOutput: "true" },
      { input: '"()[]{}"', expectedOutput: "true" },
      { input: '"(]"', expectedOutput: "false" },
    ],
  },
  {
    id: "3",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
    constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ < nums[i], target < 10⁴"],
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4",
      },
    ],
    starterCode: {
      python: "def search(nums, target):\n    # Your code here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Your code here\n        \n    }\n};",
      java: "class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        \n    }\n}",
    },
    testCases: [
      { input: "[-1,0,3,5,9,12]\n9", expectedOutput: "4" },
      { input: "[-1,0,3,5,9,12]\n2", expectedOutput: "-1" },
    ],
  },
]

export default function PracticePage() {
  const [problems, setProblems] = useState(mockProblems)
  const [filteredProblems, setFilteredProblems] = useState(mockProblems)
  const [selectedProblem, setSelectedProblem] = useState(mockProblems[0])
  const [selectedLanguage, setSelectedLanguage] = useState<"cpp" | "python" | "java">("python")
  const [code, setCode] = useState(mockProblems[0].starterCode.python)
  const [customInput, setCustomInput] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; input: string; expected: string; actual: string }>
  >([])
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    let filtered = problems

    if (searchTerm) {
      filtered = filtered.filter((problem) => problem.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((problem) => problem.difficulty === difficultyFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((problem) => problem.category === categoryFilter)
    }

    setFilteredProblems(filtered)
  }, [searchTerm, difficultyFilter, categoryFilter, problems])

  const handleProblemSelect = (problem: (typeof mockProblems)[0]) => {
    setSelectedProblem(problem)
    setCode(problem.starterCode[selectedLanguage])
    setOutput("")
    setTestResults([])
    setCustomInput("")
  }

  const handleLanguageChange = (language: string) => {
    const lang = language as "cpp" | "python" | "java"
    setSelectedLanguage(lang)
    setCode(selectedProblem.starterCode[lang])
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (customInput.trim()) {
        setOutput(`Input: ${customInput}\nOutput: [Mock output for custom input]\nExecution time: 0.05s`)
      } else {
        setOutput("Please provide input to run the code.\nExecution time: 0.00s")
      }
    } catch (error) {
      setOutput(`Error: ${error}\nExecution failed.`)
    } finally {
      setIsRunning(false)
    }
  }

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const results = selectedProblem.testCases.map((testCase, index) => ({
        passed: Math.random() > 0.3,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: index === 0 ? testCase.expectedOutput : "[Mock output]",
      }))

      setTestResults(results)
    } catch (error) {
      setOutput(`Test execution failed: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(selectedProblem.starterCode[selectedLanguage])
    setOutput("")
    setTestResults([])
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Practice Problems</h1>
              <p className="text-gray-600 dark:text-gray-400">Solve coding problems to improve your skills</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Code className="w-4 h-4" />
                <span>{selectedLanguage.toUpperCase()}</span>
              </Badge>
              <Badge className={getDifficultyColor(selectedProblem.difficulty)}>{selectedProblem.difficulty}</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Problem List Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Problems</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <Input
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Filters */}
                <div className="space-y-2">
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Array">Array</SelectItem>
                      <SelectItem value="Stack">Stack</SelectItem>
                      <SelectItem value="Binary Search">Binary Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Problem List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProblems.map((problem) => (
                    <div
                      key={problem.id}
                      onClick={() => handleProblemSelect(problem)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedProblem.id === problem.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm">{problem.title}</h3>
                        <Badge size="sm" className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                      </div>
                      <Badge variant="outline" size="sm">
                        {problem.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Problem Description */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{selectedProblem.title}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedProblem.category}</Badge>
                    <Badge className={getDifficultyColor(selectedProblem.difficulty)}>
                      {selectedProblem.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="constraints">Constraints</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <p className="text-gray-700 dark:text-gray-300">{selectedProblem.description}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="mt-4">
                    <div className="space-y-4">
                      {selectedProblem.examples.map((example, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Input:</strong> {example.input}
                            </div>
                            <div>
                              <strong>Output:</strong> {example.output}
                            </div>
                            {example.explanation && (
                              <div>
                                <strong>Explanation:</strong> {example.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="constraints" className="mt-4">
                    <ul className="space-y-2">
                      {selectedProblem.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 dark:text-gray-300">{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Editor</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={resetCode} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Write your code here..."
                />
              </CardContent>
            </Card>

            {/* Input and Controls */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Input</CardTitle>
                  <CardDescription>Enter your test input here</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter input for your test case..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="min-h-[120px] font-mono"
                  />
                  <div className="flex space-x-2 mt-4">
                    <Button onClick={runCode} disabled={isRunning} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? "Running..." : "Run Code"}
                    </Button>
                    <Button onClick={runTests} disabled={isRunning} variant="outline" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isRunning ? "Testing..." : "Run Tests"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Output</CardTitle>
                  <CardDescription>Code execution results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg min-h-[120px] font-mono text-sm">
                    {isRunning ? (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Executing code...</span>
                      </div>
                    ) : output ? (
                      <pre className="whitespace-pre-wrap">{output}</pre>
                    ) : (
                      <span className="text-gray-400">Output will appear here...</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>
                    {testResults.filter((r) => r.passed).length} / {testResults.length} tests passed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.passed
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-semibold">Test Case {index + 1}</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <strong>Input:</strong> {result.input}
                          </div>
                          <div>
                            <strong>Expected:</strong> {result.expected}
                          </div>
                          <div>
                            <strong>Actual:</strong> {result.actual}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
