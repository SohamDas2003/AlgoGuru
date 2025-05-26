"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Eye, Save, X } from "lucide-react"
import { db, type Problem } from "@/lib/database"
import { useAuth } from "@/lib/auth"

interface TestCase {
  input: string
  expectedOutput: string
  isHidden?: boolean
}

interface ProblemForm {
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  description: string
  constraints: string[]
  tags: string[]
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  starterCode: {
    cpp: string
    python: string
    java: string
  }
  testCases: TestCase[]
}

const initialProblemForm: ProblemForm = {
  title: "",
  difficulty: "Easy",
  category: "",
  description: "",
  constraints: [],
  tags: [],
  examples: [{ input: "", output: "", explanation: "" }],
  starterCode: {
    cpp: "",
    python: "",
    java: "",
  },
  testCases: [{ input: "", expectedOutput: "", isHidden: false }],
}

export function ProblemManager() {
  const { user } = useAuth()
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null)
  const [formData, setFormData] = useState<ProblemForm>(initialProblemForm)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadProblems()
  }, [])

  const loadProblems = async () => {
    try {
      const problemsData = await db.getProblems()
      setProblems(problemsData)
    } catch (error) {
      console.error("Failed to load problems:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProblem = () => {
    setEditingProblem(null)
    setFormData(initialProblemForm)
    setIsDialogOpen(true)
    setMessage("")
  }

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem)
    setFormData({
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      description: problem.description,
      constraints: problem.constraints,
      tags: problem.tags,
      examples: problem.examples,
      starterCode: problem.starterCode,
      testCases: problem.testCases,
    })
    setIsDialogOpen(true)
    setMessage("")
  }

  const handleSaveProblem = async () => {
    if (!user) return

    try {
      if (editingProblem) {
        await db.updateProblem(editingProblem.id, {
          ...formData,
        })
        setMessage("Problem updated successfully!")
      } else {
        await db.createProblem({
          ...formData,
          createdBy: user.id,
        })
        setMessage("Problem created successfully!")
      }

      await loadProblems()
      setIsDialogOpen(false)
    } catch (error) {
      setMessage("Failed to save problem. Please try again.")
    }
  }

  const handleDeleteProblem = async (problemId: string) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      try {
        await db.deleteProblem(problemId)
        await loadProblems()
        setMessage("Problem deleted successfully!")
      } catch (error) {
        setMessage("Failed to delete problem.")
      }
    }
  }

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { input: "", output: "", explanation: "" }],
    })
  }

  const removeExample = (index: number) => {
    setFormData({
      ...formData,
      examples: formData.examples.filter((_, i) => i !== index),
    })
  }

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: "", expectedOutput: "", isHidden: false }],
    })
  }

  const removeTestCase = (index: number) => {
    setFormData({
      ...formData,
      testCases: formData.testCases.filter((_, i) => i !== index),
    })
  }

  const addConstraint = () => {
    setFormData({
      ...formData,
      constraints: [...formData.constraints, ""],
    })
  }

  const updateConstraint = (index: number, value: string) => {
    const newConstraints = [...formData.constraints]
    newConstraints[index] = value
    setFormData({ ...formData, constraints: newConstraints })
  }

  const removeConstraint = (index: number) => {
    setFormData({
      ...formData,
      constraints: formData.constraints.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Problem Management</CardTitle>
              <CardDescription>Create, edit, and manage coding problems</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateProblem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Problem
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProblem ? "Edit Problem" : "Create New Problem"}</DialogTitle>
                  <DialogDescription>
                    {editingProblem ? "Update the problem details" : "Add a new coding problem to the platform"}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="code">Starter Code</TabsTrigger>
                    <TabsTrigger value="tests">Test Cases</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Problem title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g., Array, String, Tree"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                          setFormData({ ...formData, difficulty: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Problem description..."
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Constraints</Label>
                      {formData.constraints.map((constraint, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={constraint}
                            onChange={(e) => updateConstraint(index, e.target.value)}
                            placeholder="Add constraint"
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => removeConstraint(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addConstraint}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Constraint
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="space-y-4">
                    {formData.examples.map((example, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm">Example {index + 1}</CardTitle>
                            {formData.examples.length > 1 && (
                              <Button type="button" variant="outline" size="sm" onClick={() => removeExample(index)}>
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Input</Label>
                            <Textarea
                              value={example.input}
                              onChange={(e) => {
                                const newExamples = [...formData.examples]
                                newExamples[index].input = e.target.value
                                setFormData({ ...formData, examples: newExamples })
                              }}
                              placeholder="Example input"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Output</Label>
                            <Textarea
                              value={example.output}
                              onChange={(e) => {
                                const newExamples = [...formData.examples]
                                newExamples[index].output = e.target.value
                                setFormData({ ...formData, examples: newExamples })
                              }}
                              placeholder="Expected output"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Explanation (Optional)</Label>
                            <Textarea
                              value={example.explanation || ""}
                              onChange={(e) => {
                                const newExamples = [...formData.examples]
                                newExamples[index].explanation = e.target.value
                                setFormData({ ...formData, examples: newExamples })
                              }}
                              placeholder="Explanation of the example"
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={addExample}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Example
                    </Button>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Python Starter Code</Label>
                        <Textarea
                          value={formData.starterCode.python}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              starterCode: { ...formData.starterCode, python: e.target.value },
                            })
                          }
                          placeholder="def solution():\n    # Your code here\n    pass"
                          rows={6}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>C++ Starter Code</Label>
                        <Textarea
                          value={formData.starterCode.cpp}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              starterCode: { ...formData.starterCode, cpp: e.target.value },
                            })
                          }
                          placeholder="class Solution {\npublic:\n    // Your code here\n};"
                          rows={6}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Java Starter Code</Label>
                        <Textarea
                          value={formData.starterCode.java}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              starterCode: { ...formData.starterCode, java: e.target.value },
                            })
                          }
                          placeholder="class Solution {\n    // Your code here\n}"
                          rows={6}
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tests" className="space-y-4">
                    {formData.testCases.map((testCase, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm">Test Case {index + 1}</CardTitle>
                            {formData.testCases.length > 1 && (
                              <Button type="button" variant="outline" size="sm" onClick={() => removeTestCase(index)}>
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Input</Label>
                            <Textarea
                              value={testCase.input}
                              onChange={(e) => {
                                const newTestCases = [...formData.testCases]
                                newTestCases[index].input = e.target.value
                                setFormData({ ...formData, testCases: newTestCases })
                              }}
                              placeholder="Test input"
                              rows={2}
                              className="font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Expected Output</Label>
                            <Textarea
                              value={testCase.expectedOutput}
                              onChange={(e) => {
                                const newTestCases = [...formData.testCases]
                                newTestCases[index].expectedOutput = e.target.value
                                setFormData({ ...formData, testCases: newTestCases })
                              }}
                              placeholder="Expected output"
                              rows={2}
                              className="font-mono"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`hidden-${index}`}
                              checked={testCase.isHidden || false}
                              onChange={(e) => {
                                const newTestCases = [...formData.testCases]
                                newTestCases[index].isHidden = e.target.checked
                                setFormData({ ...formData, testCases: newTestCases })
                              }}
                              className="rounded"
                            />
                            <Label htmlFor={`hidden-${index}`}>Hidden test case</Label>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={addTestCase}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Test Case
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProblem}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingProblem ? "Update Problem" : "Create Problem"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading problems...</div>
            ) : problems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No problems found. Create your first problem!</p>
              </div>
            ) : (
              problems.map((problem) => (
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
                        <span className="text-sm text-gray-500">{problem.testCases.length} test cases</span>
                        <span className="text-sm text-gray-500">
                          Created {new Date(problem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/practice?problem=${problem.id}`} target="_blank" rel="noreferrer">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditProblem(problem)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProblem(problem.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
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
