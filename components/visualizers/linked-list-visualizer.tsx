"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ListNode {
  value: number
  next: ListNode | null
  id: string
}

interface LinkedListVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function LinkedListVisualizer({ isPlaying, speed, onStepChange }: LinkedListVisualizerProps) {
  const [head, setHead] = useState<ListNode | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [insertPosition, setInsertPosition] = useState("")
  const [lastOperation, setLastOperation] = useState<string>("")
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null)
  const [step, setStep] = useState(0)

  const insertAtHead = () => {
    const value = Number.parseInt(inputValue)
    if (!isNaN(value)) {
      const newNode: ListNode = {
        value,
        next: head,
        id: `node-${Date.now()}`,
      }
      setHead(newNode)
      setInputValue("")
      setLastOperation(`Inserted ${value} at head`)
      setHighlightedNode(newNode.id)
      setStep((prev) => prev + 1)
      onStepChange(step + 1)

      setTimeout(() => setHighlightedNode(null), 1000)
    }
  }

  const insertAtTail = () => {
    const value = Number.parseInt(inputValue)
    if (!isNaN(value)) {
      const newNode: ListNode = {
        value,
        next: null,
        id: `node-${Date.now()}`,
      }

      if (!head) {
        setHead(newNode)
      } else {
        let current = head
        while (current.next) {
          current = current.next
        }
        current.next = newNode
      }

      setInputValue("")
      setLastOperation(`Inserted ${value} at tail`)
      setHighlightedNode(newNode.id)
      setStep((prev) => prev + 1)
      onStepChange(step + 1)

      setTimeout(() => setHighlightedNode(null), 1000)
    }
  }

  const insertAtPosition = () => {
    const value = Number.parseInt(inputValue)
    const position = Number.parseInt(insertPosition)

    if (!isNaN(value) && !isNaN(position) && position >= 0) {
      const newNode: ListNode = {
        value,
        next: null,
        id: `node-${Date.now()}`,
      }

      if (position === 0) {
        newNode.next = head
        setHead(newNode)
      } else {
        let current = head
        for (let i = 0; i < position - 1 && current; i++) {
          current = current.next
        }
        if (current) {
          newNode.next = current.next
          current.next = newNode
        }
      }

      setInputValue("")
      setInsertPosition("")
      setLastOperation(`Inserted ${value} at position ${position}`)
      setHighlightedNode(newNode.id)
      setStep((prev) => prev + 1)
      onStepChange(step + 1)

      setTimeout(() => setHighlightedNode(null), 1000)
    }
  }

  const deleteNode = () => {
    const value = Number.parseInt(inputValue)
    if (!isNaN(value) && head) {
      if (head.value === value) {
        setHead(head.next)
        setLastOperation(`Deleted ${value} from head`)
      } else {
        let current = head
        while (current.next && current.next.value !== value) {
          current = current.next
        }
        if (current.next) {
          current.next = current.next.next
          setLastOperation(`Deleted ${value}`)
        } else {
          setLastOperation(`Value ${value} not found`)
        }
      }
      setInputValue("")
      setStep((prev) => prev + 1)
      onStepChange(step + 1)
    }
  }

  const search = () => {
    const value = Number.parseInt(inputValue)
    if (!isNaN(value)) {
      let current = head
      let position = 0
      while (current) {
        if (current.value === value) {
          setLastOperation(`Found ${value} at position ${position}`)
          setHighlightedNode(current.id)
          setTimeout(() => setHighlightedNode(null), 2000)
          return
        }
        current = current.next
        position++
      }
      setLastOperation(`Value ${value} not found`)
    }
  }

  const clear = () => {
    setHead(null)
    setLastOperation("List cleared")
    setHighlightedNode(null)
    setStep(0)
    onStepChange(0)
  }

  const createSampleList = () => {
    let newHead: ListNode | null = null
    const values = [10, 20, 30, 40, 50]

    for (let i = values.length - 1; i >= 0; i--) {
      const newNode: ListNode = {
        value: values[i],
        next: newHead,
        id: `node-${Date.now()}-${i}`,
      }
      newHead = newNode
    }

    setHead(newHead)
    setLastOperation("Sample list created")
    setStep(values.length)
    onStepChange(values.length)
  }

  const getListAsArray = (): ListNode[] => {
    const result: ListNode[] = []
    let current = head
    while (current) {
      result.push(current)
      current = current.next
    }
    return result
  }

  const listArray = getListAsArray()

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Input
            type="number"
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
          />
          <Button onClick={insertAtHead} variant="outline" size="sm" disabled={!inputValue}>
            Insert at Head
          </Button>
          <Button onClick={insertAtTail} variant="outline" size="sm" disabled={!inputValue}>
            Insert at Tail
          </Button>
          <Button onClick={deleteNode} variant="outline" size="sm" disabled={!inputValue}>
            Delete
          </Button>
          <Button onClick={search} variant="outline" size="sm" disabled={!inputValue}>
            Search
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Position"
            value={insertPosition}
            onChange={(e) => setInsertPosition(e.target.value)}
            className="w-24"
          />
          <Button onClick={insertAtPosition} variant="outline" size="sm" disabled={!inputValue || !insertPosition}>
            Insert at Position
          </Button>
          <Button onClick={createSampleList} variant="outline" size="sm">
            Create Sample List
          </Button>
          <Button onClick={clear} variant="outline" size="sm">
            Clear
          </Button>
        </div>
      </div>

      {/* Linked List Visualization */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-4 min-h-[100px] overflow-x-auto pb-4">
          {listArray.length === 0 ? (
            <div className="text-gray-500 text-center py-8">Linked List is empty</div>
          ) : (
            <>
              {/* Head pointer */}
              <div className="flex flex-col items-center">
                <div className="text-sm font-semibold text-green-600 mb-2">HEAD</div>
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-8 border-b-green-600"></div>
              </div>

              {listArray.map((node, index) => (
                <div key={node.id} className="flex items-center">
                  {/* Node */}
                  <div
                    className={`
                    flex border-2 border-gray-400 bg-white rounded-lg overflow-hidden
                    transition-all duration-300
                    ${highlightedNode === node.id ? "ring-4 ring-yellow-400 bg-yellow-50" : ""}
                  `}
                  >
                    {/* Data part */}
                    <div className="w-16 h-12 bg-blue-500 text-white flex items-center justify-center font-bold">
                      {node.value}
                    </div>
                    {/* Pointer part */}
                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
                      {node.next ? (
                        <div className="w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                      ) : (
                        <div className="text-red-500 font-bold">∅</div>
                      )}
                    </div>
                  </div>

                  {/* Arrow between nodes */}
                  {index < listArray.length - 1 && (
                    <div className="w-8 h-0 border-t-2 border-gray-400 border-dashed mx-2"></div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* List Info */}
        <div className="mt-6 text-center space-y-2">
          <div className="text-lg font-semibold">List Size: {listArray.length}</div>
          {lastOperation && <div className="text-blue-600 font-medium">{lastOperation}</div>}
        </div>

        {/* Operations Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-1">Insert at Head</h4>
            <p className="text-green-600">Add new node at the beginning</p>
            <p className="text-xs text-green-500 mt-1">Time: O(1)</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-1">Insert at Tail</h4>
            <p className="text-blue-600">Add new node at the end</p>
            <p className="text-xs text-blue-500 mt-1">Time: O(n)</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-1">Delete Node</h4>
            <p className="text-red-600">Remove node with given value</p>
            <p className="text-xs text-red-500 mt-1">Time: O(n)</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-1">Search</h4>
            <p className="text-yellow-600">Find node with given value</p>
            <p className="text-xs text-yellow-500 mt-1">Time: O(n)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
