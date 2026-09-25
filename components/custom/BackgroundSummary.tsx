import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import type { AcademicInterface, ExperienceInterface } from "@/type"

export default function BackgroundSummary({
  experiences,
  academics,
}: {
  experiences: ExperienceInterface[]
  academics: AcademicInterface[]
}) {
  return (
    <section className="border-t border-border py-20 sm:py-24">
      <div className="mb-8 flex items-baseline justify-between">
        <span className="eyebrow">Background</span>
        <Link href="/about" className="section-link">
          View full background <ArrowRightIcon className="size-3" />
        </Link>
      </div>
      <div className="grid gap-12 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-border">
        <div className="sm:pr-8">
          <h3 className="mb-3 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Experience
          </h3>
          <div className="">
            {experiences.slice(0, 3).map((item) => (
              <div
                key={`${item.company.name}-${item.role}`}
                className="flex flex-col gap-0 py-4 text-sm first:border-l-4 first:border-primary/30 first:pl-3 first:dark:bg-primary/5"
              >
                <span className="text-sm font-medium text-foreground">
                  {item.company.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.role} · {item.timeline}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="sm:pl-8">
          <h3 className="mb-3 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Academics
          </h3>
          <div className="">
            {academics.slice(0, 2).map((item) => (
              <div
                key={`${item.degree}-${item.institute.name}`}
                className="flex flex-col gap-0 py-4 text-sm first:border-l-4 first:border-primary/30 first:pl-3 first:dark:bg-primary/5"
              >
                <span className="text-sm font-medium text-foreground">
                  {item.degree}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.institute.name}
                </span>
              </div>
            ))}
            <div className="flex flex-col gap-0 py-4 text-sm">
              <span className="text-sm font-medium text-foreground">
                Published
              </span>
              <span className="text-xs text-muted-foreground">
                Peer-reviewed research in AI/SE · 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
