"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"
import type { HashnodePost } from "@/src/hashnode/hashnode"
import { cn } from "@/lib/utils"

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
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

export default function LatestWriting({ posts }: { posts: HashnodePost[] }) {
  if (posts.length === 0) return null

  return (
    <section className="border-t border-border py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <span className="eyebrow">Latest Writing</span>
        <Link href="/writing" className="section-link">
          View all <ArrowRightIcon className="size-3" />
        </Link>
      </div>

      <div className="space-y-0">
        {posts.map((post, i) => {
          const isLastItem = i === posts.length - 1

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
                  "group flex items-baseline justify-between gap-4 border-b border-border py-4 transition-colors hover:bg-muted/20",
                  isLastItem && "border-b-0"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs text-muted-foreground/60 tabular-nums">
                    {formatDate(post.publishedAt)}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
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
  )
}
