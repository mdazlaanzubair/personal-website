"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { GalleryImage, PublicationInterface, WorkInterface } from "@/type"
import {
  ArrowUpRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Code2Icon,
  CopyIcon,
  Maximize2Icon,
  Minimize2Icon,
  PlayIcon,
  QuoteIcon,
  XIcon,
} from "lucide-react"
import { PortableText, type PortableTextComponents } from "next-sanity"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"

const contributionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="leading-6 [&:not(:first-child)]:mt-3">{children}</p>
    ),
    h2: ({ children }) => (
      <h4 className="mt-4 font-semibold text-foreground">{children}</h4>
    ),
    h3: ({ children }) => (
      <h4 className="mt-4 font-semibold text-foreground">{children}</h4>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 font-semibold text-foreground">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-primary pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ol className="space-y-3.5 [counter-reset:item] [&:not(:first-child)]:mt-4">
        {children}
      </ol>
    ),
    number: ({ children }) => (
      <ol className="space-y-3.5 [counter-reset:item] [&:not(:first-child)]:mt-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="grid grid-cols-[1.75rem_1fr] [counter-increment:item] before:pt-0.5 before:font-mono before:text-[11px] before:text-primary before:content-[counter(item,decimal-leading-zero)]">
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="grid grid-cols-[1.75rem_1fr] [counter-increment:item] before:pt-0.5 before:font-mono before:text-[11px] before:text-primary before:content-[counter(item,decimal-leading-zero)]">
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#"
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-primary underline underline-offset-4"
        >
          {children}
        </a>
      )
    },
  },
}

const toDoiUrl = (doi: string | null) => {
  if (!doi) return null
  if (/^https?:\/\//i.test(doi)) return doi
  return `https://doi.org/${doi.replace(/^doi:\s*/i, "")}`
}

const toDoiLabel = (doi: string) =>
  doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "")

export const toStatusLabel = (status: string) => {
  const label = status.replaceAll("_", " ")
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const isMainAuthor = (author: string) => {
  const name = author.toLowerCase()
  return name.includes("azlaan") || name.includes("zubair")
}

const eyebrowClassName =
  "text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"

const pillButtonClassName =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40"

/**
 * The frame both work modals share: a sheet that slides up on phones and a
 * centred panel held 2rem inside the viewport on larger screens, with a
 * fixed header and footer around a body that scrolls on its own.
 */
function ModalShell({
  open,
  onClose,
  className,
  header,
  footer,
  children,
}: {
  open: boolean
  onClose: () => void
  className?: string
  header: ReactNode
  footer?: ReactNode
  children: ReactNode
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/70"
        className={cn(
          "top-auto bottom-0 left-0 flex w-full max-w-full translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none rounded-t-[22px] border border-b-0 border-border bg-card p-0 shadow-2xl",
          "sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[calc(100%-4rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[20px] sm:border-b",
          className
        )}
      >
        <div aria-hidden="true" className="flex justify-center pt-2 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-foreground/20" />
        </div>
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border pr-2 pl-5 sm:h-16 sm:pr-3 sm:pl-6">
          <div className="flex min-w-0 items-center gap-2.5">{header}</div>
          <DialogClose
            aria-label="Close"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <XIcon className="size-4" />
          </DialogClose>
        </header>
        {children}
        {footer && (
          <footer className="flex shrink-0 items-center gap-2 border-t border-border bg-card px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
            {footer}
          </footer>
        )}
      </DialogContent>
    </Dialog>
  )
}

/**
 * Keeps the last item while a modal plays its close animation, so the
 * panel does not empty out as it fades.
 */
function useLastNonNull<T>(value: T | null) {
  const [last, setLast] = useState(value)
  if (value !== null && value !== last) setLast(value)
  return value ?? last
}

type MediaItem =
  | { kind: "video"; url: string; poster: string | null; alt: string }
  | { kind: "image"; image: GalleryImage; alt: string }

/** A viewer that shows every screenshot whole, with thumbnails beneath. */
function MediaViewer({
  items,
  className,
}: {
  items: MediaItem[]
  className?: string
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const count = items.length
  const current = items[index]

  // Follow the browser's state too, since Esc also leaves fullscreen.
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === stageRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      stageRef.current?.requestFullscreen?.()
    }
  }

  const goPrev = () => setIndex((i) => (i - 1 + count) % count)
  const goNext = () => setIndex((i) => (i + 1) % count)

  return (
    <section
      aria-label="Media"
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (count < 2) return
        if (event.key === "ArrowLeft") goPrev()
        if (event.key === "ArrowRight") goNext()
      }}
      className={cn("flex flex-col gap-2.5 sm:gap-3", className)}
    >
      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-muted/50 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:18px_18px] dark:bg-black/60"
      >
        <div className="absolute inset-3 sm:inset-6">
          {current.kind === "video" ? (
            <video
              key={current.url}
              src={current.url}
              poster={current.poster ?? undefined}
              aria-label={current.alt}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="size-full rounded-md object-contain"
            />
          ) : (
            <Image
              key={current.image.url}
              src={current.image.url}
              alt={current.alt}
              fill
              sizes={
                isFullscreen ? "100vw" : "(max-width: 1024px) 100vw, 720px"
              }
              className="rounded-md object-contain"
              placeholder={current.image.lqip ? "blur" : "empty"}
              blurDataURL={current.image.lqip || undefined}
              unoptimized={current.image.url.endsWith(".gif")}
            />
          )}
        </div>

        {count > 1 && (
          <>
            <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[11px] text-white/85 tabular-nums">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              aria-label="Previous media"
              onClick={goPrev}
              className="absolute top-1/2 left-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white transition-colors hover:bg-black/75 sm:size-11"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next media"
              onClick={goNext}
              className="absolute top-1/2 right-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white transition-colors hover:bg-black/75 sm:size-11"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </>
        )}
        <button
          type="button"
          aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          aria-pressed={isFullscreen}
          onClick={toggleFullscreen}
          className="absolute top-2.5 right-2.5 hidden size-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white transition-colors hover:bg-black/75 sm:inline-flex"
        >
          {isFullscreen ? (
            <Minimize2Icon className="size-3.5" />
          ) : (
            <Maximize2Icon className="size-3.5" />
          )}
        </button>
      </div>

      {count > 1 && (
        <div className="flex shrink-0 gap-2 overflow-x-auto pb-0.5 sm:gap-2.5">
          {items.map((item, i) => {
            const thumb = item.kind === "video" ? item.poster : item.image.url
            const isActive = i === index
            return (
              <button
                key={`${item.kind}-${i}`}
                type="button"
                aria-label={`Show ${item.alt}`}
                aria-current={isActive}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-opacity sm:h-[66px] sm:w-[104px]",
                  isActive
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-55 hover:opacity-90"
                )}
              >
                {thumb && (
                  <Image
                    src={thumb.endsWith(".gif") ? `${thumb}?fm=jpg` : thumb}
                    alt=""
                    fill
                    sizes="104px"
                    className="object-cover object-top"
                  />
                )}
                {item.kind === "video" && (
                  <span className="absolute bottom-1 left-1 inline-flex size-5 items-center justify-center rounded-full bg-black/70 text-white">
                    <PlayIcon className="size-2.5 fill-current" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function ProjectModal({
  project: selected,
  onClose,
}: {
  project: WorkInterface | null
  onClose: () => void
}) {
  const project = useLastNonNull(selected)
  const media: MediaItem[] = project
    ? [
        ...(project.previewVideo
          ? [
              {
                kind: "video" as const,
                url: project.previewVideo,
                poster: project.images[0]?.url ?? null,
                alt: `${project.title} walkthrough video`,
              },
            ]
          : []),
        ...project.images.map((image, i) => ({
          kind: "image" as const,
          image,
          alt: image.alt || `${project.title} image ${i + 1}`,
        })),
      ]
    : []

  const links = project && (
    <>
      {project.metadata.repositoryUrl && (
        <Link
          href={project.metadata.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            pillButtonClassName,
            "border border-border text-foreground hover:bg-muted max-sm:h-12 max-sm:flex-1"
          )}
        >
          <Code2Icon className="size-3.5" />
          Source
        </Link>
      )}
      {project.metadata.projectUrl && (
        <Link
          href={project.metadata.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            pillButtonClassName,
            "bg-primary text-white hover:bg-primary/85 max-sm:h-12 max-sm:flex-[2]"
          )}
        >
          Visit project
          <ArrowUpRightIcon className="size-3.5" />
        </Link>
      )}
    </>
  )
  const hasLinks = Boolean(
    project?.metadata.repositoryUrl || project?.metadata.projectUrl
  )

  return (
    <ModalShell
      open={selected !== null}
      onClose={onClose}
      className="h-[calc(100dvh-1.5rem)] sm:h-[min(52rem,calc(100dvh-4rem))] sm:max-w-[1160px]"
      header={
        project && (
          <>
            <span
              className={cn(
                eyebrowClassName,
                "inline-flex shrink-0 items-center gap-1.5",
                project.metadata.isFeatured && "text-primary"
              )}
            >
              {project.metadata.isFeatured && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
              {project.metadata.isFeatured ? "Featured project" : "Project"}
            </span>
            <span aria-hidden="true" className="hidden text-border sm:inline">
              /
            </span>
            <span className="hidden truncate text-xs text-foreground sm:inline">
              {project.title}
            </span>
          </>
        )
      }
      footer={
        hasLinks ? (
          <div className="flex w-full gap-2 sm:hidden">{links}</div>
        ) : null
      }
    >
      {project && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {media.length > 0 && (
            <MediaViewer
              key={project.id}
              items={media}
              className="shrink-0 p-4 sm:p-5 lg:min-w-0 lg:flex-1 lg:border-r lg:border-border [&>div:first-child]:aspect-[16/10] lg:[&>div:first-child]:aspect-auto"
            />
          )}

          <aside
            className={cn(
              "flex flex-col gap-7 px-5 pt-2 pb-8 sm:px-7 sm:pt-6 lg:shrink-0 lg:overflow-y-auto",
              media.length > 0 ? "lg:w-[400px]" : "mx-auto w-full max-w-2xl"
            )}
          >
            <div className="flex flex-col gap-3">
              <DialogTitle className="font-heading text-[28px] leading-[1.1] font-bold tracking-tight normal-case sm:text-[32px]">
                {project.title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-[1.65] text-muted-foreground">
                {project.description}
              </DialogDescription>
              {hasLinks && (
                <div className="mt-2 hidden flex-wrap gap-2 sm:flex">
                  {links}
                </div>
              )}
            </div>

            {project.metadata.key_contributions.length > 0 && (
              <section className="flex flex-col gap-3">
                <h3 className={eyebrowClassName}>What I did</h3>
                <div className="text-[13px] leading-[1.6] text-foreground/80">
                  <PortableText
                    value={project.metadata.key_contributions}
                    components={contributionComponents}
                  />
                </div>
              </section>
            )}

            {project.tags.length > 0 && (
              <section className="flex flex-col gap-3">
                <h3 className={eyebrowClassName}>Stack</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <li
                      key={`${project.id}-${tag}`}
                      className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-foreground/80"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      )}
    </ModalShell>
  )
}

const toCitation = (publication: PublicationInterface) => {
  const doiUrl = toDoiUrl(publication.metadata.doi)
  return [
    publication.authors.join(", "),
    publication.metadata.year ? `(${publication.metadata.year}).` : null,
    `${publication.title}.`,
    publication.metadata.journal ? `${publication.metadata.journal}.` : null,
    doiUrl,
  ]
    .filter(Boolean)
    .join(" ")
}

export function PublicationModal({
  publication: selected,
  onClose,
}: {
  publication: PublicationInterface | null
  onClose: () => void
}) {
  const publication = useLastNonNull(selected)
  const [copied, setCopied] = useState<"doi" | "citation" | null>(null)

  const copy = async (kind: "doi" | "citation", text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopied(null)
    }
  }

  const doiUrl = publication ? toDoiUrl(publication.metadata.doi) : null
  const isPublished = publication?.metadata.status === "published"
  const paragraphs = publication?.abstract
    ? publication.abstract.split(/\n\s*\n/).filter((p) => p.trim())
    : []
  const details = publication
    ? ([
        publication.metadata.journal && {
          label: "Journal",
          value: <span className="italic">{publication.metadata.journal}</span>,
        },
        publication.metadata.year && {
          label: "Year",
          value: publication.metadata.year,
        },
        publication.metadata.doi && {
          label: "DOI",
          value: (
            <span className="flex min-w-0 items-center gap-2 font-mono text-xs">
              <span className="truncate">
                {toDoiLabel(publication.metadata.doi)}
              </span>
              <button
                type="button"
                aria-label={copied === "doi" ? "DOI copied" : "Copy DOI"}
                onClick={() =>
                  copy("doi", toDoiLabel(publication.metadata.doi!))
                }
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied === "doi" ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <CopyIcon className="size-3.5" />
                )}
              </button>
            </span>
          ),
        },
      ].filter((detail) => Boolean(detail)) as {
        label: string
        value: ReactNode
      }[])
    : []

  return (
    <ModalShell
      open={selected !== null}
      onClose={onClose}
      className="max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-4rem)] sm:max-w-[860px]"
      header={
        publication && (
          <>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                isPublished
                  ? "border-primary/35 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isPublished ? "bg-primary" : "border border-muted-foreground"
                )}
              />
              {toStatusLabel(publication.metadata.status)}
            </span>
            {publication.metadata.year && (
              <time
                dateTime={String(publication.metadata.year)}
                className="font-mono text-xs text-muted-foreground"
              >
                {publication.metadata.year}
              </time>
            )}
          </>
        )
      }
      footer={
        publication && (
          <div className="flex w-full items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => copy("citation", toCitation(publication))}
              className={cn(
                pillButtonClassName,
                "border border-border text-foreground hover:bg-muted max-sm:size-12 max-sm:px-0"
              )}
            >
              {copied === "citation" ? (
                <CheckIcon className="size-3.5" />
              ) : (
                <QuoteIcon className="size-3.5" />
              )}
              <span className="max-sm:sr-only">
                {copied === "citation" ? "Citation copied" : "Copy citation"}
              </span>
            </button>
            {doiUrl && (
              <Link
                href={doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  pillButtonClassName,
                  "h-11 bg-foreground px-5 text-background hover:bg-foreground/85 max-sm:h-12 max-sm:flex-1"
                )}
              >
                Read the paper
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            )}
          </div>
        )
      }
    >
      {publication && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-7 px-5 pt-6 pb-10 sm:px-14 sm:pt-9">
            <div className="flex flex-col gap-4">
              <DialogTitle className="max-w-[42rem] font-heading text-[23px] leading-[1.25] font-bold tracking-tight normal-case sm:text-3xl sm:leading-[1.22]">
                {publication.title}
              </DialogTitle>
              {publication.authors.length > 0 && (
                <DialogDescription className="text-[13px] leading-[1.65] sm:text-sm">
                  {publication.authors.map((author, i) => (
                    <span key={`${publication.id}-${author}-${i}`}>
                      <span
                        className={cn(
                          isMainAuthor(author) &&
                            "font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
                        )}
                      >
                        {author}
                      </span>
                      {i < publication.authors.length - 1 && ", "}
                    </span>
                  ))}
                </DialogDescription>
              )}
            </div>

            {details.length > 0 && (
              <dl className="grid border-y border-border sm:grid-cols-3">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-3 border-border py-3 not-last:border-b sm:flex-col sm:items-start sm:justify-start sm:gap-1 sm:px-4 sm:py-3.5 sm:not-last:border-b-0 sm:first:pl-0 sm:[&:not(:first-child)]:border-l"
                  >
                    <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                      {detail.label}
                    </dt>
                    <dd className="min-w-0 text-right text-[13px] text-foreground sm:text-left sm:text-sm">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {publication.images.length > 0 && (
              <MediaViewer
                key={publication.id}
                items={publication.images.map((image, i) => ({
                  kind: "image",
                  image,
                  alt: image.alt || `${publication.title} figure ${i + 1}`,
                }))}
                className="[&>div:first-child]:aspect-video"
              />
            )}

            {paragraphs.length > 0 && (
              <article className="flex max-w-[41rem] flex-col gap-3.5">
                <h3 className={eyebrowClassName}>Abstract</h3>
                {paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-[1.75] whitespace-pre-line text-foreground/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </article>
            )}
          </div>
        </div>
      )}
    </ModalShell>
  )
}
