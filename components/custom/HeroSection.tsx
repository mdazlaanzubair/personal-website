"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon, DownloadIcon, MapPinIcon } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

export default function HeroSection() {
  return (
    <section className="pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="flex flex-col-reverse gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
        {/* Text content */}
        <div className="flex-1 space-y-6">
          <motion.span
            className="eyebrow"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Software Engineer &amp; Researcher
          </motion.span>

          <motion.h1
            className="display-heading"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Building intelligent systems for real&#8209;world impact.
          </motion.h1>

          <motion.p
            className="section-subtitle max-w-md"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            I&apos;m Md. Azlaan Zubair, a software engineer focused on scalable
            systems, AI, and human&#8209;centered products.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              View my work
              <ArrowRightIcon className="size-3.5" />
            </Link>
            <Link
              href="/resume/Resume - Software Engineer - Muhammad Azlaan Zubair.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Download CV
              <DownloadIcon className="size-3.5" />
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 text-sm text-muted-foreground"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="size-3.5" />
              Karachi, Pakistan
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              Open to opportunities
            </span>
          </motion.div>
        </div>

        {/* Portrait */}
        <motion.div
          className="relative shrink-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="relative h-36 w-36 overflow-hidden rounded-2xl sm:h-44 sm:w-44">
            <Image
              src="/portrait.png"
              alt="Muhammad Azlaan Zubair"
              fill
              sizes="(max-width: 640px) 144px, 176px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
