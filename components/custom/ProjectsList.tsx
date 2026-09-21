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
import type { WorkInterface } from "@/type"
import { Code2Icon, ExternalLinkIcon } from "lucide-react"
import { PortableText, type PortableTextComponents } from "next-sanity"
import Link from "next/link"
import { useState } from "react"

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
      <ul className="my-3 grid list-outside list-disc grid-cols-1 space-y-2 pl-5 md:grid-cols-2">
        {children}
      </ul>
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

const ProjectsList = ({ projects }: { projects: WorkInterface[] }) => {
  const [selectedProject, setSelectedProject] = useState<WorkInterface | null>(
    null
  )

  const contributionsHeadingId = selectedProject
    ? `${encodeURIComponent(selectedProject.id)}-modal-contributions`
    : undefined

  return (
    <>
      <div className="motion-stagger flex flex-col gap-0">
        {projects.map((project) => (
          <article
            id={encodeURIComponent(project.id)}
            key={project.id}
            className="motion-lift group/project relative flex flex-col gap-3 border-b border-accent bg-card p-4 last:border-b-0 hover:bg-muted/30"
          >
            <button
              type="button"
              aria-label={`View details for ${project.title}`}
              aria-haspopup="dialog"
              onClick={() => setSelectedProject(project)}
              className="absolute inset-0 z-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
            />

            <header className="pointer-events-none relative z-10 min-w-0">
              {project.metadata.isFeatured ? (
                <span className="mb-1.5 block text-xs font-medium text-primary">
                  Featured
                </span>
              ) : null}

              <h2 className="line-clamp-1 truncate text-lg leading-snug font-semibold tracking-tight transition-colors group-hover/project:text-foreground sm:text-base">
                {project.title}
              </h2>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {project.description}
              </p>
            </header>
          </article>
        ))}
      </div>

      <Dialog
        open={selectedProject !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null)
        }}
      >
        {selectedProject ? (
          <DialogContent className="max-h-[85vh] overflow-hidden border border-border/60 bg-card sm:max-w-2xl">
            <DialogHeader>
              {selectedProject.metadata.isFeatured ? (
                <span className="eyebrow text-[11px]">Featured project</span>
              ) : null}
              <DialogTitle className="font-heading text-xl font-semibold normal-case">
                {selectedProject.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {selectedProject.description}
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[52vh] space-y-6 overflow-y-auto pr-2">
              <section aria-labelledby={contributionsHeadingId}>
                <h3
                  id={contributionsHeadingId}
                  className="mb-3 font-heading text-base font-semibold text-foreground"
                >
                  Key contributions
                </h3>
                {selectedProject.metadata.key_contributions.length > 0 ? (
                  <div className="text-xs text-muted-foreground">
                    <PortableText
                      value={selectedProject.metadata.key_contributions}
                      components={portableTextComponents}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No project contributions have been added yet.
                  </p>
                )}
              </section>

              {selectedProject.tags.length > 0 ? (
                <ul aria-label="Technologies" className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <li
                      key={`${selectedProject.id}-modal-${tag}`}
                      className="rounded-md border border-border bg-muted px-2 py-px text-[10px]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {selectedProject.metadata.repositoryUrl ||
            selectedProject.metadata.projectUrl ? (
              <DialogFooter className="items-center border-t border-accent py-4">
                <div className="flex items-center gap-2">
                  {selectedProject.metadata.repositoryUrl ? (
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
                  ) : null}
                  {selectedProject.metadata.projectUrl ? (
                    <Link
                      href={selectedProject.metadata.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "gap-1 text-xs text-primary hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <ExternalLinkIcon className="size-3 transition-transform duration-150 group-hover/button:translate-x-0.5 motion-reduce:transform-none" />
                      Visit project
                    </Link>
                  ) : null}
                </div>
              </DialogFooter>
            ) : null}
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  )
}

export default ProjectsList
