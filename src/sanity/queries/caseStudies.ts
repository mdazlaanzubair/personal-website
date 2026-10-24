import { defineQuery } from "next-sanity"

import {
  portableTextMembersProjection,
  timestampsProjection,
} from "./fragments"

// Anonymized organizations never expose a name or website to the frontend.
const caseStudyCardProjection = /* groq */ `
  "id": _id,
  title,
  "slug": slug.current,
  description,
  "tags": coalesce(tags, []),
  "metadata": {
    "isFeatured": metadata.isFeatured == true,
    "timeline": metadata.timeline,
    "projectName": metadata.project.name,
    "company": select(
      !defined(metadata.company) => null,
      metadata.company.isAnonymized == true => {
        "name": "Confidential organization",
        "isAnonymized": true
      },
      {
        "name": coalesce(metadata.company.name, "Organization"),
        "isAnonymized": false
      }
    )
  },
  ${timestampsProjection}
`

export const CASE_STUDIES_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "caseStudy" && defined(slug.current)]
  | order(coalesce(metadata.isFeatured, false) desc, _updatedAt desc, _id asc) {
    ${caseStudyCardProjection}
  }
`)

export const CASE_STUDY_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "caseStudy" && defined(slug.current)].slug.current
`)

export const CASE_STUDY_QUERY = defineQuery(/* groq */ `
  *[_type == "caseStudy" && slug.current == $slug][0] {
    ${caseStudyCardProjection},
    "body": coalesce(body[]{ ${portableTextMembersProjection} }, []),
    "seo": select(
      metadata.company.isAnonymized == true => {
        "title": title,
        "description": description,
        "noIndex": seo.noIndex == true
      },
      {
        "title": coalesce(seo.title, title),
        "description": coalesce(seo.description, description),
        "noIndex": seo.noIndex == true
      }
    )
  }
`)
