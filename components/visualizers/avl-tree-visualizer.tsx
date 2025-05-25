"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AVLNode {
  value: number
  left: AVLNode | null
  right: AVLNode | null
  height: number
  x?: number
  y?: number
}

interface AVLTreeVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function AVLTreeVisualizer({ isPlaying, speed, onStepChange }: AVLTreeVisualizerProps) {
  const [root, setRoot] = useState<AVLNode | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [lastOperation, setLastOperation] = useState("")
  const [rotatingNodes, setRotatingNodes] = useState<number[]>([])
  const [step, setStep] = useState(0)

  const getHeight = (node: AVLNode | null): number => {
    return node ? node.height : 0
  }

  const getBalance = (node: AVLNode | null): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0
  }

  const updateHeight = (node: AVLNode): void => {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1
  }

  const rotateRight = (y: AVLNode): AVLNode => {
    const x = y.left!
    const T2 = x.right

    x.right = y
    y.left = T2

    updateHeight(y)
    updateHeight(x)

    return x
  }

  const rotateLeft = (x: AVLNode): AVLNode => {
    const y = x.right!
    const T2 = y.left

    y.left = x
    x.right = T2

    updateHeight(x)
    updateHeight(y)

    return y
  }

  const insertNode = (node: AVLNode | null, value: number): AVLNode => {
    // Standard BST insertion
    if (!node) {
      return { value, left: null, right: null, height: 1 }
    }

    if (value < node.value) {
      node.left = insertNode(node.left, value)
    } else if (value > node.value) {
      node.right = insertNode(node.right, value)
    } else {
      return node // Duplicate values not allowed
    }

    // Update height
    updateHeight(node)

    // Get balance factor
    const balance = getBalance(node)

    // Left Left Case
    if (balance > 1 && value < node.left!.value) {
      setRotatingNodes([node.value, node.left!.value])
      return rotateRight(node)
    }

    // Right Right Case
    if (balance < -1 && value > node.right!.value) {
      setRotatingNodes([node.value, node.right!.value])
      return rotateLeft(node)
    }

    // Left Right Case
    if (balance > 1 && value > node.left!.value) {
      setRotatingNodes([node.value, node.left!.value, node.left!.right!.value])
      node.left = rotateLeft(node.left!)
      return rotateRight(node)
    }

    // Right Left Case
    if (balance < -1 && value < node.right!.value) {
      setRotatingNodes([node.value, node.right!.value, node.right!.left!.value])
      node.right = rotateRight(node.right!)
      return rotateLeft(node)
    }

    return node
  }

  const calculatePositions = (node: AVLNode | null, x: number, y: number, spacing: number): void => {
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
      setRotatingNodes([])
      setRoot((prev) => insertNode(prev, value))
      setInputValue("")
      setLastOperation(`Inserted ${value}`)
      setStep((prev) => prev + 1)
      onStepChange(step + 1)

      setTimeout(() => setRotatingNodes([]), 1500)
    }
  }

  const clearTree = () => {
    setRoot(null)
    setRotatingNodes([])
    setLastOperation("Tree cleared")
    setStep(0)
    onStepChange(0)
  }

  const createSampleTree = () => {
    let newRoot: AVLNode | null = null
    const values = [10, 20, 30, 40, 50, 25]
    values.forEach((value) => {
      newRoot = insertNode(newRoot, value)
    })
    setRoot(newRoot)
    setLastOperation("Sample AVL tree created")
    setStep(values.length)
    onStepChange(values.length)
  }

  if (root) {
    calculatePositions(root, 300, 50, 100)
  }

  const renderNode = (node: AVLNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null

    const isRotating = rotatingNodes.includes(node.value)
    const balance = getBalance(node)

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
          r="25"
          fill={isRotating ? "#ef4444" : Math.abs(balance) > 1 ? "#f59e0b" : "#3b82f6"}
          stroke="#1f2937"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Node value */}
        <text x={node.x} y={node.y} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          {node.value}
        </text>

        {/* Balance factor */}
        <text x={node.x + 35} y={node.y - 10} textAnchor="middle" fill="#374151" fontSize="10">
          {balance}
        </text>

        {/* Height */}
        <text x={node.x + 35} y={node.y + 5} textAnchor="middle" fill="#6b7280" fontSize="10">
          h:{node.height}
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
      <div className="border rounded-lg bg-white mb-6">
        <svg width="600" height="400" className="w-full">
          {root ? (
            renderNode(root)
          ) : (
            <text x="300" y="200" textAnchor="middle" fill="#6b7280" fontSize="16">
              AVL Tree is empty. Insert some nodes to get started!
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Balanced Node</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>Unbalanced Node</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Rotating</span>
        </div>
      </div>

      {/* AVL Properties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">Balance Factor</h4>
          <p className="text-blue-600">Height(left) - Height(right)</p>
          <p className="text-xs text-blue-500 mt-1">Must be -1, 0, or 1</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-1">Self-Balancing</h4>
          <p className="text-green-600">Automatic rotations maintain balance</p>
          <p className="text-xs text-green-500 mt-1">Guarantees O(log n) operations</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-1">Rotations</h4>
          <p className="text-purple-600">LL, RR, LR, RL cases</p>
          <p className="text-xs text-purple-500 mt-1">Restore balance after insertion</p>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mt-4">
        {lastOperation && <p className="text-blue-600 font-medium">{lastOperation}</p>}
        {rotatingNodes.length > 0 && (
          <p className="text-red-600">Performing rotation on nodes: {rotatingNodes.join(", ")}</p>
        )}
      </div>
    </div>
  )
}
