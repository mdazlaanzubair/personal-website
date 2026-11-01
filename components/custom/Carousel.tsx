"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Children, useEffect, useRef, useState, type ReactNode } from "react"

const arrowClassName =
  "inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-35"

/**
 * Cards in one snapping row that runs to the edge of the content panel.
 * The next card peeks in so the row reads as scrollable, and the arrows
 * page one card at a time.
 */
export default function Carousel({
  label,
  itemName,
  children,
}: {
  /** Accessible name for the row, e.g. "Case studies". */
  label: string
  /** Singular name used by the arrows, e.g. "case study". */
  itemName: string
  children: ReactNode
}) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = () => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new ResizeObserver(updateArrows)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  const page = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    // Scroll to the next card's own position (clamped to the end) rather
    // than by a fixed step, so snapping can't pull the row back.
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0
    const max = track.scrollWidth - track.clientWidth
    const stops = Array.from(track.children, (card) =>
      Math.min((card as HTMLElement).offsetLeft - padding, max)
    )
    const current = track.scrollLeft
    const target =
      direction === 1
        ? stops.find((stop) => stop > current + 4)
        : stops.findLast((stop) => stop < current - 4)
    track.scrollTo({
      left: target ?? (direction === 1 ? max : 0),
      behavior: "smooth",
    })
  }

  return (
    <div>
      <ul
        ref={trackRef}
        onScroll={updateArrows}
        aria-label={label}
        className="relative -mx-5 flex snap-x snap-mandatory scroll-px-5 [scrollbar-width:none] gap-3 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <li className="flex w-[85%] shrink-0 snap-start last:snap-end sm:w-[calc(50%-1.5rem)]">
            {child}
          </li>
        ))}
      </ul>

      {(canPrev || canNext) && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            aria-label={`Previous ${itemName}`}
            onClick={() => page(-1)}
            disabled={!canPrev}
            className={arrowClassName}
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label={`Next ${itemName}`}
            onClick={() => page(1)}
            disabled={!canNext}
            className={arrowClassName}
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
