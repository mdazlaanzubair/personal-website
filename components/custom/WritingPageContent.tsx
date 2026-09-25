"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"
import type { HashnodePost } from "@/src/hashnode/hashnode"
import { cn } from "@/lib/utils"
import ServicesInlineCta from "./ServicesInlineCta"

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
      delay: i * 0.04,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function WritingPageContent({
  posts,
}: {
  posts: HashnodePost[]
}) {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-border pt-12 pb-16 sm:pt-16 sm:pb-20">
        <motion.span
          className="eyebrow"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Writings
        </motion.span>
        <motion.h1
          className="mt-4 display-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Ideas, notes, and explorations.
        </motion.h1>
        <motion.p
          className="mt-4 max-w-lg section-subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          I write about AI, software engineering, and the systems that shape our
          world.
        </motion.p>
      </section>

      {/* Posts list */}
      {posts.length > 0 ? (
        <section className="pb-16">
          <div className="space-y-0">
            {posts.map((post, i) => {
              const isLastItem = i === posts.length - 1

              if (i === 3) {
                return (
                  <ServicesInlineCta
                    text="Need technical content written by someone who actually builds the systems?"
                    href="/services?service=technical-writing#service-pages-block"
                  />
                )
              }

              return (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  custom={i}
                >
                  <Link
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-baseline justify-between gap-4 border-b border-border py-5 transition-colors",
                      isLastItem && "border-b-0"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-xs text-muted-foreground/60 tabular-nums">
                        {formatDate(post.publishedAt)}
                        {post.readTimeInMinutes > 0 && (
                          <span className="ml-2">
                            · {post.readTimeInMinutes} min read
                          </span>
                        )}
                      </p>
                      <h2 className="text-sm font-semibold text-foreground sm:text-base">
                        {post.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {post.brief}
                      </p>
                    </div>
                    <ArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>
      ) : (
        <section className="border-t border-border py-16">
          <p className="text-sm text-muted-foreground">
            No posts available at the moment.
          </p>
        </section>
      )}
    </>
  )
}
