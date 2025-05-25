"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  x?: number
  y?: number
}

interface BSTVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function BSTVisualizer({ isPlaying, speed, onStepChange }: BSTVisualizerProps) {
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null)
  const [searchPath, setSearchPath] = useState<number[]>([])
  const [operation, setOperation] = useState<"insert" | "search" | "delete" | null>(null)
  const [step, setStep] = useState(0)

  const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    if (!root) {
      return { value, left: null, right: null }
    }

    if (value < root.value) {
      root.left = insertNode(root.left, value)
    } else if (value > root.value) {
      root.right = insertNode(root.right, value)
    }

    return root
  }

  const searchNode = (root: TreeNode | null, value: number, path: number[] = []): boolean => {
    if (!root) return false

    path.push(root.value)

    if (root.value === value) {
      setSearchPath([...path])
      setHighlightedNode(value)
      return true
    }

    if (value < root.value) {
      return searchNode(root.left, value, path)
    } else {
      return searchNode(root.right, value, path)
    }
  }

  const calculatePositions = (node: TreeNode | null, x: number, y: number, spacing: number): void => {
    if (!node) return

    node.x = x
    node.y = y

    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 80, spacing / 2)
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 80, spacing / 2)
    }
  }

  const handleInsert = () => {
    const value = Number.parseInt(inputValue)
    if (!isNaN(value)) {
      setRoot((prev) => insertNode(prev, value))
      setInputValue("")
      setOperation("insert")
      setStep((prev) => prev + 1)
      onStepChange(step + 1)
    }
  }

  const handleSearch = () => {
    const value = Number.parseInt(inputValue)
    if (!isNaN(value)) {
      setSearchPath([])
      setHighlightedNode(null)
      const found = searchNode(root, value)
      setOperation("search")
      setInputValue("")
      if (!found) {
        setSearchPath([])
        setHighlightedNode(null)
      }
    }
  }

  const clearTree = () => {
    setRoot(null)
    setSearchPath([])
    setHighlightedNode(null)
    setOperation(null)
    setStep(0)
    onStepChange(0)
  }

  const createSampleTree = () => {
    let newRoot: TreeNode | null = null
    const values = [50, 30, 70, 20, 40, 60, 80]
    values.forEach((value) => {
      newRoot = insertNode(newRoot, value)
    })
    setRoot(newRoot)
    setStep(values.length)
    onStepChange(values.length)
  }

  useEffect(() => {
    if (root) {
      calculatePositions(root, 300, 50, 100)
    }
  }, [root])

  const renderNode = (node: TreeNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null

    const isHighlighted = highlightedNode === node.value
    const isInPath = searchPath.includes(node.value)

    return (
      <g key={`node-${node.value}`}>
        {/* Edges */}
        {node.left && node.left.x !== undefined && node.left.y !== undefined && (
          <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="#374151" strokeWidth="2" />
        )}
        {node.right && node.right.x !== undefined && node.right.y !== undefined && (
          <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="#374151" strokeWidth="2" />
        )}

        {/* Node circle */}
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          fill={isHighlighted ? "#ef4444" : isInPath ? "#f59e0b" : "#3b82f6"}
          stroke="#1f2937"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Node value */}
        <text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {node.value}
        </text>

        {/* Render children */}
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    )
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter a number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
          />
          <Button onClick={handleInsert} variant="outline" size="sm">
            Insert
          </Button>
          <Button onClick={handleSearch} variant="outline" size="sm">
            Search
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={createSampleTree} variant="outline" size="sm">
            Create Sample Tree
          </Button>
          <Button onClick={clearTree} variant="outline" size="sm">
            Clear Tree
          </Button>
        </div>
      </div>

      {/* Visualization */}
      <div className="border rounded-lg bg-white">
        <svg width="600" height="400" className="w-full">
          {root ? (
            renderNode(root)
          ) : (
            <text x="300" y="200" textAnchor="middle" fill="#6b7280" fontSize="16">
              Tree is empty. Insert some nodes to get started!
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Normal Node</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>Search Path</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Found/Target</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mt-4">
        {operation === "search" && searchPath.length > 0 && (
          <p className="text-blue-600">
            Search path: {searchPath.join(" → ")}
            {highlightedNode && ` (Found: ${highlightedNode})`}
          </p>
        )}
        {operation === "search" && searchPath.length === 0 && highlightedNode === null && (
          <p className="text-red-600">Value not found in tree</p>
        )}
      </div>
    </div>
  )
}
