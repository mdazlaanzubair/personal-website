import HeroSection from "@/components/custom/HeroSection"
import AudiencePaths from "@/components/custom/AudiencePaths"
import FeaturedServices from "@/components/custom/FeaturedServices"
import SelectedWork from "@/components/custom/SelectedWork"
import ContactCta from "@/components/custom/ContactCta"
import { buildTimeFetch, client } from "@/src/sanity/client"
import {
  FEATURED_CASE_STUDIES_QUERY,
  WORK_LIST_QUERY,
  SERVICES_QUERY,
} from "@/src/sanity/queries"
import { toCaseStudies, toWorkItems, toServices } from "@/src/sanity/adapters"
import { createPageMetadata } from "@/src/seo/site"

const description =
  "Muhammad Azlaan Zubair — software engineer with 5+ years building web products, integrations and AI-enabled workflows. Published researcher in AI for software engineering and visiting faculty."

export const metadata = createPageMetadata({
  title: "Muhammad Azlaan Zubair — Software Engineer & Researcher",
  description,
  path: "/",
  keywords: [
    "Muhammad Azlaan Zubair",
    "software engineer",
    "AI researcher",
    "web engineering",
    "portfolio",
  ],
})

export const dynamic = "force-static"
export const revalidate = false

const fetchOptions = buildTimeFetch

export default async function Page() {
  const [workResult, servicesResult, caseStudiesResult] =
    await Promise.allSettled([
      client.fetch(WORK_LIST_QUERY, {}, fetchOptions),
      client.fetch(SERVICES_QUERY, {}, fetchOptions),
      client.fetch(FEATURED_CASE_STUDIES_QUERY, {}, fetchOptions),
    ])

  const featuredCaseStudies =
    caseStudiesResult.status === "fulfilled"
      ? toCaseStudies(caseStudiesResult.value)
      : []

  const allProjects =
    workResult.status === "fulfilled" ? toWorkItems(workResult.value) : []
  const services =
    servicesResult.status === "fulfilled"
      ? toServices(servicesResult.value)
      : []

  const featuredProjects = allProjects
    .filter((p) => p.metadata.isFeatured)
    .slice(0, 3)
  const selectedProjects =
    featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 3)

  return (
    <>
      <HeroSection />
      <AudiencePaths />
      <SelectedWork
        caseStudies={featuredCaseStudies}
        projects={selectedProjects}
      />
      <FeaturedServices services={services} />
      <ContactCta />
    </>
  )
}
