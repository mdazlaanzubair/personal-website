"use client"

import type { SkillInterface } from "@/type"
import { motion } from "framer-motion"

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

export default function Skills({
  skillSets,
  fetchError,
}: {
  skillSets: SkillInterface[]
  fetchError?: string
}) {
  return (
    <section className="border-t border-border py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className="mb-8"
      >
        <span className="eyebrow">Capabilities</span>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Skills &amp; tools
        </h2>
        <p className="mt-2 section-subtitle">
          A broad toolkit organized around shipping robust digital products.
        </p>
      </motion.div>

      {fetchError ? (
        <p className="text-sm text-muted-foreground">{fetchError}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skillSets.map((skillSet, i) => (
            <motion.div
              key={skillSet.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              custom={i}
              className="rounded-lg border border-border p-5"
            >
              <h3 className="font-heading text-sm font-semibold text-foreground">
                {skillSet.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {skillSet.tags.join(" · ")}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
