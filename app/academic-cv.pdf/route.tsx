import { renderResume } from "@/src/resume/render"

// Generated once per build from Sanity, like the pages, so publishing a
// content change (which redeploys the site) also refreshes the CV.
export const dynamic = "force-static"
export const revalidate = false

export function GET() {
  return renderResume("academic")
}
