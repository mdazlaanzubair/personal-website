import { defineQuery } from "next-sanity"

import { timestampsProjection } from "./fragments"

export const PUBLICATIONS_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "publication"]
  | order(
      (metadata.status == "published") desc,
      coalesce(metadata.isFeatured, false) desc,
      coalesce(sortOrder, -1) desc,
      metadata.year desc,
      _updatedAt desc,
      _id asc
    ) {
    "id": _id,
    title,
    abstract,
    "authors": coalesce(authors, []),
    sortOrder,
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
      "bibtex": metadata.bibtex,
      "isFeatured": metadata.isFeatured == true
    },
    ${timestampsProjection}
  }
`)
