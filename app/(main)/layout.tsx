import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "@next/third-parties/google"
import {
  Geist_Mono,
  Oxanium,
  Red_Hat_Display,
  Playfair_Display,
} from "next/font/google"
import Script from "next/script"
import type { Viewport } from "next"

import "../globals.css"
import JsonLd from "@/components/seo/JsonLd"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import AnimatedBackground from "@/components/custom/AnimatedBackground"
import Navbar from "@/components/custom/Navbar"
import { Footer } from "@/components/custom/Footer"
import PortfolioAssistant from "@/components/custom/PortfolioAssistant"
import { toSocialProfiles } from "@/src/sanity/adapters"
import { client } from "@/src/sanity/client"
import { SOCIAL_PROFILES_QUERY } from "@/src/sanity/queries"
import { rootMetadata } from "@/src/seo/site"
import {
  createSiteJsonLd,
  DEFAULT_SOCIAL_PROFILES,
  resolveSocialProfiles,
} from "@/src/seo/structured-data"

export const metadata = rootMetadata
export const revalidate = 21600

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e12" },
  ],
}

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
})

const sansFont = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-sans",
})

const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let socialProfiles = DEFAULT_SOCIAL_PROFILES

  try {
    const response = await client.fetch(
      SOCIAL_PROFILES_QUERY,
      {},
      { next: { revalidate: 21600, tags: ["sanity-social-profiles"] } }
    )
    socialProfiles = resolveSocialProfiles(toSocialProfiles(response))
  } catch (error: unknown) {
    console.error("Sanity social profiles fetch error:", error)
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        sansFont.variable,
        headingFont.variable,
        monoFont.variable,
        "font-sans"
      )}
    >
      <body>
        <JsonLd data={createSiteJsonLd(socialProfiles)} />
        <ThemeProvider>
          <AnimatedBackground />
          <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
            <Navbar />
            <main className="flex-1">
              <div className="mx-auto max-w-3xl px-5 sm:px-8">{children}</div>
            </main>
            <Footer socialLinks={socialProfiles} />
          </div>
          {/* <PortfolioAssistant /> */}
          {/* Vercel Analytics */}
          <Analytics />
          {/* Google Analytics */}
          <GoogleAnalytics gaId="G-NETESH3QT8" />
          {/* Google AdSense */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1061119254656808"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          {/* Speed Insights */}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
