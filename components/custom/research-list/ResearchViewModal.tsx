"use client"

import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { PublicationInterface } from "@/type"
import { ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

interface ResearchViewModalProps {
  isOpen: boolean
  data: PublicationInterface | null
  onClose: () => void
}

const toDoiUrl = (doi: string | null) => {
  if (!doi) return null
  if (/^https?:\/\//i.test(doi)) return doi

  return `https://doi.org/${doi.replace(/^doi:\s*/i, "")}`
}

const ResearchViewModal = ({
  isOpen,
  data,
  onClose,
}: ResearchViewModalProps) => {
  if (!data) return null

  const { authors, title, abstract, metadata } = data
  const { status, year, doi } = metadata
  const doiUrl = toDoiUrl(doi)
  const statusLabel = status.replaceAll("_", " ")

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="overflow-hidden border border-border/60 bg-card sm:max-w-2xl">
        <div className="flex w-full flex-col gap-6">
          <DialogHeader className="border-b border-accent pr-10 pb-4">
            <span className="eyebrow text-[11px]">
              {statusLabel}
              {year ? (
                <>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={String(year)}>{year}</time>
                </>
              ) : null}
            </span>
            <DialogTitle className="leading-8 normal-case">{title}</DialogTitle>
            {authors.length > 0 ? (
              <DialogDescription render={<div />}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    Authors
                  </span>
                  {authors.map((author, index) => {
                    const normalizedAuthor = author.toLowerCase()
                    const isMainAuthor =
                      normalizedAuthor.includes("azlaan") ||
                      normalizedAuthor.includes("zubair")

                    return (
                      <span
                        key={`${data.id}-${author}-${index}`}
                        className={cn(
                          isMainAuthor
                            ? "modal-tag-primary"
                            : "modal-tag-muted",
                          "border border-accent bg-muted p-2 text-[11px] leading-0"
                        )}
                      >
                        {author}
                      </span>
                    )
                  })}
                </div>
              </DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="max-h-64 space-y-6 overflow-y-auto pr-2">
            <section aria-labelledby={`${data.id}-modal-abstract`}>
              <h3
                id={`${data.id}-modal-abstract`}
                className="mb-3 font-heading text-base font-semibold text-foreground"
              >
                Abstract
              </h3>
              <p className="text-justify text-xs leading-6 whitespace-pre-line text-muted-foreground">
                {abstract}
              </p>
            </section>
          </div>
        </div>

        {doiUrl ? (
          <DialogFooter className="items-center border-t border-accent py-4 sm:justify-between">
            <div />
            <Link
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1 text-xs"
              )}
            >
              Read publication
              <ExternalLinkIcon className="size-3 transition-transform duration-150 group-hover/button:translate-x-0.5 motion-reduce:transform-none" />
            </Link>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default ResearchViewModal
