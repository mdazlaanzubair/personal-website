import ServicesPageContent from "@/components/custom/ServicesPageContent"
import JsonLd from "@/components/seo/JsonLd"
import {
  toClientProjects,
  toServices,
  toServiceTestimonials,
} from "@/src/sanity/adapters"
import { client } from "@/src/sanity/client"
import {
  CLIENT_PROJECTS_QUERY,
  SERVICES_QUERY,
  SERVICE_TESTIMONIALS_QUERY,
} from "@/src/sanity/queries"
import { createPageMetadata } from "@/src/seo/site"
import { createServicesPageJsonLd } from "@/src/seo/structured-data"

const description =
  "Hire a software engineer to build and deploy your MVP in 7 business days. SaaS apps, AI tools, landing pages, automation — fixed price, full handoff."

export const metadata = createPageMetadata({
  title: "Build Your MVP in 7 Days | Muhammad Azlaan Zubair",
  description,
  path: "/services",
  keywords: [
    "hire developer to build MVP",
    "build MVP in 7 days",
    "MVP developer for startups",
    "SaaS MVP developer",
    "Next.js developer for hire",
    "Chrome extension developer",
    "AI automation setup",
    "technical writing for developers",
    "freelance software engineer Pakistan",
    "software engineer Karachi",
    "hire developer Karachi",
    "fixed price MVP development",
    "productized development services",
  ],
})

export const revalidate = 21600

const fetchOptions = {
  next: { revalidate: 21600, tags: ["sanity-services"] },
}

export default async function ServicesPage() {
  const [servicesResult, testimonialsResult, clientProjectsResult] =
    await Promise.allSettled([
      client.fetch(SERVICES_QUERY, {}, fetchOptions),
      client.fetch(SERVICE_TESTIMONIALS_QUERY, {}, fetchOptions),
      client.fetch(CLIENT_PROJECTS_QUERY, {}, fetchOptions),
    ])

  const services =
    servicesResult.status === "fulfilled"
      ? toServices(servicesResult.value)
      : []
  const testimonials =
    testimonialsResult.status === "fulfilled"
      ? toServiceTestimonials(testimonialsResult.value)
      : []
  const featuredProjects =
    clientProjectsResult.status === "fulfilled"
      ? toClientProjects(clientProjectsResult.value)
      : []

  if (servicesResult.status === "rejected")
    console.error("Sanity services fetch error:", servicesResult.reason)
  if (testimonialsResult.status === "rejected")
    console.error("Sanity testimonials fetch error:", testimonialsResult.reason)
  if (clientProjectsResult.status === "rejected")
    console.error(
      "Sanity client projects fetch error:",
      clientProjectsResult.reason
    )

  const servicesJsonLd = createServicesPageJsonLd({
    services,
    description,
  })

  return (
    <>
      <JsonLd data={servicesJsonLd} />
      <ServicesPageContent
        services={services}
        testimonials={testimonials}
        featuredProjects={featuredProjects}
      />
    </>
  )
}
