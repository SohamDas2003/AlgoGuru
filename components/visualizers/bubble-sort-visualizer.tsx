"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BubbleSortVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function BubbleSortVisualizer({ isPlaying, speed, onStepChange }: BubbleSortVisualizerProps) {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [comparing, setComparing] = useState<number[]>([])
  const [sorted, setSorted] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [customInput, setCustomInput] = useState("")

  const resetVisualization = useCallback(() => {
    setComparing([])
    setSorted([])
    setCurrentStep(0)
    setIsComplete(false)
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

    const bubbleSortStep = () => {
      const n = array.length
      const totalSteps = (n * (n - 1)) / 2

      if (currentStep >= totalSteps) {
        setIsComplete(true)
        setSorted(Array.from({ length: n }, (_, i) => i))
        setComparing([])
        return
      }

      // Calculate current i and j based on step
      let step = currentStep
      let i = 0
      while (step >= n - i - 1) {
        step -= n - i - 1
        i++
      }
      const j = step

      setComparing([j, j + 1])

      // Perform swap if needed
      if (array[j] > array[j + 1]) {
        const newArray = [...array]
        ;[newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]]
        setArray(newArray)
      }

      // Update sorted elements
      if (j === n - i - 2) {
        setSorted((prev) => [...prev, n - i - 1])
      }

      setCurrentStep((prev) => prev + 1)
      onStepChange(currentStep + 1)
    }

    const timer = setTimeout(bubbleSortStep, 1100 - speed)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, array, speed, isComplete, onStepChange])

  const getBarColor = (index: number) => {
    if (sorted.includes(index)) return "bg-green-500"
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
            placeholder="Enter numbers separated by commas (e.g., 64,34,25,12)"
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
          <p className="text-green-600 font-semibold">Sorting Complete! 🎉</p>
        ) : (
          <p className="text-gray-600">
            {comparing.length > 0 && `Comparing elements at positions ${comparing[0]} and ${comparing[1]}`}
          </p>
        )}
      </div>
    </div>
  )
}
