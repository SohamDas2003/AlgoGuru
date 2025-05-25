"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface QuickSortVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function QuickSortVisualizer({ isPlaying, speed, onStepChange }: QuickSortVisualizerProps) {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 5])
  const [comparing, setComparing] = useState<number[]>([])
  const [pivot, setPivot] = useState<number | null>(null)
  const [sorted, setSorted] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [customInput, setCustomInput] = useState("")
  const [partitionBounds, setPartitionBounds] = useState<{ low: number; high: number } | null>(null)

  const resetVisualization = useCallback(() => {
    setComparing([])
    setPivot(null)
    setSorted([])
    setCurrentStep(0)
    setIsComplete(false)
    setPartitionBounds(null)
    onStepChange(0)
  }, [onStepChange])

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1)
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

    const quickSortStep = () => {
      // Simplified quick sort visualization
      const n = array.length
      const maxSteps = n * Math.log2(n)

      if (currentStep >= maxSteps) {
        setIsComplete(true)
        setSorted(Array.from({ length: n }, (_, i) => i))
        setComparing([])
        setPivot(null)
        setPartitionBounds(null)
        return
      }

      // Simulate partitioning process
      const pivotIndex = Math.floor(Math.random() * array.length)
      setPivot(pivotIndex)

      const compareIndex1 = Math.floor(Math.random() * array.length)
      const compareIndex2 = Math.floor(Math.random() * array.length)
      setComparing([compareIndex1, compareIndex2])

      // Simulate swap if needed
      if (array[compareIndex1] > array[compareIndex2] && Math.random() > 0.5) {
        const newArray = [...array]
        ;[newArray[compareIndex1], newArray[compareIndex2]] = [newArray[compareIndex2], newArray[compareIndex1]]
        setArray(newArray)
      }

      setCurrentStep((prev) => prev + 1)
      onStepChange(currentStep + 1)
    }

    const timer = setTimeout(quickSortStep, 1100 - speed)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, array, speed, isComplete, onStepChange])

  const getBarColor = (index: number) => {
    if (sorted.includes(index)) return "bg-green-500"
    if (pivot === index) return "bg-purple-500"
    if (comparing.includes(index)) return "bg-red-500"
    return "bg-blue-500"
  }

  const maxValue = Math.max(...array)

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

      {/* Visualization */}
      <div className="flex items-end justify-center space-x-2 h-64 mb-4">
        {array.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 transition-all duration-300 ${getBarColor(index)} rounded-t`}
              style={{ height: `${(value / maxValue) * 200}px` }}
            />
            <div className="text-sm font-semibold mt-2 text-gray-700">{value}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Unsorted</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Pivot</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mt-4">
        {isComplete ? (
          <p className="text-green-600 font-semibold">Quick Sort Complete! 🎉</p>
        ) : (
          <p className="text-gray-600">
            {pivot !== null && `Pivot: ${array[pivot]} | `}
            {comparing.length > 0 && `Comparing positions ${comparing[0]} and ${comparing[1]}`}
          </p>
        )}
      </div>
    </div>
  )
}
