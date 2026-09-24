"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRightIcon,
  CheckIcon,
  PhoneIcon,
  QuoteIcon,
} from "lucide-react"

import type {
  ServiceInterface,
  ServiceTestimonialInterface,
  WorkInterface,
} from "@/type"

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

const BOOKING_URL = "https://calendar.app.google/Le7g5jxPwGDRSJRSA"

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery Call",
    description:
      "15-minute call to understand your idea, scope, and timeline.",
  },
  {
    step: "02",
    title: "Scope & Payment",
    description:
      "Clear deliverables, fixed price, payment before work begins.",
  },
  {
    step: "03",
    title: "I Build, You Review",
    description:
      "Daily progress updates. You see the product take shape in real time.",
  },
  {
    step: "04",
    title: "Delivery & Handoff",
    description:
      "Deployed, documented, and handed off with full source code.",
  },
]

function HeroSection() {
  return (
    <section className="pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="space-y-6">
        <motion.span
          className="eyebrow"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Productized Services
        </motion.span>

        <motion.h1
          className="display-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          I build your MVP in 7&nbsp;days.
        </motion.h1>

        <motion.p
          className="section-subtitle max-w-lg"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Launch-ready SaaS apps, AI tools, landing pages, and browser
          extensions&nbsp;&mdash; built by a software engineer with 5+ years of
          shipping production applications.
        </motion.p>

        <motion.div
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
            Book a Call
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function ServicePackages({ services }: { services: ServiceInterface[] }) {
  if (services.length === 0) return null

  return (
    <section className="border-t border-border py-16">
      <motion.span
        className="eyebrow"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={0}
      >
        What I Offer
      </motion.span>

      <motion.h2
        className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={1}
      >
        Service Packages
      </motion.h2>

      <div className="mt-10 space-y-0">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            className="border-b border-border py-6 first:pt-0"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            custom={i}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                  {service.title}
                </h3>
                {service.tagline && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {service.tagline}
                  </p>
                )}
              </div>
              <div className="flex items-baseline gap-3 sm:shrink-0 sm:text-right">
                {service.price && (
                  <span className="text-sm font-semibold text-foreground">
                    {service.price}
                  </span>
                )}
                {service.timeline && (
                  <span className="text-xs text-muted-foreground">
                    {service.timeline}
                  </span>
                )}
              </div>
            </div>

            {service.deliverables.length > 0 && (
              <ul className="mt-4 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <CheckIcon className="mt-0.5 size-3 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {service.stackTags.length > 0 && (
              <p className="mt-3 text-[11px] text-muted-foreground/60">
                {service.stackTags.join(" · ")}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="border-t border-border py-16">
      <motion.span
        className="eyebrow"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={0}
      >
        Process
      </motion.span>

      <motion.h2
        className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={1}
      >
        How It Works
      </motion.h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step, i) => (
          <motion.div
            key={step.step}
            className="relative"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            custom={i}
          >
            <span className="text-xs font-semibold tracking-widest text-primary">
              {step.step}
            </span>
            <h3 className="mt-2 font-heading text-base font-bold">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function FeaturedProjects({ projects }: { projects: WorkInterface[] }) {
  if (projects.length === 0) return null

  return (
    <section className="border-t border-border py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <span className="eyebrow">Featured Projects</span>
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
                  {project.tags.length > 0 && (
                    <p className="mt-1 text-[11px] text-muted-foreground/60">
                      {project.tags.slice(0, 4).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
              <ArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function TestimonialsSection({
  testimonials,
}: {
  testimonials: ServiceTestimonialInterface[]
}) {
  if (testimonials.length === 0) return null

  return (
    <section className="border-t border-border py-16">
      <motion.span
        className="eyebrow"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={0}
      >
        Client Feedback
      </motion.span>

      <motion.h2
        className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={1}
      >
        What Clients Say
      </motion.h2>

      <div className="mt-10 space-y-0">
        {testimonials.map((t, i) => (
          <motion.blockquote
            key={t.id}
            className="border-b border-border py-6"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            custom={i}
          >
            <QuoteIcon className="size-4 text-primary/40" />
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer className="mt-3">
              <span className="text-sm font-medium text-foreground">
                {t.clientName}
              </span>
              {(t.clientRole || t.projectType) && (
                <span className="text-xs text-muted-foreground">
                  {" "}
                  &mdash; {[t.clientRole, t.projectType].filter(Boolean).join(", ")}
                </span>
              )}
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="border-t border-border py-16">
      <div className="text-center">
        <motion.h2
          className="font-heading text-2xl font-bold tracking-tight sm:text-3xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          custom={0}
        >
          Have a project in mind?
        </motion.h2>

        <motion.p
          className="mx-auto mt-3 max-w-md text-sm text-muted-foreground"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          custom={1}
        >
          Book a free 15-minute discovery call and let&apos;s scope it together.
        </motion.p>

        <motion.div
          className="mt-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          custom={2}
        >
          <Link
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <ArrowRightIcon className="size-3.5" />
            Book a Call
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function ServicesPageContent({
  services,
  testimonials,
  featuredProjects,
}: {
  services: ServiceInterface[]
  testimonials: ServiceTestimonialInterface[]
  featuredProjects: WorkInterface[]
}) {
  return (
    <>
      <HeroSection />
      <ServicePackages services={services} />
      <ProcessSection />
      <FeaturedProjects projects={featuredProjects} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  )
}
