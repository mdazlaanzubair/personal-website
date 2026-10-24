import ResearchList from "@/components/custom/research-list/ResearchList"
import JsonLd from "@/components/seo/JsonLd"
import { toPublications } from "@/src/sanity/adapters"
import { buildTimeFetch, client } from "@/src/sanity/client"
import { PUBLICATIONS_LIST_QUERY } from "@/src/sanity/queries"
import { createPageMetadata } from "@/src/seo/site"
import { createResearchPageJsonLd } from "@/src/seo/structured-data"
import type { PublicationInterface } from "@/type"

const options = buildTimeFetch
const description =
  "Research publications by Muhammad Azlaan Zubair, including full abstracts, co-authors, publication status, journals, and DOI links."

export const metadata = createPageMetadata({
  title: "Research",
  description,
  path: "/research",
  keywords: [
    "Muhammad Azlaan Zubair research",
    "software engineering research papers",
    "artificial intelligence publications",
    "computer science scholarly articles",
    "Google Scholar researcher",
  ],
})

export const dynamic = "force-static"
export const revalidate = false

export default async function Page() {
  let publications: PublicationInterface[] = []
  let fetchError: string | null = null

  try {
    const res = await client.fetch(PUBLICATIONS_LIST_QUERY, {}, options)
    publications = toPublications(res)
  } catch (error: unknown) {
    console.error("Sanity fetch error:", error)
    fetchError =
      error instanceof Error ? error.message : "Failed to load publications."
  }

  const researchJsonLd = createResearchPageJsonLd({
    publications,
    description,
  })

  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className="flex flex-col"
    >
      <JsonLd data={researchJsonLd} />
      {publications.length === 0 ? (
        <div className="rounded-md border border-dashed border-accent bg-muted/20 p-4">
          <p className="text-sm font-medium text-muted-foreground">
            {fetchError || "No research publications have been added yet."}
          </p>
        </div>
      ) : (
        <ResearchList publications={publications} />
      )}
    </section>
  )
}
