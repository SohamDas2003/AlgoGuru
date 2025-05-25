"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface QueueVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function QueueVisualizer({ isPlaying, speed, onStepChange }: QueueVisualizerProps) {
  const [queue, setQueue] = useState<number[]>([])
  const [inputValue, setInputValue] = useState("")
  const [lastOperation, setLastOperation] = useState<string>("")
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
  const [step, setStep] = useState(0)

  const enqueue = () => {
    const value = Number.parseInt(inputValue)
    if (!isNaN(value)) {
      setQueue((prev) => [...prev, value])
      setInputValue("")
      setLastOperation(`Enqueued ${value}`)
      setAnimatingIndex(queue.length)
      setStep((prev) => prev + 1)
      onStepChange(step + 1)

      setTimeout(() => setAnimatingIndex(null), 500)
    }
  }

  const dequeue = () => {
    if (queue.length > 0) {
      const dequeuedValue = queue[0]
      setAnimatingIndex(0)
      setLastOperation(`Dequeued ${dequeuedValue}`)

      setTimeout(() => {
        setQueue((prev) => prev.slice(1))
        setAnimatingIndex(null)
        setStep((prev) => prev + 1)
        onStepChange(step + 1)
      }, 300)
    }
  }

  const front = () => {
    if (queue.length > 0) {
      setLastOperation(`Front element: ${queue[0]}`)
      setAnimatingIndex(0)
      setTimeout(() => setAnimatingIndex(null), 1000)
    } else {
      setLastOperation("Queue is empty")
    }
  }

  const clear = () => {
    setQueue([])
    setLastOperation("Queue cleared")
    setAnimatingIndex(null)
    setStep(0)
    onStepChange(0)
  }

  const createSampleQueue = () => {
    const sampleValues = [10, 20, 30, 40, 50]
    setQueue(sampleValues)
    setLastOperation("Sample queue created")
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
            onKeyPress={(e) => e.key === "Enter" && enqueue()}
          />
          <Button onClick={enqueue} variant="outline" size="sm" disabled={!inputValue}>
            Enqueue
          </Button>
          <Button onClick={dequeue} variant="outline" size="sm" disabled={queue.length === 0}>
            Dequeue
          </Button>
          <Button onClick={front} variant="outline" size="sm" disabled={queue.length === 0}>
            Front
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={createSampleQueue} variant="outline" size="sm">
            Create Sample Queue
          </Button>
          <Button onClick={clear} variant="outline" size="sm">
            Clear
          </Button>
        </div>
      </div>

      {/* Queue Visualization */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Queue Container */}
          <div className="flex items-center border-4 border-gray-400 bg-gray-50 min-w-[400px] h-20 p-2 rounded-lg">
            {queue.length === 0 ? (
              <div className="w-full text-center text-gray-500">Queue is empty</div>
            ) : (
              queue.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className={`
                    w-16 h-12 bg-blue-500 text-white rounded flex items-center justify-center font-bold text-lg mr-2
                    transition-all duration-300 transform
                    ${animatingIndex === index ? "scale-110 bg-red-500" : ""}
                    ${index === 0 ? "ring-2 ring-yellow-400" : ""}
                  `}
                >
                  {value}
                </div>
              ))
            )}
          </div>

          {/* Front and Rear Pointers */}
          {queue.length > 0 && (
            <>
              <div className="absolute -top-8 left-2 flex items-center">
                <div className="text-sm font-semibold text-green-600">FRONT</div>
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-green-600 ml-1"></div>
              </div>
              <div className="absolute -bottom-8 flex items-center" style={{ left: `${queue.length * 72 - 50}px` }}>
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-purple-600 mr-1"></div>
                <div className="text-sm font-semibold text-purple-600">REAR</div>
              </div>
            </>
          )}
        </div>

        {/* Queue Info */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-lg font-semibold">Queue Size: {queue.length}</div>
          {lastOperation && <div className="text-blue-600 font-medium">{lastOperation}</div>}
        </div>

        {/* Operations Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-1">Enqueue Operation</h4>
            <p className="text-blue-600">Adds element to the rear of the queue</p>
            <p className="text-xs text-blue-500 mt-1">Time: O(1)</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-1">Dequeue Operation</h4>
            <p className="text-red-600">Removes element from the front of the queue</p>
            <p className="text-xs text-red-500 mt-1">Time: O(1)</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-1">Front Operation</h4>
            <p className="text-yellow-600">Views the front element without removing it</p>
            <p className="text-xs text-yellow-500 mt-1">Time: O(1)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
