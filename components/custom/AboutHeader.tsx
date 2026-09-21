"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { MapPinIcon, MailIcon, CalendarIcon } from "lucide-react"

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

export default function AboutHeader() {
  return (
    <section className="pb-16 pt-12 sm:pb-20 sm:pt-16">
      <motion.span
        className="eyebrow"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        About Me
      </motion.span>

      <motion.h1
        className="mt-4 display-heading"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        I design and build systems that scale.
      </motion.h1>

      <div className="mt-10 flex flex-col-reverse gap-8 sm:flex-row sm:gap-12">
        <motion.div
          className="flex-1 space-y-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            I specialize in system architecture and web engineering. From backend
            services to frontend performance, I approach development with
            structure, clarity, and long-term thinking.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Over the years, I&apos;ve led architectural initiatives, optimized
            high-traffic applications, and contributed to technical
            decision-making that supports product growth. I believe strong
            engineering is defined not just by delivery, but by durability.
          </p>
        </motion.div>

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

      <motion.blockquote
        className="mt-10 border-l-2 border-primary pl-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <p className="font-heading text-lg leading-snug font-medium tracking-tight text-foreground sm:text-xl">
          &ldquo;Better systems for a more thoughtful future.&rdquo;
        </p>
      </motion.blockquote>

      <motion.div
        className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <span className="inline-flex items-center gap-1.5">
          <MapPinIcon className="size-3.5" />
          Karachi, Pakistan
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MailIcon className="size-3.5" />
          mdazlaan1996@gmail.com
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="size-3.5" />
          Born July 1996
        </span>
      </motion.div>
    </section>
  )
}
