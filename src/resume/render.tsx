import "server-only"

import { renderToBuffer } from "@react-pdf/renderer"

import { getResumeData } from "./data"
import { RESUME_FILES, type ResumeVariant } from "./files"
import ResumeDocument from "./ResumeDocument"

/** Most pages each variant may run to; the academic CV has no limit. */
const MAX_PAGES: Partial<Record<ResumeVariant, number>> = { professional: 2 }

/** Counts page objects in a rendered PDF (not the /Pages tree node). */
const countPages = (pdf: Buffer) =>
  pdf.toString("latin1").match(/\/Type\s*\/Page(?![a-zA-Z])/g)?.length ?? 0

/** Renders a CV variant to a PDF response from fresh Sanity content. */
export async function renderResume(variant: ResumeVariant) {
  const data = await getResumeData()
  const pdf = await renderToBuffer(
    <ResumeDocument data={data} variant={variant} />
  )

  // A resume that spills a line onto an extra page looks careless, so fail
  // the build and make the content get trimmed instead of publishing it.
  const maxPages = MAX_PAGES[variant]
  const pages = countPages(pdf)
  if (maxPages && pages > maxPages) {
    throw new Error(
      `${RESUME_FILES[variant].fileName} is ${pages} pages, over the ${maxPages}-page limit. Shorten experience bullets, project descriptions or skills in Sanity.`
    )
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${RESUME_FILES[variant].fileName}"`,
    },
  })
}
