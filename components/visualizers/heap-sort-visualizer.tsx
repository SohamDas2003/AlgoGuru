"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeapSortVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function HeapSortVisualizer({ isPlaying, speed, onStepChange }: HeapSortVisualizerProps) {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [heapifying, setHeapifying] = useState<number[]>([])
  const [sorted, setSorted] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [customInput, setCustomInput] = useState("")
  const [heapSize, setHeapSize] = useState(0)

  const resetVisualization = useCallback(() => {
    setHeapifying([])
    setSorted([])
    setCurrentStep(0)
    setIsComplete(false)
    setHeapSize(array.length)
    onStepChange(0)
  }, [onStepChange, array.length])

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 1)
    setArray(newArray)
    resetVisualization()
  }

  const setCustomArray = () => {
    try {
      const newArray = customInput
        .split(",")
        .map((num) => Number.parseInt(num.trim()))
        .filter((num) => !isNaN(num))
      if (newArray.length > 0) {
        setArray(newArray)
        resetVisualization()
      }
    } catch (error) {
      console.error("Invalid input")
    }
  }

  useEffect(() => {
    if (!isPlaying || isComplete) return

    const heapSortStep = () => {
      const n = array.length
      const maxSteps = n * Math.log2(n)

      if (currentStep >= maxSteps) {
        setIsComplete(true)
        setSorted(Array.from({ length: n }, (_, i) => i))
        setHeapifying([])
        return
      }

      // Simulate heapify process
      const heapifyIndex = Math.floor(Math.random() * heapSize)
      setHeapifying([heapifyIndex])

      // Simulate heap operations
      if (currentStep % 5 === 0 && heapSize > 1) {
        // Move max element to sorted position
        const newArray = [...array]
        ;[newArray[0], newArray[heapSize - 1]] = [newArray[heapSize - 1], newArray[0]]
        setArray(newArray)
        setSorted((prev) => [...prev, heapSize - 1])
        setHeapSize((prev) => prev - 1)
      }

      setCurrentStep((prev) => prev + 1)
      onStepChange(currentStep + 1)
    }

    const timer = setTimeout(heapSortStep, 1100 - speed)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, array, speed, isComplete, onStepChange, heapSize])

  const getBarColor = (index: number) => {
    if (sorted.includes(index)) return "bg-green-500"
    if (heapifying.includes(index)) return "bg-red-500"
    if (index >= heapSize) return "bg-gray-400"
    return "bg-orange-500"
  }

  const maxValue = Math.max(...array)

  // Calculate tree positions
  const getTreePosition = (index: number) => {
    const level = Math.floor(Math.log2(index + 1))
    const positionInLevel = index - (Math.pow(2, level) - 1)
    const totalPositionsInLevel = Math.pow(2, level)

    return {
      x: 50 + ((positionInLevel * 100) / totalPositionsInLevel) * 400,
      y: 50 + level * 60,
    }
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={generateRandomArray} variant="outline" size="sm">
            Generate Random Array
          </Button>
          <Button onClick={resetVisualization} variant="outline" size="sm">
            Reset
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Enter numbers separated by commas"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1"
          />
          <Button onClick={setCustomArray} variant="outline" size="sm">
            Set Array
          </Button>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="mb-8">
        <h4 className="text-center font-semibold mb-4">Array Representation</h4>
        <div className="flex items-end justify-center space-x-2 h-48">
          {array.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-12 transition-all duration-300 ${getBarColor(index)} rounded-t`}
                style={{ height: `${(value / maxValue) * 150}px` }}
              />
              <div className="text-sm font-semibold mt-2 text-gray-700">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Heap Tree Visualization */}
      <div className="mb-6">
        <h4 className="text-center font-semibold mb-4">Heap Tree Structure</h4>
        <div className="border rounded-lg bg-white h-64 relative overflow-hidden">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Draw edges */}
            {array.map((_, index) => {
              const leftChild = 2 * index + 1
              const rightChild = 2 * index + 2
              const parentPos = getTreePosition(index)

              return (
                <g key={`edges-${index}`}>
                  {leftChild < array.length && (
                    <line
                      x1={parentPos.x}
                      y1={parentPos.y}
                      x2={getTreePosition(leftChild).x}
                      y2={getTreePosition(leftChild).y}
                      stroke="#374151"
                      strokeWidth="2"
                    />
                  )}
                  {rightChild < array.length && (
                    <line
                      x1={parentPos.x}
                      y1={parentPos.y}
                      x2={getTreePosition(rightChild).x}
                      y2={getTreePosition(rightChild).y}
                      stroke="#374151"
                      strokeWidth="2"
                    />
                  )}
                </g>
              )
            })}

            {/* Draw nodes */}
            {array.map((value, index) => {
              const pos = getTreePosition(index)
              const color = sorted.includes(index)
                ? "#10b981"
                : heapifying.includes(index)
                  ? "#ef4444"
                  : index >= heapSize
                    ? "#9ca3af"
                    : "#f97316"

              return (
                <g key={`node-${index}`}>
                  <circle cx={pos.x} cy={pos.y} r="20" fill={color} stroke="#1f2937" strokeWidth="2" />
                  <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                    {value}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>Heap</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Heapifying</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>Excluded</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mt-4">
        {isComplete ? (
          <p className="text-green-600 font-semibold">Heap Sort Complete! 🎉</p>
        ) : (
          <p className="text-gray-600">Heap Size: {heapSize} | Building and extracting from max heap</p>
        )}
      </div>
    </div>
  )
}
