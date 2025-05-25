"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HashEntry {
  key: string
  value: string
  hash: number
}

interface HashTableVisualizerProps {
  isPlaying: boolean
  speed: number
  onStepChange: (step: number) => void
}

export function HashTableVisualizer({ isPlaying, speed, onStepChange }: HashTableVisualizerProps) {
  const [table, setTable] = useState<(HashEntry[] | null)[]>(Array(8).fill(null))
  const [keyInput, setKeyInput] = useState("")
  const [valueInput, setValueInput] = useState("")
  const [lastOperation, setLastOperation] = useState<string>("")
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null)
  const [step, setStep] = useState(0)

  const hashFunction = (key: string): number => {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % table.length
    }
    return hash
  }

  const insert = () => {
    if (!keyInput || !valueInput) return

    const hash = hashFunction(keyInput)
    const newEntry: HashEntry = {
      key: keyInput,
      value: valueInput,
      hash,
    }

    setTable((prev) => {
      const newTable = [...prev]
      if (!newTable[hash]) {
        newTable[hash] = []
      }

      // Check if key already exists
      const existingIndex = newTable[hash]!.findIndex((entry) => entry.key === keyInput)
      if (existingIndex !== -1) {
        newTable[hash]![existingIndex] = newEntry
        setLastOperation(`Updated key "${keyInput}" with value "${valueInput}"`)
      } else {
        newTable[hash]!.push(newEntry)
        setLastOperation(`Inserted key "${keyInput}" with value "${valueInput}" at slot ${hash}`)
      }

      return newTable
    })

    setHighlightedSlot(hash)
    setKeyInput("")
    setValueInput("")
    setStep((prev) => prev + 1)
    onStepChange(step + 1)

    setTimeout(() => setHighlightedSlot(null), 1500)
  }

  const search = () => {
    if (!keyInput) return

    const hash = hashFunction(keyInput)
    const bucket = table[hash]

    if (bucket) {
      const entry = bucket.find((entry) => entry.key === keyInput)
      if (entry) {
        setLastOperation(`Found key "${keyInput}" with value "${entry.value}" at slot ${hash}`)
        setHighlightedSlot(hash)
        setTimeout(() => setHighlightedSlot(null), 2000)
        return
      }
    }

    setLastOperation(`Key "${keyInput}" not found`)
    setKeyInput("")
  }

  const deleteKey = () => {
    if (!keyInput) return

    const hash = hashFunction(keyInput)
    const bucket = table[hash]

    if (bucket) {
      const entryIndex = bucket.findIndex((entry) => entry.key === keyInput)
      if (entryIndex !== -1) {
        setTable((prev) => {
          const newTable = [...prev]
          newTable[hash] = bucket.filter((_, index) => index !== entryIndex)
          if (newTable[hash]!.length === 0) {
            newTable[hash] = null
          }
          return newTable
        })
        setLastOperation(`Deleted key "${keyInput}" from slot ${hash}`)
        setHighlightedSlot(hash)
        setTimeout(() => setHighlightedSlot(null), 1500)
      } else {
        setLastOperation(`Key "${keyInput}" not found`)
      }
    } else {
      setLastOperation(`Key "${keyInput}" not found`)
    }

    setKeyInput("")
    setStep((prev) => prev + 1)
    onStepChange(step + 1)
  }

  const clear = () => {
    setTable(Array(8).fill(null))
    setLastOperation("Hash table cleared")
    setHighlightedSlot(null)
    setStep(0)
    onStepChange(0)
  }

  const createSampleTable = () => {
    const sampleData = [
      { key: "apple", value: "fruit" },
      { key: "car", value: "vehicle" },
      { key: "book", value: "object" },
      { key: "sun", value: "star" },
      { key: "water", value: "liquid" },
    ]

    const newTable: (HashEntry[] | null)[] = Array(8).fill(null)

    sampleData.forEach(({ key, value }) => {
      const hash = hashFunction(key)
      const entry: HashEntry = { key, value, hash }

      if (!newTable[hash]) {
        newTable[hash] = []
      }
      newTable[hash]!.push(entry)
    })

    setTable(newTable)
    setLastOperation("Sample hash table created")
    setStep(sampleData.length)
    onStepChange(sampleData.length)
  }

  const getLoadFactor = () => {
    const totalEntries = table.reduce((count, bucket) => {
      return count + (bucket ? bucket.length : 0)
    }, 0)
    return (totalEntries / table.length).toFixed(2)
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Key" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} className="w-32" />
          <Input
            placeholder="Value"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            className="w-32"
          />
          <Button onClick={insert} variant="outline" size="sm" disabled={!keyInput || !valueInput}>
            Insert
          </Button>
          <Button onClick={search} variant="outline" size="sm" disabled={!keyInput}>
            Search
          </Button>
          <Button onClick={deleteKey} variant="outline" size="sm" disabled={!keyInput}>
            Delete
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={createSampleTable} variant="outline" size="sm">
            Create Sample Table
          </Button>
          <Button onClick={clear} variant="outline" size="sm">
            Clear
          </Button>
        </div>
      </div>

      {/* Hash Table Visualization */}
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 gap-2 w-full max-w-2xl">
          {table.map((bucket, index) => (
            <div
              key={index}
              className={`
                flex items-center border-2 rounded-lg p-3 min-h-[60px]
                transition-all duration-300
                ${highlightedSlot === index ? "border-yellow-400 bg-yellow-50" : "border-gray-300 bg-white"}
              `}
            >
              {/* Slot Index */}
              <div className="w-12 h-12 bg-gray-600 text-white rounded flex items-center justify-center font-bold mr-4">
                {index}
              </div>

              {/* Bucket Contents */}
              <div className="flex-1">
                {!bucket || bucket.length === 0 ? (
                  <div className="text-gray-400 italic">Empty</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {bucket.map((entry, entryIndex) => (
                      <div
                        key={entryIndex}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {entry.key}: {entry.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hash Function Indicator */}
              {bucket && bucket.length > 0 && (
                <div className="text-xs text-gray-500 ml-2">
                  hash({bucket[0].key}) = {index}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hash Table Info */}
        <div className="mt-6 text-center space-y-2">
          <div className="text-lg font-semibold">Load Factor: {getLoadFactor()}</div>
          <div className="text-sm text-gray-600">
            Total Slots: {table.length} | Occupied Slots: {table.filter((bucket) => bucket && bucket.length > 0).length}
          </div>
          {lastOperation && <div className="text-blue-600 font-medium">{lastOperation}</div>}
        </div>

        {/* Hash Function Info */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg w-full max-w-2xl">
          <h4 className="font-semibold mb-2">Hash Function</h4>
          <p className="text-sm text-gray-600 mb-2">
            Simple character sum modulo table size: hash(key) = (sum of ASCII values) % {table.length}
          </p>
          {keyInput && (
            <p className="text-sm text-blue-600">
              hash("{keyInput}") = {hashFunction(keyInput)}
            </p>
          )}
        </div>

        {/* Operations Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-1">Insert Operation</h4>
            <p className="text-green-600">Add key-value pair to hash table</p>
            <p className="text-xs text-green-500 mt-1">Average Time: O(1)</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-1">Search Operation</h4>
            <p className="text-blue-600">Find value by key</p>
            <p className="text-xs text-blue-500 mt-1">Average Time: O(1)</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-1">Delete Operation</h4>
            <p className="text-red-600">Remove key-value pair</p>
            <p className="text-xs text-red-500 mt-1">Average Time: O(1)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
