"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import type { SocialMediaInterface } from "@/type"

function FooterLogo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <span className="font-heading text-lg font-bold tracking-tight">AZ</span>
    )
  }

  return (
    <Image
      src={
        resolvedTheme === "dark" ? "/AZ-logo-light.svg" : "/AZ-logo-dark.svg"
      }
      alt="Azlaan Zubair"
      width={28}
      height={28}
      className="h-6 w-auto"
    />
  )
}

const EMAIL_LINK = { label: "Email", url: "mailto:mdazlaan1996@gmail.com" }

export function Footer({
  socialLinks,
}: {
  socialLinks: SocialMediaInterface[]
}) {
  // Every Sanity link not hidden from the portfolio, in its saved order.
  const links = [
    ...socialLinks.filter((link) => !link.hideFromPortfolio),
    EMAIL_LINK,
  ]

  return (
    <footer className="">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">
          <FooterLogo />
          <span className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Md. Azlaan Zubair
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {links.map((link) => {
            const isWeb = /^https?:\/\//i.test(link.url)
            return (
              <Link
                key={`${link.label}-${link.url}`}
                href={link.url}
                target={isWeb ? "_blank" : undefined}
                rel={isWeb ? "noopener noreferrer" : undefined}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
