import { ArrowUpRightIcon, ImageIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const cardClassName =
  "group flex h-full w-full flex-col rounded-xl border border-border p-4 text-left transition-colors hover:border-foreground/20 hover:bg-muted/30"

/**
 * The compact card shared by side projects and case studies, so both read
 * the same. Pass `href` to link to a page, or `onClick` to open a dialog.
 */
export default function WorkCard({
  title,
  label,
  description,
  footer,
  thumbnail,
  imageCount = 0,
  href,
  onClick,
}: {
  title: string
  label?: string | null
  description: string
  footer?: string | null
  thumbnail?: { url: string; alt: string; lqip: string | null } | null
  imageCount?: number
  href?: string
  onClick?: () => void
}) {
  const content = (
    <>
      <div className="flex w-full items-start gap-3">
        {thumbnail && (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted/30">
            <Image
              src={thumbnail.url}
              alt={thumbnail.alt}
              fill
              sizes="48px"
              className="object-cover"
              placeholder={thumbnail.lqip ? "blur" : "empty"}
              blurDataURL={thumbnail.lqip || undefined}
            />
            {imageCount > 1 && (
              <span className="absolute right-0.5 bottom-0.5 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white">
                <ImageIcon className="size-2.5" />
                {imageCount}
              </span>
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {/* Every row has a fixed line count so cards line up in the grid. */}
          {label && (
            <span
              title={label}
              className="block truncate text-[10px] font-semibold tracking-wider text-primary uppercase"
            >
              {label}
            </span>
          )}
          <h3
            title={title}
            className="truncate text-sm font-semibold text-foreground sm:text-base"
          >
            {title}
          </h3>
        </div>
        <ArrowUpRightIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
      {footer && (
        <p
          title={footer}
          className="mt-auto truncate pt-3 text-[11px] text-muted-foreground/70"
        >
          {footer}
        </p>
      )}
    </>
  )

  return href ? (
    <Link href={href} className={cardClassName}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cardClassName}>
      {content}
    </button>
  )
}
