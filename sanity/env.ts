/**
 * Project settings for the hosted Studio and the Sanity CLI.
 *
 * The Studio is built by the Sanity CLI, which only exposes `SANITY_STUDIO_*`
 * variables to the browser bundle, so the Next.js `NEXT_PUBLIC_*` values are
 * not available there. Project ID and dataset are public identifiers, so they
 * are safe to commit.
 */
export const projectId = "mnmh1c4i"
export const dataset = "production"

/** Hostname on Sanity hosting: https://<studioHost>.sanity.studio */
export const studioHost = "mdazlaanzubair"
