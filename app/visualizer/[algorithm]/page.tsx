"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, SkipForward, Home } from "lucide-react"
import Link from "next/link"
import { BubbleSortVisualizer } from "@/components/visualizers/bubble-sort-visualizer"
import { BSTVisualizer } from "@/components/visualizers/bst-visualizer"
import { StackVisualizer } from "@/components/visualizers/stack-visualizer"
import { QuickSortVisualizer } from "@/components/visualizers/quick-sort-visualizer"
import { MergeSortVisualizer } from "@/components/visualizers/merge-sort-visualizer"
import { HeapSortVisualizer } from "@/components/visualizers/heap-sort-visualizer"
import { AVLTreeVisualizer } from "@/components/visualizers/avl-tree-visualizer"
import { DijkstraVisualizer } from "@/components/visualizers/dijkstra-visualizer"
import { QueueVisualizer } from "@/components/visualizers/queue-visualizer"
import { LinkedListVisualizer } from "@/components/visualizers/linked-list-visualizer"
import { HashTableVisualizer } from "@/components/visualizers/hash-table-visualizer"

interface AlgorithmPageProps {
  params: {
    algorithm: string
  }
}

const algorithmData: Record<string, any> = {
  "bubble-sort": {
    name: "Bubble Sort",
    description:
      "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    difficulty: "Easy",
    category: "Sorting",
    component: BubbleSortVisualizer,
  },
  "quick-sort": {
    name: "Quick Sort",
    description:
      "An efficient divide-and-conquer algorithm that picks a pivot element and partitions the array around it.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    difficulty: "Medium",
    category: "Sorting",
    component: QuickSortVisualizer,
  },
  "merge-sort": {
    name: "Merge Sort",
    description:
      "A stable divide-and-conquer algorithm that divides the array into halves and merges them in sorted order.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    difficulty: "Medium",
    category: "Sorting",
    component: MergeSortVisualizer,
  },
  "heap-sort": {
    name: "Heap Sort",
    description: "A comparison-based sorting algorithm that uses a binary heap data structure.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    difficulty: "Hard",
    category: "Sorting",
    component: HeapSortVisualizer,
  },
  "binary-search-tree": {
    name: "Binary Search Tree",
    description:
      "A tree data structure where each node has at most two children, and the left child is less than the parent while the right child is greater.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    difficulty: "Medium",
    category: "Trees",
    component: BSTVisualizer,
  },
  "avl-tree": {
    name: "AVL Tree",
    description: "A self-balancing binary search tree where the heights of two child subtrees differ by at most one.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    difficulty: "Hard",
    category: "Trees",
    component: AVLTreeVisualizer,
  },
  "dijkstra-s-algorithm": {
    name: "Dijkstra's Algorithm",
    description: "Finds the shortest path between nodes in a weighted graph with non-negative edge weights.",
    timeComplexity: "O(V²)",
    spaceComplexity: "O(V)",
    difficulty: "Hard",
    category: "Graphs",
    component: DijkstraVisualizer,
  },
  "stack-operations": {
    name: "Stack Operations",
    description: "A Last-In-First-Out (LIFO) data structure that supports push and pop operations.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    difficulty: "Easy",
    category: "Data Structures",
    component: StackVisualizer,
  },
  "queue-operations": {
    name: "Queue Operations",
    description: "A First-In-First-Out (FIFO) data structure that supports enqueue and dequeue operations.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    difficulty: "Easy",
    category: "Data Structures",
    component: QueueVisualizer,
  },
  "linked-list": {
    name: "Linked List",
    description:
      "A linear data structure where elements are stored in nodes, each containing data and a reference to the next node.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    difficulty: "Easy",
    category: "Data Structures",
    component: LinkedListVisualizer,
  },
  "hash-table": {
    name: "Hash Table",
    description: "A data structure that implements an associative array using a hash function to compute indexes.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    difficulty: "Medium",
    category: "Data Structures",
    component: HashTableVisualizer,
  },
}

const codeExamples = {
  "bubble-sort": {
    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
  },
  "quick-sort": {
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

public static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,
  },
  "merge-sort": {
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    java: `public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    
    int mid = arr.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    
    return merge(left, right);
}

public static int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0, j = 0, k = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result[k++] = left[i++];
        } else {
            result[k++] = right[j++];
        }
    }
    
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    
    return result;
}`,
  },
  "heap-sort": {
    javascript: `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
    python: `def heap_sort(arr):
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements from heap
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    
    return arr

def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    java: `public static void heapSort(int[] arr) {
    int n = arr.length;
    
    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        
        heapify(arr, i, 0);
    }
}

public static void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        
        heapify(arr, n, largest);
    }
}`,
  },
  "binary-search-tree": {
    javascript: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    this.root = this.insertNode(this.root, val);
  }
  
  insertNode(node, val) {
    if (!node) return new TreeNode(val);
    
    if (val < node.val) {
      node.left = this.insertNode(node.left, val);
    } else if (val > node.val) {
      node.right = this.insertNode(node.right, val);
    }
    
    return node;
  }
  
  search(val) {
    return this.searchNode(this.root, val);
  }
  
  searchNode(node, val) {
    if (!node || node.val === val) return node;
    
    if (val < node.val) {
      return this.searchNode(node.left, val);
    } else {
      return this.searchNode(node.right, val);
    }
  }
}`,
    python: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        self.root = self._insert_node(self.root, val)
    
    def _insert_node(self, node, val):
        if not node:
            return TreeNode(val)
        
        if val < node.val:
            node.left = self._insert_node(node.left, val)
        elif val > node.val:
            node.right = self._insert_node(node.right, val)
        
        return node
    
    def search(self, val):
        return self._search_node(self.root, val)
    
    def _search_node(self, node, val):
        if not node or node.val == val:
            return node
        
        if val < node.val:
            return self._search_node(node.left, val)
        else:
            return self._search_node(node.right, val)`,
    java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BST {
    TreeNode root;
    
    public BST() {
        this.root = null;
    }
    
    public void insert(int val) {
        root = insertNode(root, val);
    }
    
    private TreeNode insertNode(TreeNode node, int val) {
        if (node == null) {
            return new TreeNode(val);
        }
        
        if (val < node.val) {
            node.left = insertNode(node.left, val);
        } else if (val > node.val) {
            node.right = insertNode(node.right, val);
        }
        
        return node;
    }
    
    public TreeNode search(int val) {
        return searchNode(root, val);
    }
    
    private TreeNode searchNode(TreeNode node, int val) {
        if (node == null || node.val == val) {
            return node;
        }
        
        if (val < node.val) {
            return searchNode(node.left, val);
        } else {
            return searchNode(node.right, val);
        }
    }
}`,
  },
}

export default function AlgorithmPage({ params }: AlgorithmPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState([500])
  const [step, setStep] = useState(0)

  const algorithm = algorithmData[params.algorithm]

  if (!algorithm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Algorithm Not Found</h1>
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const VisualizerComponent = algorithm.component

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold">{algorithm.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary">{algorithm.category}</Badge>
                  <Badge className={getDifficultyColor(algorithm.difficulty)}>{algorithm.difficulty}</Badge>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm text-gray-600">Speed:</span>
                <div className="w-20">
                  <Slider value={speed} onValueChange={setSpeed} max={1000} min={100} step={100} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Visualizer */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Visualization</CardTitle>
                <CardDescription>{algorithm.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                  <VisualizerComponent isPlaying={isPlaying} speed={speed[0]} onStepChange={setStep} />
                </div>
              </CardContent>
            </Card>

            {/* Code Implementation */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Implementation</CardTitle>
                <CardDescription>Code examples in different programming languages</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="javascript">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="java">Java</TabsTrigger>
                  </TabsList>
                  {Object.entries(codeExamples[params.algorithm] || {}).map(([lang, code]) => (
                    <TabsContent key={lang} value={lang}>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{code}</code>
                      </pre>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Algorithm Info */}
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Time Complexity</h4>
                  <p className="font-mono text-lg">{algorithm.timeComplexity}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Space Complexity</h4>
                  <p className="font-mono text-lg">{algorithm.spaceComplexity}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Category</h4>
                  <p>{algorithm.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Difficulty</h4>
                  <Badge className={getDifficultyColor(algorithm.difficulty)}>{algorithm.difficulty}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Step Information */}
            <Card>
              <CardHeader>
                <CardTitle>Current Step</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">Step {step}</div>
                <p className="text-gray-600">Follow along with the algorithm execution step by step.</p>
              </CardContent>
            </Card>

            {/* Key Concepts */}
            <Card>
              <CardHeader>
                <CardTitle>Key Concepts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>In-place sorting algorithm</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Stable sorting algorithm</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Simple implementation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Poor performance on large datasets</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
