import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

const items = [
  {
    label: "01 Build",
    text: "I ship MVPs, landing pages, and AI tools in 7 business days — fixed price, deployed.",
    href: "/services",
    link: "View Services",
  },
  {
    label: "02 Research",
    text: "I investigate software systems, AI claims, and the engineering decisions hiding underneath them.",
    href: "/research",
    link: "Explore my research",
  },
  {
    label: "03 Write",
    text: "22+ published articles investigating AI claims, engineering decisions, and product trade-offs.",
    href: "/writing",
    link: "Read the blog",
  },
  {
    label: "04 Automate",
    text: "I build automated solutions to streamline workflows and reduce manual effort.",
    href: "/services?service=automation-and-ai-setup#service-pages-block",
    link: "View Services",
  },
]

export default function WhatIDo() {
  return (
    <section className="border-t border-border py-16">
      <div className="mb-8">
        <span className="eyebrow">What I do</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 first:sm:col-span-2 last:sm:col-span-2"
          >
            <p className="eyebrow">{item.label}</p>
            <p className="mt-4 text-base leading-7 text-foreground">
              {item.text}
            </p>
            <Link href={item.href} className="mt-6 section-link inline-flex">
              {item.link} <ArrowRightIcon className="size-3" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
