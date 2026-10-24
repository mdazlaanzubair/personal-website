"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon, MapPinIcon, PhoneIcon } from "lucide-react"

const BOOKING_URL = "https://calendar.app.google/Le7g5jxPwGDRSJRSA"

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

/** Credentials a visitor should see in the first few seconds. */
const PROOF = [
  { value: "5+ years", label: "shipping production web apps" },
  { value: "PM Workbench AI", label: "Software Engineer, current" },
  { value: "Peer-reviewed", label: "AI for software engineering research" },
  { value: "Visiting faculty", label: "teaching software engineering & CS" },
]

const PREVIOUSLY = ["Cobone", "Yallacompare", "Transviti"]

export default function HeroSection() {
  return (
    <section className="pt-12 pb-14 sm:pt-16 sm:pb-16">
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
            Software Engineer · Researcher · Visiting Faculty
          </motion.span>

          <motion.h1
            className="display-heading"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            I build software that holds up in production.
          </motion.h1>

          <motion.p
            className="max-w-lg section-subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            I&apos;m Azlaan, a software engineer who builds web products,
            integrations and AI-enabled workflows. I also publish research on AI
            for software engineering, and teach software engineering at
            university level.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Link
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              <PhoneIcon className="size-3.5" />
              Book a call
            </Link>
            <Link
              href="/work#case-studies"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              See case studies
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground"
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
              Available for projects
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
              src="/architect.png"
              alt="Muhammad Azlaan Zubair"
              fill
              sizes="(max-width: 640px) 144px, 176px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Proof strip */}
      <motion.div
        className="mt-12"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={5}
      >
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {PROOF.map((item) => (
            <div key={item.value} className="bg-white p-4 dark:bg-black">
              <dt className="sr-only">{item.label}</dt>
              <dd className="font-heading text-base font-bold whitespace-nowrap text-foreground">
                {item.value}
              </dd>
              <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          Previously at{" "}
          {PREVIOUSLY.map((company, i) => (
            <span key={company}>
              <span className="font-medium text-foreground">{company}</span>
              {i < PREVIOUSLY.length - 1 && <span aria-hidden="true"> · </span>}
            </span>
          ))}
          <span aria-hidden="true" className="mx-2 text-muted-foreground/40">
            |
          </span>
          <span className="font-medium text-foreground">
            MS Software Engineering
          </span>
          , FAST
        </p>
      </motion.div>
    </section>
  )
}
