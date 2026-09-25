import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

export default function ServicesInlineCta({
  heading,
  text,
  href,
}: {
  heading?: string
  text: string
  href: string
}) {
  return (
    // <section className="border-t border-border py-14 sm:py-16">
    <section className="py-14 sm:py-16">
      <div className="rounded-2xl border border-border bg-muted/30 px-5 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {heading && (
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {heading}
              </h2>
            )}
            <p
              className={
                heading
                  ? "mt-3 max-w-2xl text-base leading-7 text-muted-foreground"
                  : "max-w-2xl text-base leading-7 text-muted-foreground"
              }
            >
              {text}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-foreground/90"
          >
            View Services
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
