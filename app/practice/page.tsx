"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Play, RotateCcw, CheckCircle, XCircle, Clock, Code, BookOpen } from "lucide-react"
import { CodeEditor } from "@/components/practice/code-editor"
import { ProblemList } from "@/components/practice/problem-list"

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

const sampleProblems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    starterCode: {
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        
    }
};`,
      python: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
}`,
    },
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "[0,1]",
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "[1,2]",
      },
    ],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character."],
    starterCode: {
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Your code here
        
    }
};`,
      python: `def reverse_string(s):
    """
    :type s: List[str]
    :rtype: None Do not return anything, modify s in-place instead.
    """
    # Your code here
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Your code here
        
    }
}`,
    },
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
      },
      {
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
      },
    ],
  },
  {
    id: "fibonacci",
    title: "Fibonacci Number",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

Given n, calculate F(n).`,
    examples: [
      {
        input: "n = 2",
        output: "1",
        explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1.",
      },
      {
        input: "n = 3",
        output: "2",
        explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2.",
      },
    ],
    constraints: ["0 ≤ n ≤ 30"],
    starterCode: {
      cpp: `class Solution {
public:
    int fib(int n) {
        // Your code here
        
    }
};`,
      python: `def fib(n):
    """
    :type n: int
    :rtype: int
    """
    # Your code here
    pass`,
      java: `class Solution {
    public int fib(int n) {
        // Your code here
        
    }
}`,
    },
    testCases: [
      {
        input: "2",
        expectedOutput: "1",
      },
      {
        input: "3",
        expectedOutput: "2",
      },
      {
        input: "4",
        expectedOutput: "3",
      },
    ],
  },
]

export default function PracticePage() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(sampleProblems[0])
  const [selectedLanguage, setSelectedLanguage] = useState<"cpp" | "python" | "java">("python")
  const [code, setCode] = useState(sampleProblems[0].starterCode.python)
  const [customInput, setCustomInput] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; input: string; expected: string; actual: string }>
  >([])

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem)
    setCode(problem.starterCode[selectedLanguage])
    setOutput("")
    setTestResults([])
    setCustomInput("")
  }

  const handleLanguageChange = (language: "cpp" | "python" | "java") => {
    setSelectedLanguage(language)
    setCode(selectedProblem.starterCode[language])
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")

    try {
      // Simulate code execution
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock execution result
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
      // Simulate test execution
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock test results
      const results = selectedProblem.testCases.map((testCase, index) => ({
        passed: Math.random() > 0.3, // 70% pass rate for demo
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Online Coding Practice</h1>
              <p className="text-gray-600">Solve problems with our in-browser code editor</p>
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
            <ProblemList
              problems={sampleProblems}
              selectedProblem={selectedProblem}
              onProblemSelect={handleProblemSelect}
            />
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
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">{selectedProblem.description}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="mt-4">
                    <div className="space-y-4">
                      {selectedProblem.examples.map((example, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
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
                          <span className="text-gray-700">{constraint}</span>
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
                <CodeEditor language={selectedLanguage} value={code} onChange={setCode} />
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
                          result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
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
