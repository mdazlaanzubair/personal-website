"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"
import type { AcademicInterface } from "@/type"

export default function SelectedEducation({
  academic,
}: {
  academic: AcademicInterface | null
}) {
  if (!academic) return null

  return (
    <section className="border-t border-border py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <span className="eyebrow">Education</span>
        <Link href="/about" className="section-link">
          View all <ArrowRightIcon className="size-3" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className="space-y-2"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-sm text-muted-foreground">{academic.timeline}</p>
          {academic.institute.website ? (
            <Link
              href={academic.institute.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              {academic.institute.name}
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground/60">
              {academic.institute.name}
            </p>
          )}
        </div>
        <h3 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {academic.degree}
        </h3>
        <p className="text-sm text-muted-foreground">{academic.field}</p>
      </motion.div>
    </section>
  )
}
