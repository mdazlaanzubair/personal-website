"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRightIcon,
  CheckIcon,
  PhoneCallIcon,
  PhoneIcon,
  QuoteIcon,
} from "lucide-react"

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

function ServicePackagesFallback() {
  return (
    <section className="border-t border-border py-16">
      <span className="eyebrow">What I Offer</span>
      <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        Service Packages
      </h2>
      <div className="mt-8 h-32 rounded-2xl border border-border bg-muted/20" />
    </section>
  )
}

function ServicePackages({ services }: { services: ServiceInterface[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestedService = searchParams.get("service")
  const [selectedId, setSelectedId] = useState(services[0]?.id ?? "")
  const [activeTab, setActiveTab] = useState("Highlights")

  const selectedService = useMemo(() => {
    const service = services.find((service) => service.id === selectedId)
    setActiveTab("Highlights")
    return service ?? services[0]
  }, [selectedId, services])

  const tabs = ["Highlights", "What You’ll Get"]

  useEffect(() => {
    if (services.length === 0) return

    const serviceFromUrl = services.find(
      (service) =>
        service.slug === requestedService || service.id === requestedService
    )

    setSelectedId((currentId) => {
      const nextId = serviceFromUrl?.id ?? services[0].id
      return currentId === nextId ? currentId : nextId
    })
  }, [requestedService, services])

  const handleSelectService = (service: ServiceInterface) => {
    setSelectedId(service.id)
    setActiveTab("Best For")

    const params = new URLSearchParams(searchParams.toString())
    if (service.slug) {
      params.set("service", service.slug)
    } else {
      params.set("service", service.id)
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (services.length === 0 || !selectedService) return null

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
        id="service-pages-block"
        className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={1}
      >
        Service Packages
      </motion.h2>

      <motion.div
        className="pt-8"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        custom={2}
      >
        <div
          className="-mx-4 flex w-full gap-0 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
          role="tablist"
          aria-label="Service packages"
        >
          {services.map((service) => {
            const isSelected = service.id === selectedService.id

            return (
              <button
                key={service.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`service-panel-${service.id}`}
                id={`service-tab-${service.id}`}
                onClick={() => handleSelectService(service)}
                className={`flex-1 shrink-0 border-b-2 px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm ${
                  isSelected
                    ? "border-primary font-semibold text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {service.title}
              </button>
            )
          })}
        </div>
      </motion.div>

      <motion.article
        key={selectedService.id}
        id={`service-panel-${selectedService.id}`}
        role="tabpanel"
        aria-labelledby={`service-tab-${selectedService.id}`}
        className="mt-8 min-w-0"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <div className="flex min-w-0 flex-col gap-5 pb-6 lg:flex-row lg:items-start lg:justify-between lg:pb-8">
          <div className="min-w-0">
            {/* <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              Package Details
            </p> */}
            <h3 className="mt-0 font-heading text-2xl font-bold tracking-tight break-words text-foreground sm:text-3xl">
              {selectedService.title}
            </h3>
            {selectedService.tagline && (
              <p className="mt-3 max-w-3xl text-sm leading-6 break-words text-muted-foreground sm:text-base">
                {selectedService.tagline}
              </p>
            )}
            {selectedService.description && (
              <p className="mt-4 max-w-3xl text-sm leading-7 break-words text-muted-foreground">
                {selectedService.description}
              </p>
            )}

            <Link
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex max-w-full items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              <PhoneCallIcon className="size-3.5 shrink-0" />
              <span className="truncate">Let&apos;s Discuss</span>
            </Link>
          </div>

          {(selectedService.price || selectedService.timeline) && (
            <div className="min-w-0 shrink-0 rounded-2xl border border-border bg-background p-4 lg:min-w-48 lg:text-right">
              {selectedService.price && (
                <p className="font-heading text-lg font-bold break-words text-foreground">
                  {selectedService.price}
                </p>
              )}
              {selectedService.timeline && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedService.timeline}
                </p>
              )}
            </div>
          )}
        </div>

        <div
          className="-mx-4 flex gap-0 overflow-x-auto px-4 py-2 sm:mx-0 sm:px-0"
          role="tablist"
          aria-label="Service details"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 px-4 py-2 text-sm font-light transition-colors ${activeTab === tab ? "border-foreground font-medium" : "text-muted-foreground hover:border-muted hover:text-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-32 pt-8" role="tabpanel">
          {activeTab === "Highlights" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedService.highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="rounded-2xl border border-border bg-muted/20 p-4"
                >
                  <h4 className="text-sm font-semibold text-foreground">
                    {highlight.label}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {highlight.description}
                  </p>
                </div>
              ))}
              <div className="col-span-1 pt-6 sm:col-span-2">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Best for
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedService.buyers.map((buyer) => (
                    <span
                      key={buyer}
                      className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
                    >
                      {buyer}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "What You’ll Get" && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {selectedService.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                >
                  <CheckIcon className="mt-1 size-3.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}

              <div className="col-span-1 pt-6 sm:col-span-2">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedService.stackTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ul>
          )}
        </div>
      </motion.article>
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

function FeaturedProjects({
  projects,
}: {
  projects: ClientProjectInterface[]
}) {
  if (projects.length === 0) return null

  return (
    <section className="border-t border-border py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <span className="eyebrow">Featured Projects</span>
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
  featuredProjects,
}: {
  services: ServiceInterface[]
  testimonials: ServiceTestimonialInterface[]
  featuredProjects: ClientProjectInterface[]
}) {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<ServicePackagesFallback />}>
        <ServicePackages services={services} />
      </Suspense>
      <ProcessSection />
      <FeaturedProjects projects={featuredProjects} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  )
}
