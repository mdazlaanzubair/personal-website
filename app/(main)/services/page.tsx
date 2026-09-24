import ServicesPageContent from "@/components/custom/ServicesPageContent"
import {
  toServices,
  toServiceTestimonials,
  toWorkItems,
} from "@/src/sanity/adapters"
import { client } from "@/src/sanity/client"
import {
  SERVICES_QUERY,
  SERVICE_TESTIMONIALS_QUERY,
  WORK_LIST_QUERY,
} from "@/src/sanity/queries"
import { createPageMetadata } from "@/src/seo/site"

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "I build launch-ready SaaS MVPs, AI tools, landing pages, and Chrome extensions in 7 business days. Book a free discovery call.",
  path: "/services",
  keywords: [
    "SaaS MVP development",
    "AI tool development",
    "landing page development",
    "Chrome extension development",
    "freelance software engineer",
    "productized services",
    "MVP in 7 days",
  ],
})

export const revalidate = 21600

const fetchOptions = {
  next: { revalidate: 21600, tags: ["sanity-services"] },
}

export default async function ServicesPage() {
  const [servicesResult, testimonialsResult, workResult] =
    await Promise.allSettled([
      client.fetch(SERVICES_QUERY, {}, fetchOptions),
      client.fetch(SERVICE_TESTIMONIALS_QUERY, {}, fetchOptions),
      client.fetch(WORK_LIST_QUERY, {}, {
        next: { revalidate: 21600, tags: ["sanity-work"] },
      }),
    ])

  const services =
    servicesResult.status === "fulfilled"
      ? toServices(servicesResult.value)
      : []
  const testimonials =
    testimonialsResult.status === "fulfilled"
      ? toServiceTestimonials(testimonialsResult.value)
      : []
  const allProjects =
    workResult.status === "fulfilled" ? toWorkItems(workResult.value) : []
  const featuredProjects = allProjects.filter((p) => p.metadata.isFeatured)

  if (servicesResult.status === "rejected")
    console.error("Sanity services fetch error:", servicesResult.reason)
  if (testimonialsResult.status === "rejected")
    console.error(
      "Sanity testimonials fetch error:",
      testimonialsResult.reason
    )
  if (workResult.status === "rejected")
    console.error("Sanity work fetch error:", workResult.reason)

  return (
    <ServicesPageContent
      services={services}
      testimonials={testimonials}
      featuredProjects={featuredProjects}
    />
  )
}
