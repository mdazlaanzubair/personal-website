"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import {
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  PhoneIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./ModeToggle"

interface NavItem {
  label: string
  href: string
  external?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Writing", href: "/writing" },
]

const MORE_ITEMS: NavItem[] = [
  {
    label: "Blog",
    href: "https://blog.mdazlaanzubair.com/",
    external: true,
  },
  {
    label: "Case Studies",
    href: "https://blog.mdazlaanzubair.com/series/case-studies",
    external: true,
  },
  {
    label: "Product Observations",
    href: "https://blog.mdazlaanzubair.com/series/product-observations",
    external: true,
  },
]

function Logo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <span className="font-heading text-xl font-bold tracking-tight">AZ</span>
    )
  }

  return (
    <Image
      src={
        resolvedTheme === "dark" ? "/AZ-logo-light.svg" : "/AZ-logo-dark.svg"
      }
      alt="Azlaan Zubair"
      width={36}
      height={36}
      className="h-8 w-auto"
      priority
    />
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!moreOpen) return
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-more-menu]")) setMoreOpen(false)
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false)
    }
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("keydown", esc)
    }
  }, [moreOpen])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass bg-transparent py-3">
        <nav
          className="mx-auto flex h-14 max-w-3xl items-center justify-between rounded-xl bg-white px-5 shadow sm:px-8 dark:bg-black"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Home">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-[calc(0.375rem+1px)] h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative" data-more-menu>
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors",
                  moreOpen
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
              >
                More
                <ChevronDownIcon
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    moreOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    className="absolute top-full right-0 z-50 mt-2 w-56 rounded-lg bg-white p-1.5 shadow-lg dark:bg-black"
                  >
                    {MORE_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <span>{item.label}</span>
                        <ExternalLinkIcon className="size-3 opacity-50" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            <Link
              href="https://calendar.app.google/Le7g5jxPwGDRSJRSA"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90 sm:inline-flex"
            >
              <PhoneIcon className="size-3" />
              Book a Call
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <XIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 z-40 overflow-hidden border-b glass md:hidden"
          >
            <div className="mx-auto max-w-3xl space-y-1 px-5 py-4 sm:px-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-2 border-t border-border" />

              {MORE_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span>{item.label}</span>
                  <ExternalLinkIcon className="size-3 opacity-50" />
                </Link>
              ))}

              <div className="my-2 border-t border-border" />

              <Link
                href="https://calendar.app.google/Le7g5jxPwGDRSJRSA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <PhoneIcon className="size-3.5" />
                Book a Call
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
