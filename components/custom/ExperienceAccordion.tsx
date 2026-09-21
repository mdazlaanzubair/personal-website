"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Timeline from "@/components/seo/Timeline"
import type { ExperienceInterface } from "@/type"
import { motion } from "framer-motion"
import { PortableText, type PortableTextComponents } from "next-sanity"
import Link from "next/link"

type ExperienceAccordionProps = {
  items: ExperienceInterface[]
  fetchError?: string
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h4 className="mt-4 font-medium text-foreground">{children}</h4>
    ),
    h3: ({ children }) => (
      <h4 className="mt-4 font-medium text-foreground">{children}</h4>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 font-medium text-foreground">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-outside list-disc space-y-1 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-outside list-decimal space-y-1 pl-5">{children}</ol>
    ),
  },
}

const googleSearchUrl = (query: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(query)}`

export default function ExperienceAccordion({
  items,
  fetchError,
}: ExperienceAccordionProps) {
  if (!fetchError && items.length === 0) return null

  return (
    <section className="border-t border-border py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className="mb-8"
      >
        <span className="eyebrow">Experience</span>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Where I&apos;ve worked
        </h2>
        <p className="mt-2 section-subtitle">
          Professional roles that shaped my expertise in product development
          &amp; engineering.
        </p>
      </motion.div>

      {fetchError ? (
        <p className="text-sm text-muted-foreground">{fetchError}</p>
      ) : (
        <Accordion defaultValue={["experience-0"]} hiddenUntilFound>
          {items.reverse().map((item, idx) => {
            const { key_contributions, company, role, timeline } = item
            const { website, location, name: companyName } = company

            return (
              <AccordionItem
                key={`${companyName}-${role}-${timeline}`}
                value={`experience-${idx}`}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="group flex w-full items-start gap-4 py-4 hover:no-underline">
                  <div className="flex-1 text-left">
                    <p className="text-xs tabular-nums text-muted-foreground/60">
                      <Timeline value={timeline} />
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                      {role}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {website ? (
                        <Link
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {companyName}
                        </Link>
                      ) : (
                        <Link
                          href={googleSearchUrl(companyName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {companyName}
                        </Link>
                      )}
                      {location ? ` · ${location}` : ""}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-1 text-sm leading-relaxed text-muted-foreground">
                    <PortableText
                      value={key_contributions}
                      components={portableTextComponents}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
    </section>
  )
}
