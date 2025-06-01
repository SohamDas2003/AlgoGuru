import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    console.log("Chat API called")

    const body = await req.json()
    const { messages } = body

    console.log("Received messages:", messages?.length)

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("Invalid messages:", messages)
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Validate message format
    for (const message of messages) {
      if (!message.role || !message.content) {
        console.error("Invalid message format:", message)
        return new Response(JSON.stringify({ error: "Invalid message format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    console.log("Starting Groq stream...")

    const result = streamText({
      model: groq("llama-3.1-70b-versatile"),
      messages: messages,
      system: `You are AlgoBot, a friendly AI assistant specializing in Data Structures and Algorithms.

Help students with:
- Explaining DSA concepts clearly
- Providing code examples
- Analyzing time/space complexity
- Solving coding problems step by step

Keep responses concise, educational, and encouraging.`,
      maxTokens: 500,
      temperature: 0.7,
    })

    console.log("Stream created, returning response")
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return new Response(
      JSON.stringify({
        error: "Chat service error",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
