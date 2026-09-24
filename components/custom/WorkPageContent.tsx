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
import type { PublicationInterface, WorkInterface } from "@/type"
import ImageGallery from "./ImageGallery"
import {
  ArrowRightIcon,
  Code2Icon,
  ExternalLinkIcon,
  ImageIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { PortableText, type PortableTextComponents } from "next-sanity"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

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

export default function WorkPageContent({
  projects,
  publications,
}: {
  projects: WorkInterface[]
  publications: PublicationInterface[]
}) {
  const [selectedProject, setSelectedProject] = useState<WorkInterface | null>(
    null
  )
  const [selectedPublication, setSelectedPublication] =
    useState<PublicationInterface | null>(null)

  return (
    <>
      {/* Page header */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <motion.span
          className="eyebrow"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Featured Work
        </motion.span>
        <motion.h1
          className="mt-4 display-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Projects that solve real problems.
        </motion.h1>
        <motion.p
          className="mt-4 max-w-lg section-subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          A collection of projects, experiments, and research publications.
        </motion.p>
      </section>

      {/* Projects section */}
      {projects.length > 0 && (
        <section className="border-t border-border py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-8"
          >
            <span className="eyebrow">Projects</span>
          </motion.div>

          <div className="space-y-0">
            {projects.map((project, i) => {
              const isLastItem = i === projects.length - 1

              return (
                <motion.div
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
                    className={cn(
                      "group flex w-full items-start gap-4 border-b border-border py-4 text-left transition-colors hover:bg-muted/20",
                      isLastItem && "border-b-0"
                    )}
                  >
                    {project.images.length > 0 && (
                      <div className="relative hidden size-14 shrink-0 overflow-hidden rounded-md bg-muted/30 sm:block">
                        <Image
                          src={project.images[0].url}
                          alt={project.images[0].alt || project.title}
                          fill
                          sizes="56px"
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
                      <div className="flex items-baseline gap-2">
                        {project.metadata.isFeatured && (
                          <span className="shrink-0 text-[10px] font-semibold tracking-wider text-primary uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground sm:text-base">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {project.description}
                      </p>
                      {project.tags.length > 0 && (
                        <p className="mt-1 text-[11px] text-muted-foreground/60">
                          {project.tags.slice(0, 4).join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-3 pt-1">
                      <span className="hidden text-xs text-muted-foreground tabular-nums sm:inline">
                        {new Date(project.createdAt).getFullYear()}
                      </span>
                      <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* Publications section */}
      {publications.length > 0 && (
        <section className="border-t border-border py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-8"
          >
            <span className="eyebrow">Publications &amp; Research</span>
          </motion.div>

          <div className="space-y-0">
            {publications.map((pub, i) => {
              const statusLabel = pub.metadata.status.replaceAll("_", " ")
              const isLastItem = i === publications.length - 1

              return (
                <motion.div
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
                      "group flex w-full items-start gap-4 border-b border-border py-4 text-left transition-colors hover:bg-muted/20",
                      isLastItem && "border-b-0"
                    )}
                  >
                    {pub.images.length > 0 && (
                      <div className="relative hidden size-14 shrink-0 overflow-hidden rounded-md bg-muted/30 sm:block">
                        <Image
                          src={pub.images[0].url}
                          alt={pub.images[0].alt || pub.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                          placeholder={pub.images[0].lqip ? "blur" : "empty"}
                          blurDataURL={pub.images[0].lqip || undefined}
                        />
                        {pub.images.length > 1 && (
                          <span className="absolute right-0.5 bottom-0.5 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white">
                            <ImageIcon className="size-2.5" />
                            {pub.images.length}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-muted-foreground/60 capitalize">
                        {pub.metadata.journal || statusLabel}
                      </p>
                      <h3 className="mt-0.5 text-sm font-semibold text-foreground sm:text-base">
                        {pub.title}
                      </h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 pt-1">
                      {pub.metadata.year && (
                        <span className="hidden text-xs text-muted-foreground tabular-nums sm:inline">
                          {pub.metadata.year}
                        </span>
                      )}
                      <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </div>
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
                {selectedPublication.metadata.status.replaceAll("_", " ")}
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
