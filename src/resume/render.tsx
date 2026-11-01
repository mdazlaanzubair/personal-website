import "server-only"

import { renderToBuffer } from "@react-pdf/renderer"

import { getResumeData } from "./data"
import { RESUME_FILES, type ResumeVariant } from "./files"
import ResumeDocument from "./ResumeDocument"

/** Renders a CV variant to a PDF response from fresh Sanity content. */
export async function renderResume(variant: ResumeVariant) {
  const data = await getResumeData()
  const pdf = await renderToBuffer(
    <ResumeDocument data={data} variant={variant} />
  )

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${RESUME_FILES[variant].fileName}"`,
    },
  })
}
