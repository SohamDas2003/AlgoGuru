"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MergeSortVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function MergeSortVisualizer({ isPlaying, speed, onStepChange }: MergeSortVisualizerProps) {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 5])
  const [leftArray, setLeftArray] = useState<number[]>([])
  const [rightArray, setRightArray] = useState<number[]>([])
  const [merging, setMerging] = useState<number[]>([])
  const [sorted, setSorted] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [customInput, setCustomInput] = useState("")
  const [currentLevel, setCurrentLevel] = useState(0)

  const resetVisualization = useCallback(() => {
    setLeftArray([])
    setRightArray([])
    setMerging([])
    setSorted([])
    setCurrentStep(0)
    setIsComplete(false)
    setCurrentLevel(0)
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

    const mergeSortStep = () => {
      const n = array.length
      const maxSteps = n * Math.log2(n)

      if (currentStep >= maxSteps) {
        setIsComplete(true)
        setSorted(Array.from({ length: n }, (_, i) => i))
        setMerging([])
        setLeftArray([])
        setRightArray([])
        return
      }

      // Simulate divide and merge process
      const mid = Math.floor(array.length / 2)
      setLeftArray(array.slice(0, mid))
      setRightArray(array.slice(mid))

      // Simulate merging
      const mergingIndices = Array.from({ length: Math.min(4, array.length) }, (_, i) => i)
      setMerging(mergingIndices)

      // Simulate partial sorting
      if (currentStep > maxSteps / 2) {
        const sortedIndices = Array.from({ length: Math.floor(currentStep / 2) }, (_, i) => i)
        setSorted(sortedIndices)
      }

      setCurrentStep((prev) => prev + 1)
      setCurrentLevel(Math.floor(currentStep / 4))
      onStepChange(currentStep + 1)
    }

    const timer = setTimeout(mergeSortStep, 1100 - speed)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, array, speed, isComplete, onStepChange])

  const getBarColor = (index: number) => {
    if (sorted.includes(index)) return "bg-green-500"
    if (merging.includes(index)) return "bg-yellow-500"
    if (leftArray.length > 0 && index < leftArray.length) return "bg-blue-500"
    if (rightArray.length > 0 && index >= array.length - rightArray.length) return "bg-red-500"
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
      <div className="space-y-6">
        {/* Main Array */}
        <div className="flex items-end justify-center space-x-2 h-64">
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

        {/* Sub-arrays */}
        {(leftArray.length > 0 || rightArray.length > 0) && (
          <div className="grid grid-cols-2 gap-8">
            {/* Left Array */}
            <div className="text-center">
              <h4 className="font-semibold mb-2 text-blue-600">Left Array</h4>
              <div className="flex justify-center space-x-1">
                {leftArray.map((value, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center text-sm"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Array */}
            <div className="text-center">
              <h4 className="font-semibold mb-2 text-red-600">Right Array</h4>
              <div className="flex justify-center space-x-1">
                {rightArray.map((value, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center text-sm"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Left Subarray</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Right Subarray</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Merging</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mt-4">
        {isComplete ? (
          <p className="text-green-600 font-semibold">Merge Sort Complete! 🎉</p>
        ) : (
          <p className="text-gray-600">Level {currentLevel} | Dividing and merging subarrays</p>
        )}
      </div>
    </div>
  )
}
