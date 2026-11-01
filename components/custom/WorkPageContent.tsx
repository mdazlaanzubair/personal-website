"use client"

import { cn } from "@/lib/utils"
import type {
  CaseStudyInterface,
  PublicationInterface,
  WorkInterface,
} from "@/type"
import Carousel from "./Carousel"
import CaseStudyCard from "./CaseStudyCard"
import ProjectCard from "./ProjectCard"
import ServicesInlineCta from "./ServicesInlineCta"
import { ProjectModal, PublicationModal, toStatusLabel } from "./WorkModals"
import { ArrowRightIcon } from "lucide-react"
import { motion } from "framer-motion"
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
      { id: "projects", label: "Projects", count: projects.length },
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
          className="mt-4 max-w-xl display-heading"
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
          Client case studies that show the problem underneath the brief,
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, ease }}
          >
            <Carousel label="Case studies" itemName="case study">
              {caseStudies.map((study) => (
                <CaseStudyCard key={study.id} study={study} />
              ))}
            </Carousel>
          </motion.div>
        </section>
      )}

      {/* Projects */}
      {isVisible("projects") && (
        <section id="projects" className="scroll-mt-24 pb-14">
          <SectionHeader
            index={sectionIndex("projects")}
            title="Projects"
            description="Tools and experiments I build to test an idea end to end."
            count={projects.length}
          />
          <ul className="grid gap-x-4 gap-y-9 sm:grid-cols-2">
            {projects.map((project, i) => (
              <motion.li
                key={project.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                custom={i}
                className={cn("min-w-0", i === 0 && "sm:col-span-2")}
              >
                <ProjectCard
                  project={project}
                  wide={i === 0}
                  onOpen={() => setSelectedProject(project)}
                />
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

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <PublicationModal
        publication={selectedPublication}
        onClose={() => setSelectedPublication(null)}
      />
    </>
  )
}
