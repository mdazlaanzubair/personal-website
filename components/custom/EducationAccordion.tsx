"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Timeline from "@/components/seo/Timeline"
import type { AcademicInterface } from "@/type"
import { motion } from "framer-motion"
import Link from "next/link"

type EducationAccordionProps = {
  items: AcademicInterface[]
  fetchError?: string
}

const googleSearchUrl = (query: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(query)}`

export default function EducationAccordion({
  items,
  fetchError,
}: EducationAccordionProps) {
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
        <span className="eyebrow">Education</span>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Academic background
        </h2>
        <p className="mt-2 section-subtitle">
          Education laid the foundation of my technical and academic knowledge.
        </p>
      </motion.div>

      {fetchError ? (
        <p className="text-sm text-muted-foreground">{fetchError}</p>
      ) : (
        <Accordion hiddenUntilFound>
          {items.map((item, idx) => {
            const { institute, degree, field, timeline } = item
            const { website, name } = institute

            return (
              <AccordionItem
                key={`${name}-${degree}-${timeline}`}
                value={`education-${idx}`}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="group flex w-full items-start gap-4 py-4 hover:no-underline">
                  <div className="flex-1 text-left">
                    <p className="text-xs tabular-nums text-muted-foreground/60">
                      <Timeline value={timeline} />
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                      {degree}
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
                          {name}
                        </Link>
                      ) : (
                        <Link
                          href={googleSearchUrl(name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {name}
                        </Link>
                      )}
                      {field ? ` · ${field}` : ""}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-sm text-muted-foreground">
                    {field} at {name}
                  </p>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
    </section>
  )
}
