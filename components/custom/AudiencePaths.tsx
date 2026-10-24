import Link from "next/link"
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"

/**
 * One card per audience, so each visitor finds their next step in seconds.
 * Claims stay within brand-knowledge-base/02-azlaan-profile.md.
 */
const PATHS = [
  {
    audience: "Founders & clients",
    question: "Need something built?",
    text: "MVPs, websites, feature builds and AI automations. Scope and price are agreed before any work begins.",
    href: "/services",
    link: "See services & pricing",
  },
  {
    audience: "Hiring managers",
    question: "Hiring a software engineer?",
    text: "Frontend-strong engineer across React, Next.js and TypeScript, API and identity integrations, and AI-enabled product workflows.",
    href: "/about",
    link: "See my experience",
  },
  {
    audience: "Research labs & professors",
    question: "Looking for a research collaborator?",
    text: "Applied research in AI for software engineering: LLM-based test generation, reasoning models and evaluation. Peer-reviewed work published, more in progress.",
    href: "/work#publications",
    link: "See publications",
  },
]

export default function AudiencePaths() {
  return (
    <section className="border-t border-border py-16">
      <div className="mb-8">
        <span className="eyebrow">How I can help</span>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Find your way in.
        </h2>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {PATHS.map((path) => (
          <li key={path.audience} className="sm:last:odd:col-span-2">
            <Link
              href={path.href}
              className="group flex h-full flex-col rounded-xl border border-border p-5 transition-colors hover:border-foreground/20 hover:bg-muted/30"
            >
              <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                {path.audience}
              </span>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                {path.question}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {path.text}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-foreground">
                {path.link}
                <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted-foreground">
        I also write long-form investigations into AI claims and engineering
        decisions on{" "}
        <a
          href="https://letinix.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-foreground underline-offset-2 hover:underline"
        >
          Letinix
          <ArrowUpRightIcon className="size-3" />
        </a>
        , my independent publication.
      </p>
    </section>
  )
}
