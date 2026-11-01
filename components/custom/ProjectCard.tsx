"use client"

import { cn } from "@/lib/utils"
import type { WorkInterface } from "@/type"
import { ArrowUpRightIcon, PlayIcon } from "lucide-react"
import { useReducedMotion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const initials = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word, i) => (i === 0 ? word[0].toUpperCase() : word[0].toLowerCase()))
    .join("")

/**
 * An image-led project card. When the project has a preview video it loads
 * on first hover (or when mostly in view on touch screens) and plays muted
 * over the poster, like Framer and Webflow showcase cards.
 */
export default function ProjectCard({
  project,
  wide = false,
  onOpen,
}: {
  project: WorkInterface
  wide?: boolean
  onOpen: () => void
}) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isActive, setIsActive] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const poster = project.images[0] ?? null
  // An animated GIF cover behaves like a preview video: Sanity renders its
  // first frame as the still poster, and the animation plays on hover.
  const gif = poster?.url.endsWith(".gif") ? poster.url : null
  const posterUrl = gif ? `${gif}?fm=jpg` : poster?.url
  const video = prefersReducedMotion ? null : project.previewVideo
  const animatedImage = prefersReducedMotion || video ? null : gif
  const hasPreview = Boolean(video || animatedImage)
  // A GIF has no pause event, so it only counts as playing while shown.
  const showPlaying = isPlaying && (Boolean(video) || isActive)

  useEffect(() => {
    const element = videoRef.current
    if (!video || !element || !hasLoaded) return
    if (isActive) {
      element.play().catch(() => setIsPlaying(false))
    } else {
      element.pause()
      element.currentTime = 0
    }
  }, [isActive, hasLoaded, video])

  // Touch screens have no hover, so play while the card is mostly on screen.
  useEffect(() => {
    const element = cardRef.current
    if (!hasPreview || !element) return
    if (!window.matchMedia("(hover: none)").matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasLoaded(true)
        setIsActive(entry.isIntersecting)
      },
      { threshold: 0.6 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [hasPreview])

  const activate = () => {
    if (!hasPreview) return
    setHasLoaded(true)
    setIsActive(true)
  }
  const deactivate = () => setIsActive(false)

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onOpen}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") activate()
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") deactivate()
      }}
      onFocus={activate}
      onBlur={deactivate}
      className="group flex h-full w-full flex-col gap-3.5 rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-border bg-muted/40 transition-[border-color,box-shadow] duration-300 group-hover:border-foreground/20 group-hover:shadow-[0_20px_40px_-12px_rgba(255,85,1,0.18)]",
          wide ? "aspect-[16/10] sm:aspect-[2/1]" : "aspect-[16/10]"
        )}
      >
        {poster && posterUrl ? (
          <Image
            src={posterUrl}
            alt={poster.alt || project.title}
            fill
            sizes={
              wide
                ? "(max-width: 768px) 100vw, 704px"
                : "(max-width: 640px) 100vw, 346px"
            }
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            placeholder={poster.lqip ? "blur" : "empty"}
            blurDataURL={poster.lqip || undefined}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]">
            <span className="font-heading text-6xl font-bold tracking-tight text-foreground/85">
              {initials(project.title)}
            </span>
          </div>
        )}

        {video && hasLoaded && (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onPlaying={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className={cn(
              "absolute inset-0 size-full scale-[1.03] object-cover object-top transition-opacity duration-500",
              showPlaying ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {animatedImage && hasLoaded && isActive && (
          // A plain img: next/image would not restart the GIF on each hover.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={animatedImage}
            alt=""
            aria-hidden="true"
            onLoad={() => setIsPlaying(true)}
            className={cn(
              "absolute inset-0 size-full scale-[1.03] object-cover object-top transition-opacity duration-500",
              showPlaying ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />

        {project.metadata.isFeatured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary" />
            Featured
          </span>
        )}

        {hasPreview && (
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {showPlaying ? (
              <>
                <span className="size-1.5 rounded-full bg-green-500" />
                Playing
              </>
            ) : (
              <>
                <PlayIcon className="size-3 fill-current" />
                <span className="[@media(hover:none)]:hidden">
                  Hover to preview
                </span>
                <span className="hidden [@media(hover:none)]:inline">
                  Preview
                </span>
              </>
            )}
          </span>
        )}

        <span className="absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-neutral-950 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          View project
          <ArrowUpRightIcon className="size-3" />
        </span>
      </div>

      <div className="flex flex-col gap-1.5 px-0.5">
        <h3
          title={project.title}
          className={cn(
            "truncate font-semibold text-foreground",
            wide ? "text-lg sm:text-xl" : "text-base"
          )}
        >
          {project.title}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-5 text-muted-foreground">
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground/80">
            {project.tags.slice(0, 4).join(" · ")}
          </p>
        )}
      </div>
    </button>
  )
}
