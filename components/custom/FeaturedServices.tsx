import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import type { ServiceInterface } from "@/type"
import Carousel from "./Carousel"

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
      <Carousel label="Services" itemName="service">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex w-full flex-col rounded-xl border border-border p-4"
          >
            <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
              {service.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
              {service.tagline}
            </p>
            <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-muted-foreground">
              <span>{service.price || "Contact for pricing"}</span>
              <span>{service.timeline || "Flexible timeline"}</span>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  )
}
