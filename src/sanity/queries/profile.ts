import { defineQuery } from "next-sanity"

import {
  portableTextMembersProjection,
  timestampsProjection,
} from "./fragments"

export const EXPERIENCE_QUERY = defineQuery(/* groq */ `
  *[_type == "experience"]
  | order(coalesce(sortOrder, -1) desc, _updatedAt desc) {
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
    sortOrder,
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
  coalesce(*[_id == "siteSettings"][0].socialMedia, [])[defined(url)]{
    _key,
    // Links saved before the free-form schema have a platform instead of a
    // label, and one isHidden switch for both places.
    "label": coalesce(label, select(
      platform == "x" => "X",
      platform == "instagram" => "Instagram",
      platform == "linkedin" => "LinkedIn",
      platform == "github" => "Github",
      platform == "scholar" => "Google Scholar",
      platform == "whatsapp" => "WhatsApp",
      "Link"
    )),
    url,
    "hideFromPortfolio": coalesce(hideFromPortfolio, isHidden, false),
    "hideFromResume": coalesce(hideFromResume, isHidden, false)
  }
`)

export const CV_PROFILE_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{
    headline,
    location,
    email,
    phone,
    resumeSummary,
    academicSummary
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
