import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function GET() {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: "Say hello in one sentence.",
      maxTokens: 50,
    })

    return Response.json({
      success: true,
      message: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Groq test error:", error)
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
