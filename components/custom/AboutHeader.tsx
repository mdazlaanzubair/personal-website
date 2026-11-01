"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Menu } from "@base-ui/react/menu"
import {
  CalendarIcon,
  ChevronDownIcon,
  DownloadIcon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
} from "lucide-react"
import { RESUME_FILES } from "@/src/resume/files"

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

export default function AboutHeader() {
  return (
    <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
      <motion.span
        className="eyebrow"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        About Me
      </motion.span>

      <motion.h1
        className="mt-4 max-w-xl display-heading"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        I design and build systems that scale.
      </motion.h1>

      <motion.div
        className="mt-10 space-y-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          I specialize in system architecture and web engineering. From backend
          services to frontend performance, I approach development with
          structure, clarity, and long-term thinking.
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Over the years, I&apos;ve led architectural initiatives, optimized
          high-traffic applications, and contributed to technical
          decision-making that supports product growth. I believe strong
          engineering is defined not just by delivery, but by durability.
        </p>

        <Menu.Root>
          <Menu.Trigger className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors outline-none hover:bg-foreground/90 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-popup-open:bg-foreground/90">
            <DownloadIcon className="size-3.5" />
            Download CV
            <ChevronDownIcon className="size-3.5 transition-transform in-data-popup-open:rotate-180" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={8} align="start" className="z-50">
              <Menu.Popup className="w-72 origin-(--transform-origin) rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg transition-[opacity,scale] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                {Object.values(RESUME_FILES).map((file) => (
                  <Menu.LinkItem
                    key={file.path}
                    href={file.path}
                    download={file.fileName}
                    closeOnClick
                    className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 outline-none data-highlighted:bg-muted"
                  >
                    <FileTextIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {file.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {file.description}
                      </span>
                    </span>
                    <DownloadIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  </Menu.LinkItem>
                ))}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <motion.div
          className="my-10 overflow-hidden rounded-2xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="relative aspect-[21/12] w-full">
            <Image
              src="/builder.png"
              alt="Muhammad Azlaan Zubair at work"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.blockquote
        className="mt-10 border-l-2 border-primary pl-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <p className="font-heading text-lg leading-snug font-medium tracking-tight text-foreground sm:text-xl">
          &ldquo;Better systems for a more thoughtful future.&rdquo;
        </p>
      </motion.blockquote>

      <motion.div
        className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <span className="inline-flex items-center gap-1.5">
          <MapPinIcon className="size-3.5" />
          Karachi, Pakistan
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MailIcon className="size-3.5" />
          mdazlaan1996@gmail.com
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="size-3.5" />
          Born July 1996
        </span>
      </motion.div>
    </section>
  )
}
