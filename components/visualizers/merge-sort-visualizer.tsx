"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MergeSortVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

interface Step {
  array: number[]
  leftIndices: number[]
  rightIndices: number[]
  mergedIndices: number[]
  description: string
}

export function MergeSortVisualizer({ isPlaying, speed, onStepChange }: MergeSortVisualizerProps) {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 5])
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [customInput, setCustomInput] = useState("")
  const [leftIndices, setLeftIndices] = useState<number[]>([])
  const [rightIndices, setRightIndices] = useState<number[]>([])
  const [mergedIndices, setMergedIndices] = useState<number[]>([])

  const resetVisualization = useCallback(() => {
    setSteps([])
    setCurrentStep(0)
    setIsComplete(false)
    setLeftIndices([])
    setRightIndices([])
    setMergedIndices([])
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

  const startMergeSort = () => {
    const newSteps = mergeSortWithSteps([...array])
    setSteps(newSteps)
    setCurrentStep(0)
    setIsComplete(false)
  }

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length || steps.length === 0) {
      if (currentStep >= steps.length && steps.length > 0) {
        setIsComplete(true)
      }
      return
    }

    const timer = setTimeout(() => {
      const step = steps[currentStep]
      setArray(step.array)
      setLeftIndices(step.leftIndices)
      setRightIndices(step.rightIndices)
      setMergedIndices(step.mergedIndices)
      setCurrentStep((prev) => prev + 1)
      onStepChange(currentStep + 1)
    }, 1100 - speed)

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, steps, speed, onStepChange])

  const mergeSortWithSteps = (arr: number[]): Step[] => {
    const steps: Step[] = []
    const originalArray = [...arr]

    function mergeSortHelper(array: number[], startIdx: number, level: number): number[] {
      if (array.length <= 1) return array

      const mid = Math.floor(array.length / 2)
      const left = mergeSortHelper(array.slice(0, mid), startIdx, level + 1)
      const right = mergeSortHelper(array.slice(mid), startIdx + mid, level + 1)

      const merged: number[] = []
      let i = 0,
        j = 0

      // Create step for merging process
      const leftIndices = Array.from({ length: left.length }, (_, idx) => startIdx + idx)
      const rightIndices = Array.from({ length: right.length }, (_, idx) => startIdx + left.length + idx)

      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          merged.push(left[i++])
        } else {
          merged.push(right[j++])
        }
      }

      while (i < left.length) merged.push(left[i++])
      while (j < right.length) merged.push(right[j++])

      // Update the array with merged result
      const updatedArray = [...originalArray]
      for (let k = 0; k < merged.length; k++) {
        updatedArray[startIdx + k] = merged[k]
      }

      const mergedIndices = Array.from({ length: merged.length }, (_, idx) => startIdx + idx)

      steps.push({
        array: [...updatedArray],
        leftIndices,
        rightIndices,
        mergedIndices,
        description: `Merging subarrays of size ${left.length} and ${right.length}`,
      })

      return merged
    }

    mergeSortHelper(arr, 0, 0)
    return steps
  }

  const getBarColor = (index: number) => {
    if (mergedIndices.includes(index)) return "bg-green-500"
    if (leftIndices.includes(index)) return "bg-blue-500"
    if (rightIndices.includes(index)) return "bg-red-500"
    return "bg-gray-400"
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
          <Button onClick={startMergeSort} variant="outline" size="sm">
            Start Merge Sort
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
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>Unsorted</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Left Subarray</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Right Subarray</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Merged</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mt-4">
        {isComplete ? (
          <p className="text-green-600 font-semibold">Merge Sort Complete! 🎉</p>
        ) : steps.length > 0 && currentStep < steps.length ? (
          <p className="text-gray-600">{steps[currentStep]?.description || "Processing merge sort..."}</p>
        ) : (
          <p className="text-gray-600">Click "Start Merge Sort" to begin the visualization</p>
        )}
      </div>

      {/* Algorithm Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">Divide Phase</h4>
          <p className="text-blue-600">Split array into smaller subarrays</p>
          <p className="text-xs text-blue-500 mt-1">Recursively divide until size 1</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-1">Conquer Phase</h4>
          <p className="text-red-600">Merge subarrays in sorted order</p>
          <p className="text-xs text-red-500 mt-1">Compare and merge elements</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-1">Stable Sort</h4>
          <p className="text-green-600">Maintains relative order of equal elements</p>
          <p className="text-xs text-green-500 mt-1">Guaranteed O(n log n) performance</p>
        </div>
      </div>
    </div>
  )
}
