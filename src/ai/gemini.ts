import "server-only"

import { GoogleGenAI, ThinkingLevel } from "@google/genai"

import { loadPortfolioKnowledge, selectKnowledge } from "./knowledge"
import { OFF_TOPIC_REPLY, PERSONA_FOUNDATION } from "./persona"
import type {
  AssistantAction,
  AssistantMessageInput,
  AssistantReply,
  AssistantSource,
  KnowledgeDocument,
} from "./types"

const DEFAULT_MODEL = "gemini-3.8-flash"
const MAX_CONTEXT_CHARACTERS = 18_000

const PROFESSIONAL_RESUME_ACTION = {
  label: "Download professional resume (PDF)",
  url: "/resume/Resume - Software Engineer - Muhammad Azlaan Zubair.pdf",
  kind: "download",
  fileName: "Resume - Software Engineer - Muhammad Azlaan Zubair.pdf",
} satisfies AssistantAction

const ACADEMIC_CV_ACTION = {
  label: "Download academic CV (PDF)",
  url: "/resume/CV - Software Engineer - Muhammad Azlaan Zubair (Academic).pdf",
  kind: "download",
  fileName: "CV - Software Engineer - Muhammad Azlaan Zubair (Academic).pdf",
} satisfies AssistantAction

export class AssistantConfigurationError extends Error {}
export class AssistantTimeoutError extends Error {}
export class AssistantRateLimitError extends Error {}
export class AssistantContentFilteredError extends Error {}
export class AssistantModelError extends Error {}
export class AssistantParseError extends Error {}

const CLEARLY_OFF_TOPIC = [
  /\b(weather|forecast|temperature)\b/i,
  /\b(recipe|cook|bake|ingredients)\b/i,
  /\b(cricket|football|soccer|basketball)\b.*\b(score|fixture|match)\b/i,
  /\b(stock|crypto|bitcoin)\b.*\b(price|buy|sell|invest)\b/i,
  /\b(diagnose|medical advice|legal advice)\b/i,
  /\b(write|do|finish|solve)\b.*\b(homework|assignment|exam|equation)\b/i,
  /\b(capital of|president of|prime minister of)\b/i,
]

const PORTFOLIO_CONTEXT =
  /\b(azlaan|dazlaan|mdazlaan|you|your|work|career|project|research|writing|article|blog|case study|experience|skill|technology|approach|think|personality|hire|resume|résumé|cv|contact|email|call|portfolio)\b/i

const isClearlyOffTopic = (question: string) =>
  !PORTFOLIO_CONTEXT.test(question) &&
  CLEARLY_OFF_TOPIC.some((pattern) => pattern.test(question))

const formatKnowledge = (documents: KnowledgeDocument[]) => {
  let used = 0

  return documents
    .map((document) => {
      const remaining = MAX_CONTEXT_CHARACTERS - used
      if (remaining <= 0) return ""

      const body = document.body.slice(0, Math.min(remaining, 5_000))
      const block = [
        `<source id="${document.id}">`,
        `Title: ${document.title}`,
        `Type: ${document.citationLabel}`,
        document.publishedAt ? `Published: ${document.publishedAt}` : undefined,
        document.updatedAt ? `Updated: ${document.updatedAt}` : undefined,
        `Content: ${body}`,
        "</source>",
      ]
        .filter(Boolean)
        .join("\n")

      used += block.length
      return block
    })
    .filter(Boolean)
    .join("\n\n")
}

const toSource = (document: KnowledgeDocument): AssistantSource => ({
  id: document.id,
  title: document.title,
  label: document.citationLabel,
  url: document.sourceUrl,
})

type PortfolioDocument = "professional-resume" | "academic-cv"

const normalizeForIntent = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

const getRequestedDocuments = (
  messages: AssistantMessageInput[]
): PortfolioDocument[] => {
  const question = normalizeForIntent(messages.at(-1)?.content || "")
  const visitorOwnedDocument =
    /\b(?:my|mine|our)\s+(?:academic\s+)?(?:resume|cv|curriculum vitae)\b/.test(
      question
    )
  const azlaanOwnedDocument =
    /\b(?:your|azlaan(?:'s)?|his)\s+(?:academic\s+)?(?:resume|cv|curriculum vitae)\b/.test(
      question
    )

  if (visitorOwnedDocument && !azlaanOwnedDocument) return []

  const asksForAcademicCv =
    /\bacademic\s+cv\b|\bcurriculum vitae\b|\bcv\b/.test(question)
  const asksForProfessionalResume = /\bprofessional\s+resume\b|\bresume\b/.test(
    question
  )

  if (asksForAcademicCv && asksForProfessionalResume) {
    return ["professional-resume", "academic-cv"]
  }
  if (asksForAcademicCv) return ["academic-cv"]
  if (asksForProfessionalResume) return ["professional-resume"]

  const deliveryCue =
    /\b(download|send|share|give|provide|get|open|view|see|available|where|document|application materials)\b/.test(
      question
    )
  const academicAudience =
    /\b(professor|faculty|research position|research role|phd|doctoral|lab|university|scholarship)\b/.test(
      question
    )
  const professionalAudience =
    /\b(recruiter|hiring manager|job|industry|software engineer(?:ing)? role|developer role)\b/.test(
      question
    )

  if (deliveryCue && academicAudience && professionalAudience) {
    return ["professional-resume", "academic-cv"]
  }
  if (deliveryCue && academicAudience) return ["academic-cv"]
  if (deliveryCue && professionalAudience) return ["professional-resume"]
  if (
    deliveryCue &&
    /\b(application materials|career documents|both documents|documents)\b/.test(
      question
    )
  ) {
    return ["professional-resume", "academic-cv"]
  }

  const recentContext = normalizeForIntent(
    messages
      .slice(0, -1)
      .slice(-4)
      .map((message) => message.content)
      .join(" ")
  )
  const followsDocumentConversation = /\b(resume|cv|curriculum vitae)\b/.test(
    recentContext
  )

  if (followsDocumentConversation) {
    if (/\b(both|either|all)\b/.test(question)) {
      return ["professional-resume", "academic-cv"]
    }
    if (
      /\bacademic (?:one|version|document)\b|\bresearch version\b/.test(
        question
      )
    ) {
      return ["academic-cv"]
    }
    if (
      /\bprofessional (?:one|version|document)\b|\bhiring version\b|\bindustry version\b/.test(
        question
      )
    ) {
      return ["professional-resume"]
    }
  }

  return []
}

const toDocumentActions = (documents: PortfolioDocument[]): AssistantAction[] =>
  documents.map((document) =>
    document === "academic-cv" ? ACADEMIC_CV_ACTION : PROFESSIONAL_RESUME_ACTION
  )

const isDirectDocumentRequest = (
  question: string,
  documents: PortfolioDocument[]
) => {
  if (documents.length === 0) return false

  const normalized = normalizeForIntent(question)
  const additionalTopic =
    /\b(summarize|explain|compare)\b|\b(?:latest|recent)\s+(?:blog|article|paper|publication|project)\b|\b(?:tell me about|describe)\s+(?:your\s+)?(?:work|research|project|paper|publication|experience|skills?)\b/.test(
      normalized
    )

  return !additionalTopic
}

const createDocumentReply = (
  documents: PortfolioDocument[]
): AssistantReply => {
  if (documents.length === 2) {
    return {
      answer:
        "I keep two versions for different audiences. My professional resume is the concise option for hiring and industry roles; my academic CV gives professors and research teams the fuller record. You can download either below.",
      sources: [],
      suggestions: [
        "What is your current research focus?",
        "Which project should a hiring manager see first?",
        "How can I contact you?",
      ],
      actions: toDocumentActions(documents),
      scope: "answered",
    }
  }

  const isAcademic = documents[0] === "academic-cv"
  return {
    answer: isAcademic
      ? "For professors, research teams, and university opportunities, my academic CV has the fuller record of my education, publications, manuscripts, research projects, and technical work. You can download it below."
      : "For hiring managers and industry roles, my professional resume is the concise version of my engineering experience, impact, selected AI projects, and education. You can download it below.",
    sources: [],
    suggestions: isAcademic
      ? [
          "Can I see the professional resume too?",
          "What is your current research focus?",
          "Tell me about your published paper.",
        ]
      : [
          "Can I see the academic CV too?",
          "Which project should I look at first?",
          "How can I contact you?",
        ],
    actions: toDocumentActions(documents),
    scope: "answered",
  }
}

const getActions = (
  documentActions: AssistantAction[],
  sources: AssistantSource[]
) => {
  const actions: AssistantAction[] = [...documentActions]

  const firstSource = sources[0]
  if (firstSource && actions.length < 3) {
    actions.push({
      label: `Open ${firstSource.label.toLowerCase()}`,
      url: firstSource.url,
      kind: "link",
    })
  }

  return actions.slice(0, 3)
}

const safeSuggestions = (value: unknown) => {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.length <= 120)
    .slice(0, 3)
}

interface ModelReply {
  answer: string
  sourceIds: string[]
  suggestions: string[]
  scope: "answered" | "redirected"
}

const parseModelReply = (value: string): ModelReply => {
  const normalized = value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
  const objectStart = normalized.indexOf("{")
  const objectEnd = normalized.lastIndexOf("}")
  const json =
    objectStart >= 0 && objectEnd > objectStart
      ? normalized.slice(objectStart, objectEnd + 1)
      : normalized
  const parsed: unknown = JSON.parse(json)
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini returned an invalid response.")
  }

  const candidate = parsed as Record<string, unknown>
  if (typeof candidate.answer !== "string" || !candidate.answer.trim()) {
    throw new Error("Gemini returned an empty response.")
  }

  const sourceIds = Array.isArray(candidate.sourceIds)
    ? candidate.sourceIds.filter(
        (item): item is string => typeof item === "string"
      )
    : []

  return {
    answer: candidate.answer.trim().slice(0, 4_000),
    sourceIds: sourceIds.slice(0, 4),
    suggestions: safeSuggestions(candidate.suggestions),
    scope: candidate.scope === "redirected" ? "redirected" : "answered",
  }
}

const buildSystemInstruction = (documents: KnowledgeDocument[]) =>
  `
${PERSONA_FOUNDATION}

CURRENT CAPABILITIES
- Two verified PDF downloads are always available through interface actions: a concise professional resume for hiring and industry roles, and a detailed academic CV for professors, research teams, and university opportunities.
- When a visitor asks for either document, explain the audience distinction briefly and tell them to use the download button below. Do not write a raw document URL in the answer.

RESPONSE CONTRACT
- Produce a concise answer in Azlaan's documented voice.
- Set scope to "redirected" for unrelated requests.
- Return up to four supporting IDs in sourceIds.
- Return up to three short, relevant follow-up questions in suggestions.

APPROVED SOURCE SET
${formatKnowledge(documents)}
`.trim()

export async function createAssistantReply(
  messages: AssistantMessageInput[]
): Promise<AssistantReply> {
  const question = messages.at(-1)?.content.trim() || ""
  const requestedDocuments = getRequestedDocuments(messages)

  if (isDirectDocumentRequest(question, requestedDocuments)) {
    return createDocumentReply(requestedDocuments)
  }

  if (isClearlyOffTopic(question)) {
    return {
      answer: OFF_TOPIC_REPLY.answer,
      sources: [],
      suggestions: [...OFF_TOPIC_REPLY.suggestions],
      actions: [],
      scope: "redirected",
    }
  }

  const apiKey =
    process.env.GOOGLE_GEMINI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim()

  if (!apiKey) {
    throw new AssistantConfigurationError(
      "The Gemini API key has not been configured."
    )
  }

  const allDocuments = await loadPortfolioKnowledge()
  const selectedDocuments = selectKnowledge(question, allDocuments)
  const selectedById = new Map(
    selectedDocuments.map((document) => [document.id, document])
  )

  const ai = new GoogleGenAI({ apiKey })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25_000)

  let response: Awaited<ReturnType<typeof ai.models.generateContent>>
  try {
    response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL,
      contents: messages.slice(-8).map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      config: {
        abortSignal: controller.signal,
        systemInstruction: buildSystemInstruction(selectedDocuments),
        maxOutputTokens: 2_048,
        // thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          properties: {
            answer: { type: "string" },
            sourceIds: {
              type: "array",
              items: { type: "string" },
              maxItems: 4,
            },
            suggestions: {
              type: "array",
              items: { type: "string" },
              maxItems: 3,
            },
            scope: {
              type: "string",
              enum: ["answered", "redirected"],
            },
          },
          required: ["answer", "sourceIds", "suggestions", "scope"],
          additionalProperties: false,
        },
      },
    })
  } catch (error: unknown) {
    clearTimeout(timeout)
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AssistantTimeoutError("The request timed out.")
    }
    const message =
      error instanceof Error ? error.message.toLowerCase() : ""
    if (message.includes("rate") || message.includes("429")) {
      throw new AssistantRateLimitError("Gemini rate limit reached.")
    }
    if (message.includes("safety") || message.includes("blocked") || message.includes("filter")) {
      throw new AssistantContentFilteredError("The response was filtered by safety settings.")
    }
    if (message.includes("model") || message.includes("not found") || message.includes("invalid")) {
      throw new AssistantModelError("The AI model is unavailable.")
    }
    throw error
  }

  clearTimeout(timeout)

  if (!response.text) {
    throw new AssistantModelError("Gemini did not return a response.")
  }

  let modelReply: ModelReply
  try {
    modelReply = parseModelReply(response.text)
  } catch {
    throw new AssistantParseError("Failed to parse the AI response.")
  }

  const sources = modelReply.sourceIds
    .map((id) => selectedById.get(id))
    .filter((document): document is KnowledgeDocument => Boolean(document))
    .map(toSource)

  return {
    answer: modelReply.answer,
    sources,
    suggestions:
      modelReply.suggestions.length > 0
        ? modelReply.suggestions
        : [
            "Which project should I look at first?",
            "How do you make technical decisions?",
            "What have you written recently?",
          ],
    actions: getActions(toDocumentActions(requestedDocuments), sources),
    scope: modelReply.scope,
  }
}
