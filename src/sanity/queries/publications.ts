import { defineQuery } from "next-sanity"

import { timestampsProjection } from "./fragments"

export const PUBLICATIONS_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "publication"]
  | order(
      coalesce(metadata.isFeatured, false) desc,
      metadata.year desc,
      _updatedAt desc,
      _id asc
    ) {
    "id": _id,
    title,
    abstract,
    "authors": coalesce(authors, []),
    "images": coalesce(images[]{
      "url": asset->url,
      "alt": alt,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "lqip": asset->metadata.lqip
    }, []),
    "metadata": {
      "journal": metadata.journal,
      "status": metadata.status,
      "year": metadata.year,
      "doi": metadata.doi,
      "isFeatured": metadata.isFeatured == true
    },
    ${timestampsProjection}
  }
`)
