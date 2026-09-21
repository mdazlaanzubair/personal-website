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

const FOOTER_LINKS: { label: string; platform: string; fallbackUrl: string }[] =
  [
    {
      label: "GitHub",
      platform: "github",
      fallbackUrl: "https://github.com/mdazlaanzubair",
    },
    {
      label: "LinkedIn",
      platform: "linkedin",
      fallbackUrl: "https://www.linkedin.com/in/mdazlaanzubair",
    },
    {
      label: "Email",
      platform: "email",
      fallbackUrl: "mailto:mdazlaan1996@gmail.com",
    },
  ]

export function Footer({
  socialLinks,
}: {
  socialLinks: SocialMediaInterface[]
}) {
  const resolveUrl = (platform: string, fallbackUrl: string) => {
    if (platform === "email") return fallbackUrl
    const match = socialLinks.find((s) => s.platform === platform)
    return match?.url ?? fallbackUrl
  }

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">
          <FooterLogo />
          <span className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Md. Azlaan Zubair
          </span>
        </div>

        <div className="flex items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.platform}
              href={resolveUrl(link.platform, link.fallbackUrl)}
              target={link.platform !== "email" ? "_blank" : undefined}
              rel={
                link.platform !== "email" ? "noopener noreferrer" : undefined
              }
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
