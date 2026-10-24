import ProjectsList from "@/components/custom/ProjectsList"
import JsonLd from "@/components/seo/JsonLd"
import { toWorkItems } from "@/src/sanity/adapters"
import { buildTimeFetch, client } from "@/src/sanity/client"
import { WORK_LIST_QUERY } from "@/src/sanity/queries"
import { absoluteUrl, createPageMetadata } from "@/src/seo/site"
import { createCollectionJsonLd, PERSON_ID } from "@/src/seo/structured-data"
import type { WorkInterface } from "@/type"
import { toPlainText } from "next-sanity"

const options = buildTimeFetch
const description =
  "Selected software architecture, web engineering, AI, automation, and product development projects by Muhammad Azlaan Zubair."

export const metadata = createPageMetadata({
  title: "Projects",
  description,
  path: "/projects",
  keywords: [
    "Muhammad Azlaan Zubair projects",
    "software architecture portfolio",
    "Next.js and Sanity projects",
    "AI automation applications",
    "open source web engineering",
  ],
})

export const dynamic = "force-static"
export const revalidate = false

const Page = async () => {
  let projects: WorkInterface[] = []
  let fetchError: string | null = null

  try {
    const response = await client.fetch(WORK_LIST_QUERY, {}, options)
    projects = toWorkItems(response)
  } catch (error: unknown) {
    console.error("Sanity projects fetch error:", error)
    fetchError =
      error instanceof Error ? error.message : "Failed to load projects."
  }

  const projectsJsonLd = createCollectionJsonLd({
    path: "/projects",
    name: "Software and product engineering projects",
    description,
    items: projects.map((project) => {
      const featureList = toPlainText(project.metadata.key_contributions).trim()

      return {
        "@type": "SoftwareApplication",
        "@id": `${absoluteUrl("/projects")}#${encodeURIComponent(project.id)}`,
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

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="flex flex-col"
    >
      <JsonLd data={projectsJsonLd} />
      {projects.length === 0 ? (
        <div className="rounded-md border border-dashed border-accent bg-muted/20 p-4">
          <p className="text-sm font-medium text-muted-foreground">
            {fetchError || "No projects have been added yet."}
          </p>
        </div>
      ) : (
        <ProjectsList projects={projects} />
      )}
    </section>
  )
}

export default Page
