"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ClockIcon,
  PhoneCallIcon,
  PhoneIcon,
  QuoteIcon,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import type {
  ClientProjectInterface,
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
    description: "15-minute call to understand your idea, scope, and timeline.",
  },
  {
    step: "02",
    title: "Scope & Payment",
    description: "Clear deliverables, fixed price, payment before work begins.",
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
    description: "Deployed, documented, and handed off with full source code.",
  },
]

function HeroSection() {
  return (
    <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
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
          className="max-w-lg section-subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Launch-ready SaaS apps, AI tools, landing pages, and browser
          extensions built by a software engineer with years of shipping
          production applications.
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

function PricingFallback() {
  return (
    <section id="service-pages-block" className="border-t border-border py-16">
      <span className="eyebrow">Pricing</span>
      <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        Service Packages
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-96 rounded-2xl border border-border bg-muted/20"
          />
        ))}
      </div>
    </section>
  )
}

/** "Starting at $1,200" → { prefix: "Starting at", amount: "$1,200" } */
const splitPrice = (price: string) => {
  const match = price.match(/^(.*?)\s*([$€£]\s?[\d,.]+.*)$/)
  return match
    ? { prefix: match[1] || null, amount: match[2] }
    : { prefix: null, amount: price }
}

function PricingCard({
  service,
  index,
  isRequested,
  onViewDetails,
}: {
  service: ServiceInterface
  index: number
  isRequested: boolean
  onViewDetails: () => void
}) {
  const price = service.price ? splitPrice(service.price) : null
  const hasAbout = Boolean(service.description) || service.highlights.length > 0

  return (
    <motion.article
      id={`plan-${service.slug || service.id}`}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={index}
      className={cn(
        "flex scroll-mt-28 flex-col gap-6 rounded-2xl border bg-muted/20 p-6 sm:row-span-5 sm:grid sm:grid-rows-subgrid sm:gap-0",
        isRequested ? "border-primary ring-1 ring-primary" : "border-border"
      )}
    >
      {/* 1 · Plan */}
      <header>
        <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
          {service.title}
        </h3>
        {service.tagline && (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {service.tagline}
          </p>
        )}
      </header>

      {/* 2 · Price, timeline and call to action */}
      <div className="sm:pt-6">
        {price ? (
          <p>
            {price.prefix && (
              <span className="block text-xs text-muted-foreground">
                {price.prefix}
              </span>
            )}
            <span className="font-heading text-4xl font-bold tracking-tight text-foreground">
              {price.amount}
            </span>
          </p>
        ) : (
          <p className="font-heading text-2xl font-bold text-foreground">
            Contact for pricing
          </p>
        )}
        {service.timeline && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon className="size-3.5" />
            {service.timeline}
          </p>
        )}
        <Link
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          <PhoneCallIcon className="size-3.5 shrink-0" />
          Let&apos;s Discuss
        </Link>
      </div>

      {/* 3 · What you'll get */}
      <div className="border-t border-border pt-6 sm:mt-6">
        <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
          What you&apos;ll get
        </p>
        <ul className="mt-4 space-y-2.5">
          {service.deliverables.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
            >
              <CheckIcon className="mt-1 size-3.5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 4 · Best for and stack */}
      <div className="space-y-5 border-t border-border pt-6 sm:mt-6">
        {service.buyers.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Best for
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {service.buyers.map((buyer) => (
                <li
                  key={buyer}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {buyer}
                </li>
              ))}
            </ul>
          </div>
        )}
        {service.stackTags.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Stack
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {service.stackTags.join(" · ")}
            </p>
          </div>
        )}
      </div>

      {/* 5 · About this plan (opens the plan modal) */}
      {hasAbout ? (
        <div className="border-t border-border pt-5 sm:mt-6">
          <button
            type="button"
            onClick={onViewDetails}
            aria-haspopup="dialog"
            className="group/details flex w-full items-center justify-between text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            About this plan
            <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5" />
          </button>
        </div>
      ) : (
        <span aria-hidden="true" />
      )}
    </motion.article>
  )
}

function PricingPlans({ services }: { services: ServiceInterface[] }) {
  const [selectedService, setSelectedService] =
    useState<ServiceInterface | null>(null)
  const requestedService = useSearchParams().get("service")
  const requestedId = services.find(
    (service) =>
      service.slug === requestedService || service.id === requestedService
  )?.id

  useEffect(() => {
    if (!requestedId) return
    const service = services.find((s) => s.id === requestedId)
    document
      .getElementById(`plan-${service?.slug || requestedId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [requestedId, services])

  if (services.length === 0) return null

  return (
    <section
      id="service-pages-block"
      className="scroll-mt-24 border-t border-border py-16"
    >
      <motion.span
        className="eyebrow"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={0}
      >
        Pricing
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

      <motion.p
        className="mt-3 max-w-xl text-sm text-muted-foreground"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={2}
      >
        Scope and price are agreed on a discovery call, before any work begins.
      </motion.p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {services.map((service, i) => (
          <PricingCard
            key={service.id}
            service={service}
            index={i}
            isRequested={service.id === requestedId}
            onViewDetails={() => setSelectedService(service)}
          />
        ))}
      </div>

      {/* Plan detail modal */}
      <Dialog
        open={selectedService !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedService(null)
        }}
      >
        {selectedService && (
          <DialogContent className="max-h-[85vh] overflow-hidden border border-border/60 bg-card sm:max-w-2xl">
            <DialogHeader>
              {(selectedService.price || selectedService.timeline) && (
                <span className="eyebrow text-[11px]">
                  {[selectedService.price, selectedService.timeline]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
              <DialogTitle className="font-heading text-xl font-semibold normal-case">
                {selectedService.title}
              </DialogTitle>
              {selectedService.tagline && (
                <DialogDescription className="text-sm text-muted-foreground">
                  {selectedService.tagline}
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="max-h-[52vh] space-y-6 overflow-y-auto pr-2">
              {selectedService.description && (
                <section>
                  <h3 className="mb-3 font-heading text-base font-semibold text-foreground">
                    About this plan
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {selectedService.description}
                  </p>
                </section>
              )}

              {selectedService.highlights.length > 0 && (
                <section>
                  <h3 className="mb-3 font-heading text-base font-semibold text-foreground">
                    Highlights
                  </h3>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {selectedService.highlights.map((highlight) => (
                      <div
                        key={highlight.label}
                        className="rounded-xl border border-border bg-muted/20 p-4"
                      >
                        <dt className="text-sm font-semibold text-foreground">
                          {highlight.label}
                        </dt>
                        <dd className="mt-1.5 text-sm leading-6 text-muted-foreground">
                          {highlight.description}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </div>

            <DialogFooter className="items-center border-t border-border py-4">
              <Link
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <PhoneCallIcon className="size-3.5 shrink-0" />
                Let&apos;s Discuss
              </Link>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
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

function ClientProjects({ projects }: { projects: ClientProjectInterface[] }) {
  if (projects.length === 0) return null

  return (
    <section className="border-t border-border py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <span className="eyebrow">Client Projects</span>
      </div>

      <div className="space-y-0">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="border-b border-border py-4 last:border-0"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            custom={i}
          >
            <div className="flex min-w-0 items-baseline gap-4">
              <span className="shrink-0 text-xs text-muted-foreground/50 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {project.title}
                </h3>
                {project.domain && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {project.domain}
                  </p>
                )}
                <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
                  {project.description}
                </p>
                {project.tags.length > 0 && (
                  <p className="mt-1 text-[11px] text-muted-foreground/60">
                    {project.tags.slice(0, 4).join(" · ")}
                  </p>
                )}
              </div>
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

  const columns = [
    testimonials.filter((_, index) => index % 2 === 0),
    testimonials.filter((_, index) => index % 2 === 1),
  ].filter((column) => column.length > 0)

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

      <div className="relative mt-10 max-h-[42rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="group/testimonials min-h-0 overflow-hidden"
            >
              <div className="flex flex-col gap-4 group-focus-within/testimonials:[animation-play-state:paused] group-hover/testimonials:[animation-play-state:paused] motion-safe:animate-[testimonials-scroll-up_34s_linear_infinite]">
                {[...column, ...column].map((t, index) => (
                  <blockquote
                    key={`${t.id}-${index}`}
                    className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6"
                  >
                    <QuoteIcon className="size-4 text-primary/60" />
                    <p className="mt-4 text-sm leading-7 text-foreground sm:text-base">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer className="mt-6">
                      <span className="text-sm font-semibold text-foreground">
                        {t.clientName}
                      </span>
                      {(t.clientRole || t.projectType) && (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {[t.clientRole, t.projectType]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      )}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          ))}
        </div>
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
  clientProjects,
}: {
  services: ServiceInterface[]
  testimonials: ServiceTestimonialInterface[]
  clientProjects: ClientProjectInterface[]
}) {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<PricingFallback />}>
        <PricingPlans services={services} />
      </Suspense>
      <ProcessSection />
      <ClientProjects projects={clientProjects} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  )
}
