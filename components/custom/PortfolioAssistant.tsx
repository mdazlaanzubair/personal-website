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
  X,
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
          className="glass-card fixed right-0 bottom-0 left-auto top-auto flex h-[min(42rem,calc(100dvh-2rem))] w-full translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden p-0 text-card-foreground shadow-2xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:right-6 sm:bottom-6 sm:max-w-[26rem] sm:rounded-2xl"
        >
          <DialogHeader className="flex-row items-center gap-3 border-b border-border bg-background/90 p-4 pr-14 backdrop-blur-sm">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full border-2 border-border bg-card">
              <Image
                src="/architect.png"
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
              <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="truncate text-sm font-bold tracking-wide normal-case">
                Ask Azlaan
              </DialogTitle>
              <DialogDescription className="mt-0 truncate text-[11px] leading-4 tracking-wide uppercase">
                AI assistant · grounded in public sources
              </DialogDescription>
            </div>
          </DialogHeader>

          <div
            ref={transcriptRef}
            className="flex-1 overflow-y-auto overscroll-contain"
            aria-live="polite"
            aria-busy={isSending}
          >
            {messages.map((message, index) => {
              const isLatest = index === messages.length - 1
              return (
                <article
                  key={message.id}
                  className={cn(
                    "border-b border-border/50 p-4",
                    message.role === "user" && "bg-muted/30"
                  )}
                >
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                    {message.role === "assistant" ? (
                      <>
                        <Sparkles className="size-3 text-primary" />
                        <span>Azlaan</span>
                      </>
                    ) : (
                      <span>You</span>
                    )}
                  </div>
                  <div className="prose prose-sm dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-0 prose-strong:text-foreground max-w-none text-sm leading-6 text-foreground">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>

                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
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
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/40"
                        >
                          <span className="min-w-0">
                            <span className="block text-[10px] tracking-widest text-primary uppercase">
                              {source.label}
                            </span>
                            <span className="mt-1 block truncate text-xs font-medium text-foreground">
                              {source.title}
                            </span>
                          </span>
                          <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  )}

                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
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
                          className={buttonVariants({ size: "xs" })}
                        >
                          {action.label}
                          {action.kind === "download" ? (
                            <Download data-icon="inline-end" />
                          ) : (
                            <ArrowRight data-icon="inline-end" />
                          )}
                        </a>
                      ))}
                    </div>
                  )}

                  {isLatest &&
                    message.suggestions &&
                    message.suggestions.length > 0 && (
                      <div className="mt-4 flex flex-col gap-2">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => void sendMessage(suggestion)}
                            disabled={isSending}
                            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left text-xs leading-5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                          >
                            <span>{suggestion}</span>
                            <ArrowRight className="size-3 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                </article>
              )
            })}

            {isSending && (
              <div className="flex items-center gap-2 border-b border-border/50 p-4 text-xs text-muted-foreground">
                <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
                <span>Thinking through my work…</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-border bg-background/90 p-3 backdrop-blur-sm"
          >
            {error && (
              <p
                role="alert"
                className="mb-2 text-xs leading-5 text-destructive"
              >
                {error}
              </p>
            )}
            <div className="flex items-end gap-2 rounded-lg border border-input bg-card p-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                rows={2}
                maxLength={1_200}
                disabled={isSending}
                placeholder="Ask about my work, thinking, or writing…"
                aria-label="Message Azlaan's AI"
                className="max-h-28 min-h-12 flex-1 resize-none bg-transparent px-1 py-1 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
              />
              <Button
                type="submit"
                size="icon-sm"
                disabled={isSending || !input.trim()}
                aria-label="Send message"
              >
                {isSending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Send />
                )}
              </Button>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
              Answers are generated from approved portfolio material and may
              still make mistakes.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
