"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Node {
  id: number
  x: number
  y: number
  distance: number
  visited: boolean
  previous: number | null
}

interface Edge {
  from: number
  to: number
  weight: number
}

interface DijkstraVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function DijkstraVisualizer({ isPlaying, speed, onStepChange }: DijkstraVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, x: 100, y: 100, distance: 0, visited: false, previous: null },
    { id: 1, x: 300, y: 50, distance: Number.POSITIVE_INFINITY, visited: false, previous: null },
    { id: 2, x: 300, y: 150, distance: Number.POSITIVE_INFINITY, visited: false, previous: null },
    { id: 3, x: 500, y: 100, distance: Number.POSITIVE_INFINITY, visited: false, previous: null },
  ])

  const [edges] = useState<Edge[]>([
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 3, weight: 3 },
  ])

  const [currentNode, setCurrentNode] = useState<number | null>(null)
  const [startNode, setStartNode] = useState("0")
  const [isComplete, setIsComplete] = useState(false)
  const [step, setStep] = useState(0)

  const resetVisualization = () => {
    const startId = Number.parseInt(startNode)
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        distance: node.id === startId ? 0 : Number.POSITIVE_INFINITY,
        visited: false,
        previous: null,
      })),
    )
    setCurrentNode(null)
    setIsComplete(false)
    setStep(0)
    onStepChange(0)
  }

  useEffect(() => {
    if (!isPlaying || isComplete) return

    const dijkstraStep = () => {
      setNodes((prev) => {
        const unvisited = prev.filter((node) => !node.visited)
        if (unvisited.length === 0) {
          setIsComplete(true)
          setCurrentNode(null)
          return prev
        }

        // Find unvisited node with minimum distance
        const current = unvisited.reduce((min, node) => (node.distance < min.distance ? node : min))

        setCurrentNode(current.id)

        // Update distances to neighbors
        const newNodes = prev.map((node) => {
          if (node.id === current.id) {
            return { ...node, visited: true }
          }

          // Check if this node is a neighbor of current
          const edge = edges.find(
            (e) => (e.from === current.id && e.to === node.id) || (e.to === current.id && e.from === node.id),
          )

          if (edge && !node.visited) {
            const newDistance = current.distance + edge.weight
            if (newDistance < node.distance) {
              return {
                ...node,
                distance: newDistance,
                previous: current.id,
              }
            }
          }

          return node
        })

        return newNodes
      })

      setStep((prev) => prev + 1)
      onStepChange(step + 1)
    }

    const timer = setTimeout(dijkstraStep, 1100 - speed)
    return () => clearTimeout(timer)
  }, [isPlaying, step, speed, isComplete, onStepChange, edges])

  const getNodeColor = (node: Node) => {
    if (node.visited) return "#10b981" // green
    if (node.id === currentNode) return "#ef4444" // red
    if (node.distance !== Number.POSITIVE_INFINITY) return "#f59e0b" // yellow
    return "#6b7280" // gray
  }

  const getShortestPath = (targetId: number): number[] => {
    const path: number[] = []
    let current: number | null = targetId

    while (current !== null) {
      path.unshift(current)
      const node = nodes.find((n) => n.id === current)
      current = node?.previous || null
    }

    return path
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Start node"
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            className="w-32"
            min="0"
            max="3"
          />
          <Button onClick={resetVisualization} variant="outline" size="sm">
            Reset with Start Node
          </Button>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="border rounded-lg bg-white mb-6">
        <svg width="600" height="250" className="w-full">
          {/* Draw edges */}
          {edges.map((edge, index) => {
            const fromNode = nodes.find((n) => n.id === edge.from)!
            const toNode = nodes.find((n) => n.id === edge.to)!

            return (
              <g key={index}>
                <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke="#374151" strokeWidth="2" />
                {/* Edge weight */}
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 10}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="12"
                  fontWeight="bold"
                  className="bg-white"
                >
                  {edge.weight}
                </text>
              </g>
            )
          })}

          {/* Draw nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r="25" fill={getNodeColor(node)} stroke="#1f2937" strokeWidth="2" />
              <text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                {node.id}
              </text>
              {/* Distance label */}
              <text x={node.x} y={node.y + 45} textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">
                {node.distance === Number.POSITIVE_INFINITY ? "∞" : node.distance}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Distance Table */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold mb-2">Distance Table</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Node</th>
                  <th className="p-2 text-left">Distance</th>
                  <th className="p-2 text-left">Previous</th>
                  <th className="p-2 text-left">Visited</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => (
                  <tr key={node.id} className={node.id === currentNode ? "bg-yellow-50" : ""}>
                    <td className="p-2 font-medium">{node.id}</td>
                    <td className="p-2">{node.distance === Number.POSITIVE_INFINITY ? "∞" : node.distance}</td>
                    <td className="p-2">{node.previous !== null ? node.previous : "-"}</td>
                    <td className="p-2">{node.visited ? "✓" : "✗"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Shortest Paths</h4>
          <div className="space-y-2 text-sm">
            {nodes.map((node) => {
              if (node.id === Number.parseInt(startNode)) return null
              const path = getShortestPath(node.id)
              return (
                <div key={node.id} className="flex justify-between">
                  <span>To node {node.id}:</span>
                  <span className="font-mono">
                    {node.distance === Number.POSITIVE_INFINITY ? "No path" : `${path.join(" → ")} (${node.distance})`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>In Queue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Visited</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mt-4">
        {isComplete ? (
          <p className="text-green-600 font-semibold">Dijkstra's Algorithm Complete! 🎉</p>
        ) : (
          <p className="text-gray-600">{currentNode !== null && `Processing node ${currentNode}`}</p>
        )}
      </div>
    </div>
  )
}
