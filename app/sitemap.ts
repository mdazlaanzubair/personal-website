import type { MetadataRoute } from "next"

import { buildTimeFetch, client } from "@/src/sanity/client"
import { CASE_STUDY_SLUGS_QUERY } from "@/src/sanity/queries"
import { absoluteUrl } from "@/src/seo/site"

export const dynamic = "force-static"
export const revalidate = false

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let caseStudies: MetadataRoute.Sitemap = []

  try {
    const studies = await client.fetch(
      CASE_STUDY_SLUGS_QUERY,
      {},
      buildTimeFetch
    )
    caseStudies = studies.map((study) => ({
      url: absoluteUrl(`/work/${study.slug}`),
      lastModified: study._updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    }))
  } catch (error: unknown) {
    console.error("Sanity case study slugs fetch error:", error)
  }

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.8,
      images: [absoluteUrl("/architect.png")],
    },
    {
      url: absoluteUrl("/work"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/services"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...caseStudies,
  ]
}
