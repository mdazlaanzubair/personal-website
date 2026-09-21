"use client"

import { motion } from "framer-motion"

export default function QuoteSection() {
  return (
    <section className="border-t border-border py-16">
      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="space-y-3"
      >
        <p className="font-heading text-xl leading-snug font-medium tracking-tight text-foreground sm:text-2xl">
          &ldquo;JavaScript is the duct tape of the Internet.&rdquo;
        </p>
        <cite className="block text-sm not-italic text-muted-foreground">
          — Charlie Campbell
        </cite>
      </motion.blockquote>
    </section>
  )
}
