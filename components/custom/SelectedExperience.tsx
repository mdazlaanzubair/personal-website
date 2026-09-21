"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"
import type { ExperienceInterface } from "@/type"

export default function SelectedExperience({
  experience,
}: {
  experience: ExperienceInterface | null
}) {
  if (!experience) return null

  return (
    <section className="border-t border-border py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <span className="eyebrow">Selected Experience</span>
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
          <p className="text-sm text-muted-foreground">{experience.timeline}</p>
          {experience.company.website ? (
            <Link
              href={experience.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              {experience.company.name}
              {experience.company.location
                ? `, ${experience.company.location}`
                : ""}
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground/60">
              {experience.company.name}
              {experience.company.location
                ? `, ${experience.company.location}`
                : ""}
            </p>
          )}
        </div>
        <h3 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {experience.role}
        </h3>
      </motion.div>
    </section>
  )
}
