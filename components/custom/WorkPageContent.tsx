"use client"

import { buttonVariants } from "@/components/ui/button"
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
  CaseStudyInterface,
  PublicationInterface,
  WorkInterface,
} from "@/type"
import ImageGallery from "./ImageGallery"
import ServicesInlineCta from "./ServicesInlineCta"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  Code2Icon,
  ExternalLinkIcon,
  ImageIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { PortableText, type PortableTextComponents } from "next-sanity"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease },
  }),
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease },
  }),
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="leading-6 [&:not(:first-child)]:mt-3">{children}</p>
    ),
    h2: ({ children }) => (
      <h4 className="mt-4 font-semibold text-foreground">{children}</h4>
    ),
    h3: ({ children }) => (
      <h4 className="mt-4 font-semibold text-foreground">{children}</h4>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 font-semibold text-foreground">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-primary pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-3 list-outside list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-3 list-outside list-decimal space-y-2 pl-5">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : undefined
      if (!href) return <>{children}</>
      const openInNewTab = value.openInNewTab === true
      return (
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="text-primary underline underline-offset-2"
        >
          {children}
        </a>
      )
    },
  },
}

const toDoiUrl = (doi: string | null) => {
  if (!doi) return null
  if (/^https?:\/\//i.test(doi)) return doi
  return `https://doi.org/${doi.replace(/^doi:\s*/i, "")}`
}

const toStatusLabel = (status: string) => {
  const label = status.replaceAll("_", " ")
  return label.charAt(0).toUpperCase() + label.slice(1)
}

type Category = "case-studies" | "projects" | "publications"
type Filter = "all" | Category

function SectionHeader({
  index,
  title,
  description,
  count,
}: {
  index: string
  title: string
  description: string
  count: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease }}
      className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4"
    >
      <div className="min-w-0">
        <span className="eyebrow">{index}</span>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
        {String(count).padStart(2, "0")}
      </span>
    </motion.div>
  )
}

function CaseStudyCard({
  study,
  index,
  isLead,
}: {
  study: CaseStudyInterface
  index: number
  isLead: boolean
}) {
  const meta = [study.metadata.company?.name, study.metadata.timeline]
    .filter(Boolean)
    .join(" · ")

  return (
    <motion.li
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={index}
      className={cn(isLead && "sm:col-span-2")}
    >
      <Link
        href={`/work/${study.slug}`}
        className={cn(
          "group flex h-full flex-col rounded-2xl border border-border bg-muted/20 p-5 transition-colors hover:border-foreground/20 hover:bg-muted/40 sm:p-6",
          isLead && "sm:p-8"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          {study.metadata.isFeatured && (
            <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
              Featured
            </span>
          )}
        </div>
        <h3
          className={cn(
            "mt-6 font-heading font-bold tracking-tight text-foreground",
            isLead ? "text-2xl sm:text-3xl" : "text-xl"
          )}
        >
          {study.title}
        </h3>
        {study.description && (
          <p
            className={cn(
              "mt-3 text-sm leading-6 text-muted-foreground",
              isLead ? "max-w-xl" : "line-clamp-3"
            )}
          >
            {study.description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
          {meta ? (
            <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              {meta}
            </p>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
            Read case study
            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.li>
  )
}

export default function WorkPageContent({
  caseStudies,
  projects,
  publications,
}: {
  caseStudies: CaseStudyInterface[]
  projects: WorkInterface[]
  publications: PublicationInterface[]
}) {
  const [filter, setFilter] = useState<Filter>("all")
  const [selectedProject, setSelectedProject] = useState<WorkInterface | null>(
    null
  )
  const [selectedPublication, setSelectedPublication] =
    useState<PublicationInterface | null>(null)

  const categories = (
    [
      { id: "case-studies", label: "Case studies", count: caseStudies.length },
      { id: "projects", label: "Side projects", count: projects.length },
      { id: "publications", label: "Publications", count: publications.length },
    ] satisfies { id: Category; label: string; count: number }[]
  ).filter((category) => category.count > 0)

  const sectionIndex = (id: Category) =>
    String(categories.findIndex((category) => category.id === id) + 1).padStart(
      2,
      "0"
    )
  const isVisible = (id: Category) =>
    (filter === "all" || filter === id) &&
    categories.some((category) => category.id === id)

  return (
    <>
      {/* Page header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-12">
        <motion.span
          className="eyebrow"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Work
        </motion.span>
        <motion.h1
          className="mt-4 display-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Systems I&apos;ve built, shipped, and studied.
        </motion.h1>
        <motion.p
          className="mt-4 max-w-xl section-subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Client case studies that show the problem underneath the brief, side
          projects where I test ideas in code, and published research.
        </motion.p>

        {categories.length > 1 && (
          <motion.div
            role="group"
            aria-label="Filter work"
            className="mt-8 flex flex-wrap gap-2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            {[
              {
                id: "all" as const,
                label: "All",
                count: categories.reduce((sum, c) => sum + c.count, 0),
              },
              ...categories,
            ].map((option) => {
              const isActive = filter === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(option.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  )}
                >
                  {option.label}
                  <span
                    className={cn(
                      "font-mono text-[10px] tabular-nums",
                      isActive
                        ? "text-background/70"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {option.count}
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </section>

      {categories.length === 0 && (
        <div className="mb-12 rounded-md border border-dashed border-accent bg-muted/20 p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Nothing has been added here yet.
          </p>
        </div>
      )}

      {/* Case studies */}
      {isVisible("case-studies") && (
        <section id="case-studies" className="scroll-mt-24 pb-14">
          <SectionHeader
            index={sectionIndex("case-studies")}
            title="Case studies"
            description="Client work, from the problem I was handed to the one I actually solved."
            count={caseStudies.length}
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {caseStudies.map((study, i) => (
              <CaseStudyCard
                key={study.id}
                study={study}
                index={i}
                isLead={i === 0 && caseStudies.length !== 2}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Side projects */}
      {isVisible("projects") && (
        <section id="projects" className="scroll-mt-24 pb-14">
          <SectionHeader
            index={sectionIndex("projects")}
            title="Side projects"
            description="Tools and experiments I build to test an idea end to end."
            count={projects.length}
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {projects.map((project, i) => (
              <motion.li
                key={project.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                custom={i}
              >
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="group flex h-full w-full flex-col rounded-xl border border-border p-4 text-left transition-colors hover:border-foreground/20 hover:bg-muted/30"
                >
                  <div className="flex w-full items-start gap-3">
                    {project.images.length > 0 && (
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted/30">
                        <Image
                          src={project.images[0].url}
                          alt={project.images[0].alt || project.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                          placeholder={
                            project.images[0].lqip ? "blur" : "empty"
                          }
                          blurDataURL={project.images[0].lqip || undefined}
                        />
                        {project.images.length > 1 && (
                          <span className="absolute right-0.5 bottom-0.5 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white">
                            <ImageIcon className="size-2.5" />
                            {project.images.length}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      {project.metadata.isFeatured && (
                        <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                          Featured
                        </span>
                      )}
                      <h3 className="text-sm font-semibold text-foreground sm:text-base">
                        {project.title}
                      </h3>
                    </div>
                    <ArrowUpRightIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {project.description}
                  </p>
                  {project.tags.length > 0 && (
                    <p className="mt-auto pt-3 text-[11px] text-muted-foreground/70">
                      {project.tags.slice(0, 4).join(" · ")}
                    </p>
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </section>
      )}

      {filter === "all" && projects.length > 0 && (
        <ServicesInlineCta
          text="Want me to build something like this for you?"
          href="/services?service=web-and-product#service-pages-block"
        />
      )}

      {/* Publications */}
      {isVisible("publications") && (
        <section id="publications" className="scroll-mt-24 pb-14">
          <SectionHeader
            index={sectionIndex("publications")}
            title="Publications"
            description="Published research and papers in progress."
            count={publications.length}
          />
          <ol className="space-y-0">
            {publications.map((pub, i) => {
              const isPublished = pub.metadata.status === "published"
              const isLastItem = i === publications.length - 1

              return (
                <motion.li
                  key={pub.id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  custom={i}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedPublication(pub)}
                    className={cn(
                      "group grid w-full grid-cols-[3rem_1fr_auto] items-start gap-4 border-b border-border py-5 text-left transition-colors hover:bg-muted/20 sm:grid-cols-[4rem_1fr_auto]",
                      isLastItem && "border-b-0"
                    )}
                  >
                    <span className="pt-0.5 font-mono text-xs text-muted-foreground tabular-nums">
                      {pub.metadata.year ?? "—"}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm leading-6 font-semibold text-foreground sm:text-base">
                        {pub.title}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5",
                            isPublished ? "text-foreground" : undefined
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "size-1.5 rounded-full",
                              isPublished
                                ? "bg-primary"
                                : "border border-muted-foreground/60"
                            )}
                          />
                          {toStatusLabel(pub.metadata.status)}
                        </span>
                        {pub.metadata.journal && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="italic">
                              {pub.metadata.journal}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRightIcon className="mt-1 size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </button>
                </motion.li>
              )
            })}
          </ol>
        </section>
      )}

      {/* Project detail modal */}
      <Dialog
        open={selectedProject !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null)
        }}
      >
        {selectedProject && (
          <DialogContent className="max-h-[85vh] overflow-hidden border border-border/60 bg-card sm:max-w-2xl">
            <DialogHeader>
              {selectedProject.metadata.isFeatured && (
                <span className="eyebrow text-[11px]">Featured project</span>
              )}
              <DialogTitle className="font-heading text-xl font-semibold normal-case">
                {selectedProject.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {selectedProject.description}
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[52vh] space-y-6 overflow-y-auto pr-2">
              {selectedProject.images.length > 0 && (
                <ImageGallery images={selectedProject.images} />
              )}

              {selectedProject.metadata.key_contributions.length > 0 && (
                <section>
                  <h3 className="mb-3 font-heading text-base font-semibold text-foreground">
                    Key contributions
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    <PortableText
                      value={selectedProject.metadata.key_contributions}
                      components={portableTextComponents}
                    />
                  </div>
                </section>
              )}

              {selectedProject.tags.length > 0 && (
                <ul aria-label="Technologies" className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <li
                      key={`${selectedProject.id}-${tag}`}
                      className="rounded-md border border-border bg-muted px-2 py-px text-[10px]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {(selectedProject.metadata.repositoryUrl ||
              selectedProject.metadata.projectUrl) && (
              <DialogFooter className="items-center border-t border-border py-4">
                <div className="flex items-center gap-2">
                  {selectedProject.metadata.repositoryUrl && (
                    <Link
                      href={selectedProject.metadata.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "gap-1 text-xs"
                      )}
                    >
                      <Code2Icon className="size-3" />
                      Source
                    </Link>
                  )}
                  {selectedProject.metadata.projectUrl && (
                    <Link
                      href={selectedProject.metadata.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "gap-1 text-xs text-primary hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <ExternalLinkIcon className="size-3" />
                      Visit project
                    </Link>
                  )}
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* Publication detail modal */}
      <Dialog
        open={selectedPublication !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPublication(null)
        }}
      >
        {selectedPublication && (
          <DialogContent className="overflow-hidden border border-border/60 bg-card sm:max-w-2xl">
            <DialogHeader className="border-b border-border pb-4">
              <span className="eyebrow text-[11px]">
                {toStatusLabel(selectedPublication.metadata.status)}
                {selectedPublication.metadata.year && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <time dateTime={String(selectedPublication.metadata.year)}>
                      {selectedPublication.metadata.year}
                    </time>
                  </>
                )}
              </span>
              <DialogTitle className="leading-8 normal-case">
                {selectedPublication.title}
              </DialogTitle>
              {selectedPublication.authors.length > 0 && (
                <DialogDescription render={<div />}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-foreground">
                      Authors
                    </span>
                    {selectedPublication.authors.map((author, index) => {
                      const normalizedAuthor = author.toLowerCase()
                      const isMainAuthor =
                        normalizedAuthor.includes("azlaan") ||
                        normalizedAuthor.includes("zubair")
                      return (
                        <span
                          key={`${selectedPublication.id}-${author}-${index}`}
                          className={cn(
                            "rounded-md border px-2 py-px text-[10px]",
                            isMainAuthor
                              ? "border-foreground/30 bg-muted/50 font-medium text-foreground"
                              : "border-border bg-muted/50 text-muted-foreground"
                          )}
                        >
                          {author}
                        </span>
                      )
                    })}
                  </div>
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="max-h-[52vh] space-y-6 overflow-y-auto pr-2">
              {selectedPublication.images.length > 0 && (
                <ImageGallery images={selectedPublication.images} />
              )}

              {selectedPublication.abstract && (
                <section>
                  <h3 className="mb-3 font-heading text-base font-semibold text-foreground">
                    Abstract
                  </h3>
                  <p className="text-justify text-xs leading-6 whitespace-pre-line text-muted-foreground">
                    {selectedPublication.abstract}
                  </p>
                </section>
              )}
            </div>

            {toDoiUrl(selectedPublication.metadata.doi) && (
              <DialogFooter className="items-center border-t border-border py-4">
                <Link
                  href={toDoiUrl(selectedPublication.metadata.doi)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "gap-1 text-xs"
                  )}
                >
                  Read publication
                  <ExternalLinkIcon className="size-3" />
                </Link>
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
