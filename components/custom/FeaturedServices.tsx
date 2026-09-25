import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import type { ServiceInterface } from "@/type"

export default function FeaturedServices({
  services,
}: {
  services: ServiceInterface[]
}) {
  if (services.length === 0) return null
  return (
    <section className="border-t border-border py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <span className="eyebrow">Services</span>
        <Link href="/services" className="section-link">
          View all services <ArrowRightIcon className="size-3" />
        </Link>
      </div>
      <div className="group/services relative overflow-hidden">
        <div className="flex w-max gap-3 group-focus-within/services:[animation-play-state:paused] group-hover/services:[animation-play-state:paused] motion-safe:animate-[services-marquee_28s_linear_infinite]">
          {[...services, ...services].map((service, index) => (
            <div
              key={`${service.id}-${index}`}
              className="w-[min(78vw,28rem)] shrink-0 rounded-xl border border-border p-4 sm:w-[23rem]"
            >
              <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                {service.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {service.tagline}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{service.price || "Contact for pricing"}</span>
                <span>{service.timeline || "Flexible timeline"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
