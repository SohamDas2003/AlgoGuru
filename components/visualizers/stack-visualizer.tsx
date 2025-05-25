"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StackVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function StackVisualizer({ isPlaying, speed, onStepChange }: StackVisualizerProps) {
  const [stack, setStack] = useState<number[]>([])
  const [inputValue, setInputValue] = useState("")
  const [lastOperation, setLastOperation] = useState<string>("")
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
  const [step, setStep] = useState(0)

  const push = () => {
    const value = Number.parseInt(inputValue)
    if (!isNaN(value)) {
      setStack((prev) => [...prev, value])
      setInputValue("")
      setLastOperation(`Pushed ${value}`)
      setAnimatingIndex(stack.length)
      setStep((prev) => prev + 1)
      onStepChange(step + 1)

      setTimeout(() => setAnimatingIndex(null), 500)
    }
  }

  const pop = () => {
    if (stack.length > 0) {
      const poppedValue = stack[stack.length - 1]
      setAnimatingIndex(stack.length - 1)
      setLastOperation(`Popped ${poppedValue}`)

      setTimeout(() => {
        setStack((prev) => prev.slice(0, -1))
        setAnimatingIndex(null)
        setStep((prev) => prev + 1)
        onStepChange(step + 1)
      }, 300)
    }
  }

  const peek = () => {
    if (stack.length > 0) {
      setLastOperation(`Top element: ${stack[stack.length - 1]}`)
      setAnimatingIndex(stack.length - 1)
      setTimeout(() => setAnimatingIndex(null), 1000)
    } else {
      setLastOperation("Stack is empty")
    }
  }

  const clear = () => {
    setStack([])
    setLastOperation("Stack cleared")
    setAnimatingIndex(null)
    setStep(0)
    onStepChange(0)
  }

  const createSampleStack = () => {
    const sampleValues = [10, 20, 30, 40, 50]
    setStack(sampleValues)
    setLastOperation("Sample stack created")
    setStep(sampleValues.length)
    onStepChange(sampleValues.length)
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
            onKeyPress={(e) => e.key === "Enter" && push()}
          />
          <Button onClick={push} variant="outline" size="sm" disabled={!inputValue}>
            Push
          </Button>
          <Button onClick={pop} variant="outline" size="sm" disabled={stack.length === 0}>
            Pop
          </Button>
          <Button onClick={peek} variant="outline" size="sm" disabled={stack.length === 0}>
            Peek
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={createSampleStack} variant="outline" size="sm">
            Create Sample Stack
          </Button>
          <Button onClick={clear} variant="outline" size="sm">
            Clear
          </Button>
        </div>
      </div>

      {/* Stack Visualization */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Stack Container */}
          <div className="w-32 border-l-4 border-r-4 border-b-4 border-gray-400 bg-gray-50 min-h-[300px] flex flex-col-reverse items-center justify-start p-2">
            {stack.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={`
                  w-24 h-12 bg-blue-500 text-white rounded flex items-center justify-center font-bold text-lg mb-1
                  transition-all duration-300 transform
                  ${animatingIndex === index ? "scale-110 bg-red-500" : ""}
                  ${index === stack.length - 1 ? "ring-2 ring-yellow-400" : ""}
                `}
              >
                {value}
              </div>
            ))}
          </div>

          {/* Stack Pointer */}
          {stack.length > 0 && (
            <div className="absolute -right-16 flex items-center" style={{ bottom: `${stack.length * 52 - 20}px` }}>
              <div className="text-sm font-semibold text-gray-600 mr-2">TOP</div>
              <div className="w-0 h-0 border-l-8 border-l-gray-600 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          )}
        </div>

        {/* Stack Info */}
        <div className="mt-6 text-center space-y-2">
          <div className="text-lg font-semibold">Stack Size: {stack.length}</div>
          {lastOperation && <div className="text-blue-600 font-medium">{lastOperation}</div>}
          {stack.length === 0 && <div className="text-gray-500">Stack is empty</div>}
        </div>

        {/* Operations Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-1">Push Operation</h4>
            <p className="text-blue-600">Adds element to the top of the stack</p>
            <p className="text-xs text-blue-500 mt-1">Time: O(1)</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-1">Pop Operation</h4>
            <p className="text-red-600">Removes element from the top of the stack</p>
            <p className="text-xs text-red-500 mt-1">Time: O(1)</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-1">Peek Operation</h4>
            <p className="text-yellow-600">Views the top element without removing it</p>
            <p className="text-xs text-yellow-500 mt-1">Time: O(1)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
