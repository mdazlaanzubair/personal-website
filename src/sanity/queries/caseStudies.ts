import { defineQuery } from "next-sanity"

/**
 * Case-study queries for the Next.js site.
 *
 * Never add these fields to a query: results[] `evidence`,
 * image `visualId`, `internalNotes`. Teammate names are released only
 * when `canName` is true.
 */

const imageFields = /* groq */ `
  asset->{ _id, url, metadata { lqip, dimensions { width, height } } },
  alt,
  kind,
  caption,
  hotspot,
  crop
`

const cardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  subtitle,
  outcome,
  listing,
  priority,
  "clientName": select(
    client.visibility == "named" => client.company->name,
    client.publicLabel
  ),
  "via": select(client.company._ref == employer._ref => null, employer->name),
  startDate,
  endDate,
  "stack": stack[]->name,
  coverImage { ${imageFields} }
`

/** Work page: everything that isn't hidden, in display order. */
export const CASE_STUDIES_QUERY = defineQuery(/* groq */ `
  *[_type == "caseStudy" && defined(slug.current) && listing in ["featured", "listed"]]
    | order(priority asc, startDate desc) { ${cardFields} }
`)

/** Home "Selected work": featured only. The first one gets the large tile. */
export const FEATURED_CASE_STUDIES_QUERY = defineQuery(/* groq */ `
  *[_type == "caseStudy" && defined(slug.current) && listing == "featured"]
    | order(priority asc, startDate desc)[0...4] { ${cardFields} }
`)

/** One case-study page. */
export const CASE_STUDY_QUERY = defineQuery(/* groq */ `
  *[_type == "caseStudy" && slug.current == $slug && defined(listing) && listing != "hidden"][0] {
    ${cardFields},
    role,
    client { visibility, industry, region },
    team[] {
      _key,
      role,
      "name": select(canName == true => name, null),
      "profileUrl": select(canName == true => profileUrl, null)
    },
    links[] { _key, label, url },
    linkNote,
    problem,
    built[] { _key, title, description },
    decisions[] { _key, title, description },
    results[] { _key, statement, metric { value, prefix, suffix, label } },
    credit,
    coverVideoUrl,
    gallery[] { _key, ${imageFields} },
    "seo": {
      "title": coalesce(seo.title, title),
      "description": coalesce(seo.description, outcome),
      "ogImageUrl": coalesce(seo.ogImage.asset->url, coverImage.asset->url)
    },
    "next": *[
      _type == "caseStudy" && listing in ["featured", "listed"] && priority > ^.priority
    ] | order(priority asc)[0] { title, "slug": slug.current, outcome }
  }
`)

/** For generateStaticParams and sitemap.xml. */
export const CASE_STUDY_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "caseStudy" && defined(slug.current) && defined(listing) && listing != "hidden"] {
    "slug": slug.current,
    _updatedAt
  }
`)
