"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"
import type { WorkInterface } from "@/type"

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

export default function SelectedWork({
  projects,
}: {
  projects: WorkInterface[]
}) {
  if (projects.length === 0) return null

  return (
    <section className="border-t border-border py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <span className="eyebrow">Selected Work</span>
        <Link href="/work" className="section-link">
          View all <ArrowRightIcon className="size-3" />
        </Link>
      </div>

      <div className="space-y-0">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            custom={i}
          >
            <Link
              href="/work"
              className="group flex items-baseline justify-between gap-4 border-b border-border py-4 transition-colors hover:bg-muted/20"
            >
              <div className="flex min-w-0 items-baseline gap-4">
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-xs tabular-nums text-muted-foreground sm:inline">
                  {new Date(project.createdAt).getFullYear()}
                </span>
                <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
