"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import {
  ArrowRight,
  Download,
  ExternalLink,
  LoaderCircle,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type {
  AssistantAction,
  AssistantMessageInput,
  AssistantReply,
  AssistantSource,
} from "@/src/ai/types"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: AssistantSource[]
  suggestions?: string[]
  actions?: AssistantAction[]
}

const STARTER_QUESTIONS = [
  "How do you approach complex engineering problems?",
  "Which project should I look at first?",
  "What have you written about AI?",
  "Can I download your résumé or academic CV?",
]

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey — I'm Azlaan's counterpart. I'm grounded in his work, research, and writing, with a voice shaped by how he approaches engineering: structure, clarity, and long-term thinking. Ask me what he has built, how he thinks, or what you should read first.",
  suggestions: STARTER_QUESTIONS,
}

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url)

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => controllerRef.current?.abort()
  }, [])

  useEffect(() => {
    if (!open) return
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isSending, open])

  const sendMessage = async (prompt: string) => {
    const normalized = prompt.trim()
    if (!normalized || isSending) return

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: normalized,
    }
    const requestMessages: AssistantMessageInput[] = [
      ...messages
        .filter((message) => message.id !== "welcome")
        .slice(-7)
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
      { role: "user", content: normalized },
    ]

    setMessages((current) => [...current, userMessage])
    setInput("")
    setError(null)
    setIsSending(true)

    const controller = new AbortController()
    controllerRef.current = controller
    const timeout = window.setTimeout(() => controller.abort(), 30_000)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages }),
        signal: controller.signal,
      })

      const payload: unknown = await response.json()
      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "I couldn't answer that just now. Please try again."
        throw new Error(message)
      }

      const reply = payload as AssistantReply
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: reply.answer,
          sources: reply.sources,
          suggestions: reply.suggestions,
          actions: reply.actions,
        },
      ])
    } catch (reason: unknown) {
      const message =
        reason instanceof DOMException && reason.name === "AbortError"
          ? "That took longer than expected. Please try again."
          : reason instanceof Error
            ? reason.message
            : "I couldn't answer that just now. Please try again."
      setError(message)
    } finally {
      window.clearTimeout(timeout)
      controllerRef.current = null
      setIsSending(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(input)
  }

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      void sendMessage(input)
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            onClick={() => setOpen(true)}
            className="fixed right-5 bottom-5 z-50 flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-colors hover:bg-foreground/90 sm:right-8 sm:bottom-8 sm:size-14"
            aria-label="Ask Azlaan's AI"
            title="Ask Azlaan's AI"
          >
            <MessageCircle className="size-5 sm:size-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat drawer */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          initialFocus={textareaRef}
          style={{ top: "auto", left: "auto", right: 0, bottom: 0, translate: "none" }}
          className="!flex !h-[min(36rem,calc(100dvh-2rem))] !w-full !max-w-none !flex-col !gap-0 !overflow-hidden !border !border-border !bg-card !p-0 !ring-0 !shadow-2xl sm:!mr-6 sm:!mb-6 sm:!max-w-[24rem] sm:!rounded-2xl"
        >
          {/* Header */}
          <DialogHeader className="flex-row items-center gap-3 border-b border-border/60 px-4 py-3.5 pr-14">
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-border">
              <Image
                src="/architect.png"
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
              <span className="absolute right-0 bottom-0 size-2 rounded-full border border-background bg-emerald-500" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-sm font-semibold tracking-tight normal-case text-foreground">
                Ask Azlaan
              </DialogTitle>
              <DialogDescription className="mt-0 text-[10px] leading-3 text-muted-foreground">
                AI assistant grounded in public sources
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Messages */}
          <div
            ref={transcriptRef}
            className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4"
            aria-live="polite"
            aria-busy={isSending}
          >
            {messages.map((message, index) => {
              const isLatest = index === messages.length - 1
              const isUser = message.role === "user"

              return (
                <div key={message.id} className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
                  {/* Avatar + name for assistant */}
                  {!isUser && index > 0 && (
                    <div className="mb-1 ml-1 flex items-center gap-1.5">
                      <Sparkles className="size-3 text-primary" />
                      <span className="text-[10px] font-medium text-muted-foreground">Azlaan</span>
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={cn(
                      "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                      isUser
                        ? "rounded-br-md bg-foreground text-background"
                        : "rounded-bl-md bg-muted/60 text-foreground"
                    )}
                  >
                    {isUser ? (
                      <p>{message.content}</p>
                    ) : (
                      <div className="prose-sm prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-strong:text-foreground dark:prose-invert max-w-none [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 w-[88%] space-y-1.5">
                      <p className="ml-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                        Sources
                      </p>
                      {message.sources.map((source) => (
                        <a
                          key={source.id}
                          href={source.url}
                          target={
                            isExternalUrl(source.url) ? "_blank" : undefined
                          }
                          rel={
                            isExternalUrl(source.url)
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="group flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block text-[10px] font-medium text-primary">
                              {source.label}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-foreground">
                              {source.title}
                            </span>
                          </span>
                          <ExternalLink className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {message.actions.map((action) => (
                        <a
                          key={`${action.label}-${action.url}`}
                          href={action.url}
                          target={
                            isExternalUrl(action.url) ? "_blank" : undefined
                          }
                          rel={
                            isExternalUrl(action.url)
                              ? "noopener noreferrer"
                              : undefined
                          }
                          download={
                            action.kind === "download"
                              ? action.fileName || true
                              : undefined
                          }
                          className={cn(
                            buttonVariants({ size: "xs" }),
                            "h-7 gap-1 rounded-full text-[11px]"
                          )}
                        >
                          {action.label}
                          {action.kind === "download" ? (
                            <Download className="size-3" />
                          ) : (
                            <ArrowRight className="size-3" />
                          )}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Suggestion chips */}
                  {isLatest &&
                    message.suggestions &&
                    message.suggestions.length > 0 && (
                      <div className="mt-3 flex w-full flex-col gap-1.5">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => void sendMessage(suggestion)}
                            disabled={isSending}
                            className="group flex w-full items-center justify-between gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-left text-[12px] leading-5 text-muted-foreground transition-all hover:border-primary/30 hover:bg-muted/40 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                          >
                            <span>{suggestion}</span>
                            <ArrowRight className="size-3 shrink-0 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              )
            })}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex items-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-muted/60 px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                  </div>
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border/60 p-3"
          >
            {error && (
              <div
                role="alert"
                className="mb-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive"
              >
                {error}
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 rounded-xl border border-input bg-background px-3 py-2 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/30">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  rows={1}
                  maxLength={1_200}
                  disabled={isSending}
                  placeholder="Ask about my work, thinking, or writing..."
                  aria-label="Message Azlaan's AI"
                  className="max-h-24 min-h-[1.5rem] w-full resize-none bg-transparent text-[13px] leading-5 text-foreground outline-none placeholder:text-muted-foreground/60 disabled:opacity-60"
                />
              </div>
              <Button
                type="submit"
                size="icon-sm"
                disabled={isSending || !input.trim()}
                aria-label="Send message"
                className="shrink-0 rounded-xl"
              >
                {isSending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Send />
                )}
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] leading-4 text-muted-foreground/50">
              Answers are generated from approved portfolio material
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
