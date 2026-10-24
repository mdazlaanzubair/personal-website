import Link from "next/link"
import { MailIcon, PhoneIcon } from "lucide-react"

const BOOKING_URL = "https://calendar.app.google/Le7g5jxPwGDRSJRSA"

/** Closing call to action for every audience: clients, hiring managers and researchers. */
export default function ContactCta() {
  return (
    <section className="py-14 sm:py-16">
      <div className="rounded-2xl border border-border bg-muted/30 px-5 py-8 text-center sm:px-8 sm:py-10">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Building, hiring, or researching?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-muted-foreground">
          Tell me what you&apos;re working on. A 15-minute call is the fastest
          way to see whether I&apos;m the right fit.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <PhoneIcon className="size-3.5" />
            Book a call
          </Link>
          <a
            href="mailto:mdazlaan1996@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <MailIcon className="size-3.5" />
            Email me
          </a>
        </div>
      </div>
    </section>
  )
}
