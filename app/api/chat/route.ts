import {
  AssistantConfigurationError,
  AssistantTimeoutError,
  AssistantRateLimitError,
  AssistantContentFilteredError,
  AssistantModelError,
  AssistantParseError,
  createAssistantReply,
} from "@/src/ai/gemini"
import { checkAssistantRateLimit } from "@/src/ai/rate-limit"
import type { AssistantMessageInput } from "@/src/ai/types"

export const runtime = "nodejs"
export const maxDuration = 30

const MAX_MESSAGES = 10
const MAX_MESSAGE_LENGTH = 1_200
const MAX_TOTAL_LENGTH = 6_000

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value)

const parseMessages = (value: unknown): AssistantMessageInput[] | null => {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.length > MAX_MESSAGES
  ) {
    return null
  }

  let totalLength = 0
  const messages: AssistantMessageInput[] = []

  for (const item of value) {
    if (!isRecord(item)) return null

    const role = item.role
    const content = item.content
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    ) {
      return null
    }

    const normalized = content.trim()
    if (!normalized || normalized.length > MAX_MESSAGE_LENGTH) return null

    totalLength += normalized.length
    if (totalLength > MAX_TOTAL_LENGTH) return null

    messages.push({ role, content: normalized })
  }

  if (messages.at(-1)?.role !== "user") return null
  return messages
}

const getClientIdentifier = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip")?.trim() ||
  "anonymous"

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || ""
  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json(
      { error: "Send the request as JSON." },
      { status: 415, headers: noStoreHeaders }
    )
  }

  const rateLimit = checkAssistantRateLimit(getClientIdentifier(request))
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Too many questions. Please try again in a moment." },
      {
        status: 429,
        headers: {
          ...noStoreHeaders,
          "Retry-After": String(rateLimit.retryAfter),
        },
      }
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json(
      { error: "The request body is not valid JSON." },
      { status: 400, headers: noStoreHeaders }
    )
  }

  const messages = isRecord(payload) ? parseMessages(payload.messages) : null
  if (!messages) {
    return Response.json(
      { error: "Send between 1 and 10 short conversation messages." },
      { status: 400, headers: noStoreHeaders }
    )
  }

  try {
    const reply = await createAssistantReply(messages)
    return Response.json(reply, { headers: noStoreHeaders })
  } catch (error: unknown) {
    if (error instanceof AssistantConfigurationError) {
      return Response.json(
        {
          error:
            "Azlaan's assistant is being configured. Please try again a little later.",
        },
        { status: 503, headers: noStoreHeaders }
      )
    }

    if (error instanceof AssistantTimeoutError) {
      return Response.json(
        {
          error:
            "That took longer than expected. Please try a shorter or simpler question.",
        },
        { status: 504, headers: noStoreHeaders }
      )
    }

    if (error instanceof AssistantRateLimitError) {
      return Response.json(
        {
          error:
            "The AI service is temporarily busy. Please wait a moment and try again.",
        },
        { status: 429, headers: { ...noStoreHeaders, "Retry-After": "30" } }
      )
    }

    if (error instanceof AssistantContentFilteredError) {
      return Response.json(
        {
          error:
            "I wasn't able to generate a response to that question. Try rephrasing it.",
        },
        { status: 422, headers: noStoreHeaders }
      )
    }

    if (error instanceof AssistantModelError) {
      return Response.json(
        {
          error:
            "The AI model is temporarily unavailable. Please try again in a moment.",
        },
        { status: 503, headers: noStoreHeaders }
      )
    }

    if (error instanceof AssistantParseError) {
      return Response.json(
        {
          error:
            "I received an unexpected response. Please try asking again.",
        },
        { status: 502, headers: noStoreHeaders }
      )
    }

    console.error("Portfolio assistant request failed:", error)
    return Response.json(
      {
        error:
          "Something went wrong. Please try again.",
      },
      { status: 500, headers: noStoreHeaders }
    )
  }
}
