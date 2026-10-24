import "server-only"
import { createClient } from "next-sanity"

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-05-15",
  // The site is fully static: data is only read at build time, so always
  // read the live API rather than the CDN to pick up a just-published change.
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN!,
})

/**
 * Fetch options for build-time reads. Pages export `dynamic = "force-static"`,
 * so they are generated once per deploy and never refreshed in the background;
 * publishing in Sanity triggers a redeploy instead.
 *
 * `no-store` keeps results out of the Data Cache, which persists across
 * deployments. Every build therefore reads fresh content from Sanity.
 */
export const buildTimeFetch = { cache: "no-store" } as const
