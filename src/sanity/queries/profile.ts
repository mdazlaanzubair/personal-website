import { defineQuery } from "next-sanity"

import {
  portableTextMembersProjection,
  timestampsProjection,
} from "./fragments"

export const EXPERIENCE_QUERY = defineQuery(/* groq */ `
  *[_type == "experience"]
  | order(_updatedAt desc) {
    "company": select(
      company.isAnonymized == true => {
        "name": "Confidential organization",
        "website": null,
        "location": company.location,
        "isAnonymized": true
      },
      {
        "name": coalesce(company.name, "Organization"),
        "website": company.website,
        "location": company.location,
        "isAnonymized": false
      }
    ),
    timeline,
    role,
    "key_contributions": coalesce(key_contributions[]{
      ${portableTextMembersProjection}
    }, []),
    ${timestampsProjection}
  }
`)

export const ACADEMIC_HISTORY_QUERY = defineQuery(/* groq */ `
  *[_type == "academic"]
  | order(_updatedAt desc) {
    "institute": {
      "name": institute.name,
      "website": institute.website
    },
    degree,
    field,
    timeline,
    ${timestampsProjection}
  }
`)

export const SOCIAL_PROFILES_QUERY = defineQuery(/* groq */ `
  coalesce(*[_id == "siteSettings"][0].socialMedia, [])[]{
    _key,
    platform,
    username,
    url,
    "isHidden": isHidden == true
  }
`)

export const SKILLS_QUERY = defineQuery(/* groq */ `
  coalesce(*[_id == "siteSettings"][0].skills, [])[]{
    "id": _key,
    "title": coalesce(title, "Untitled skill"),
    "tags": coalesce(tags, [])
  }
`)

export const INTERESTS_QUERY = defineQuery(/* groq */ `
  coalesce(*[_id == "siteSettings"][0].interests, [])
`)
