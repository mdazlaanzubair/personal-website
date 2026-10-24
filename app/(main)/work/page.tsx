import WorkPageContent from "@/components/custom/WorkPageContent"
import JsonLd from "@/components/seo/JsonLd"
import {
  toCaseStudies,
  toPublications,
  toWorkItems,
} from "@/src/sanity/adapters"
import { buildTimeFetch, client } from "@/src/sanity/client"
import {
  CASE_STUDIES_QUERY,
  PUBLICATIONS_LIST_QUERY,
  WORK_LIST_QUERY,
} from "@/src/sanity/queries"
import { createPageMetadata } from "@/src/seo/site"
import {
  createCollectionJsonLd,
  PERSON_ID,
  createResearchPageJsonLd,
} from "@/src/seo/structured-data"
import { absoluteUrl } from "@/src/seo/site"
import { toPlainText } from "next-sanity"

const description =
  "Client case studies, side projects, and research publications by Muhammad Azlaan Zubair — software engineer and researcher."

export const metadata = createPageMetadata({
  title: "Work",
  description,
  path: "/work",
  keywords: [
    "Muhammad Azlaan Zubair projects",
    "Muhammad Azlaan Zubair case studies",
    "software architecture portfolio",
    "AI research publications",
    "web engineering projects",
    "open source developer",
  ],
})

export const dynamic = "force-static"
export const revalidate = false

const fetchOptions = buildTimeFetch

export default async function WorkPage() {
  const [caseStudiesResult, projectsResult, publicationsResult] =
    await Promise.allSettled([
      client.fetch(CASE_STUDIES_QUERY, {}, fetchOptions),
      client.fetch(WORK_LIST_QUERY, {}, fetchOptions),
      client.fetch(PUBLICATIONS_LIST_QUERY, {}, fetchOptions),
    ])

  const caseStudies =
    caseStudiesResult.status === "fulfilled"
      ? toCaseStudies(caseStudiesResult.value)
      : []

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
    name: "Case studies and software projects",
    description,
    items: [
      ...caseStudies.map((study) => ({
        "@type": "CreativeWork",
        "@id": absoluteUrl(`/work/${study.slug}`),
        name: study.title,
        description: study.outcome,
        url: absoluteUrl(`/work/${study.slug}`),
        creator: { "@id": PERSON_ID },
        keywords: study.stack,
      })),
      ...projects.map((project) => {
        const featureList = toPlainText(
          project.metadata.key_contributions
        ).trim()
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
    ],
  })

  const researchJsonLd = createResearchPageJsonLd({
    publications,
    description,
  })

  return (
    <>
      <JsonLd data={[projectsJsonLd, researchJsonLd]} />
      <WorkPageContent
        caseStudies={caseStudies}
        projects={projects}
        publications={publications}
      />
    </>
  )
}
