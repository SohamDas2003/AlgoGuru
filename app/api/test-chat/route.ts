import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function GET() {
  try {
    console.log("Testing Groq API...")

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: "Say hello and explain what you can help with regarding data structures and algorithms in one sentence.",
    })

    console.log("Groq API test successful:", text)

    return Response.json({
      success: true,
      message: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Groq API test failed:", error)

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
