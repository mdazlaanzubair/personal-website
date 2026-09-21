import WorkPageContent from "@/components/custom/WorkPageContent"
import JsonLd from "@/components/seo/JsonLd"
import { toPublications } from "@/src/sanity/adapters"
import { toWorkItems } from "@/src/sanity/adapters"
import { client } from "@/src/sanity/client"
import { PUBLICATIONS_LIST_QUERY, WORK_LIST_QUERY } from "@/src/sanity/queries"
import { createPageMetadata } from "@/src/seo/site"
import {
  createCollectionJsonLd,
  PERSON_ID,
  createResearchPageJsonLd,
} from "@/src/seo/structured-data"
import { absoluteUrl } from "@/src/seo/site"
import { toPlainText } from "next-sanity"

const description =
  "Selected projects, experiments, and research publications by Muhammad Azlaan Zubair — software engineer and researcher."

export const metadata = createPageMetadata({
  title: "Work",
  description,
  path: "/work",
  keywords: [
    "Muhammad Azlaan Zubair projects",
    "software architecture portfolio",
    "AI research publications",
    "web engineering projects",
    "open source developer",
  ],
})

export const revalidate = 21600

const fetchOptions = { next: { revalidate: 21600, tags: ["sanity-work"] } }

export default async function WorkPage() {
  const [projectsResult, publicationsResult] = await Promise.allSettled([
    client.fetch(WORK_LIST_QUERY, {}, fetchOptions),
    client.fetch(PUBLICATIONS_LIST_QUERY, {}, fetchOptions),
  ])

  const projects =
    projectsResult.status === "fulfilled"
      ? toWorkItems(projectsResult.value)
      : []
  const publications =
    publicationsResult.status === "fulfilled"
      ? toPublications(publicationsResult.value)
      : []

  const projectsJsonLd = createCollectionJsonLd({
    path: "/work",
    name: "Software and product engineering projects",
    description,
    items: projects.map((project) => {
      const featureList = toPlainText(project.metadata.key_contributions).trim()
      return {
        "@type": "SoftwareApplication",
        "@id": `${absoluteUrl("/work")}#${encodeURIComponent(project.id)}`,
        name: project.title,
        description: project.description,
        creator: { "@id": PERSON_ID },
        keywords: project.tags,
        ...(featureList ? { featureList } : {}),
        ...(project.metadata.projectUrl
          ? { url: project.metadata.projectUrl }
          : {}),
        ...(project.metadata.repositoryUrl
          ? { sameAs: [project.metadata.repositoryUrl] }
          : {}),
      }
    }),
  })

  const researchJsonLd = createResearchPageJsonLd({
    publications,
    description,
  })

  return (
    <>
      <JsonLd data={[projectsJsonLd, researchJsonLd]} />
      <WorkPageContent projects={projects} publications={publications} />
    </>
  )
}
