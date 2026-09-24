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

const SELECTED_PROJECTS = [
  {
    title: "Digital Asset Distribution Platform",
    domain: "Design Studio",
    description:
      "Multi-role file distribution system — client briefs, staff workflows, and secure deliverable downloads.",
    tags: ["Multi-role workflow", "File management", "Secure delivery"],
  },
  {
    title: "Document Intelligence System",
    domain: "Publishing",
    description:
      "RAG-powered QnA system for querying years of conference archives in natural language.",
    tags: ["RAG architecture", "Document processing", "Semantic search"],
  },
  {
    title: "Research Data Analysis Pipeline",
    domain: "Academic Research",
    description:
      "Automated data analysis tooling for MIS doctoral research.",
    tags: ["Data analysis", "Research automation", "Python"],
  },
  {
    title: "Computer Vision Model — Fire Detection",
    domain: "UAV Research",
    description:
      "Trained and evaluated fire detection model for unmanned aerial vehicle research paper.",
    tags: ["Computer vision", "Model training", "Research support"],
  },
  {
    title: "Enterprise Sales Collateral",
    domain: "Bridgestone",
    description:
      "Executive-level sales presentation for a global brand.",
    tags: ["Sales enablement", "Visual communication", "Enterprise"],
  },
  {
    title: "Content Workflow Automation",
    domain: "Creator Economy",
    description:
      "End-to-end n8n automation flow for content production and distribution.",
    tags: ["n8n", "Workflow automation", "API integration"],
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            className="flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            custom={i}
          >
            <h3 className="font-heading text-lg font-bold">{service.title}</h3>

            {service.tagline && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                {service.tagline}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              {service.price && (
                <span className="text-lg font-semibold text-foreground">
                  {service.price}
                </span>
              )}
              {service.timeline && (
                <span className="text-sm text-muted-foreground">
                  {service.timeline}
                </span>
              )}
            </div>

            {service.deliverables.length > 0 && (
              <ul className="mt-5 flex-1 space-y-2">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {service.stackTags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {service.stackTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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

function SelectedProjects() {
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
        Track Record
      </motion.span>

      <motion.h2
        className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={1}
      >
        Selected Projects
      </motion.h2>

      <div className="mt-10 space-y-0">
        {SELECTED_PROJECTS.map((project, i) => (
          <motion.div
            key={project.title}
            className="list-item-row flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:gap-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            custom={i}
          >
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h3 className="text-sm font-medium text-foreground">
                  {project.title}
                </h3>
                <span className="text-xs text-primary">{project.domain}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:shrink-0">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.blockquote
            key={t.id}
            className="flex flex-col rounded-xl border border-border bg-card p-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            custom={i}
          >
            <QuoteIcon className="size-5 text-primary/40" />
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer className="mt-4 border-t border-border pt-4">
              <span className="text-sm font-medium text-foreground">
                {t.clientName}
              </span>
              {(t.clientRole || t.projectType) && (
                <p className="text-xs text-muted-foreground">
                  {[t.clientRole, t.projectType].filter(Boolean).join(" · ")}
                </p>
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
}: {
  services: ServiceInterface[]
  testimonials: ServiceTestimonialInterface[]
}) {
  return (
    <>
      <HeroSection />
      <ServicePackages services={services} />
      <ProcessSection />
      <SelectedProjects />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  )
}
