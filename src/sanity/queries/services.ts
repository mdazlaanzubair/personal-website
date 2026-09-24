import { defineQuery } from "next-sanity"

import {
  portableTextMembersProjection,
  timestampsProjection,
} from "./fragments"

export const SERVICES_QUERY = defineQuery(/* groq */ `
  *[_type == "service" && isActive == true]
  | order(coalesce(sortOrder, 999) asc, _updatedAt desc, _id asc) {
    "id": _id,
    title,
    "slug": slug.current,
    tagline,
    "description": coalesce(description[]{
      ${portableTextMembersProjection}
    }, []),
    price,
    timeline,
    "deliverables": coalesce(deliverables, []),
    "stackTags": coalesce(stackTags, []),
    sortOrder,
    ${timestampsProjection}
  }
`)

export const SERVICE_TESTIMONIALS_QUERY = defineQuery(/* groq */ `
  *[_type == "serviceTestimonial" && isActive == true]
  | order(coalesce(sortOrder, 999) asc, _updatedAt desc, _id asc) {
    "id": _id,
    clientName,
    clientRole,
    quote,
    projectType,
    ${timestampsProjection}
  }
`)

export const CLIENT_PROJECTS_QUERY = defineQuery(/* groq */ `
  *[_type == "clientProject" && isActive == true]
  | order(coalesce(sortOrder, 999) asc, _updatedAt desc, _id asc) {
    "id": _id,
    title,
    domain,
    description,
    "tags": coalesce(tags, []),
    sortOrder,
    ${timestampsProjection}
  }
`)
