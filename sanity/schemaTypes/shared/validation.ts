import type { SlugIsUniqueValidator } from "sanity"

export const MAX_TITLE_LENGTH = 500
export const MAX_DESCRIPTION_LENGTH = 500
export const MAX_SEO_TITLE_LENGTH = 60
export const MAX_SEO_DESCRIPTION_LENGTH = 160

export const URL_PATTERN =
  /^(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d+)?(?:\/[^\s]*)?$/i
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const uniqueSlugWithinType: SlugIsUniqueValidator = async (
  slug,
  context
) => {
  const { document, getClient } = context

  if (!document?._id || !document._type) {
    return context.defaultIsUnique(slug, context)
  }

  const publishedId = document._id.replace(/^drafts\./, "")
  const draftId = `drafts.${publishedId}`
  const client = getClient({ apiVersion: "2026-07-25" })

  return client.fetch<boolean>(
    /* groq */ `
      !defined(
        *[
          _type == $type &&
          slug.current == $slug &&
          !(_id in [$draftId, $publishedId])
        ][0]._id
      )
    `,
    {
      draftId,
      publishedId,
      slug,
      type: document._type,
    }
  )
}
