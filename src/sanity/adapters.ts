import type { PortableTextBlock } from "next-sanity"

import type {
  ACADEMIC_HISTORY_QUERY_RESULT,
  EXPERIENCE_QUERY_RESULT,
  INTERESTS_QUERY_RESULT,
  PUBLICATIONS_LIST_QUERY_RESULT,
  SKILLS_QUERY_RESULT,
  SOCIAL_PROFILES_QUERY_RESULT,
  WORK_LIST_QUERY_RESULT,
} from "@/sanity.types"
import type {
  AcademicInterface,
  ExperienceInterface,
  InterestType,
  PublicationInterface,
  ServiceInterface,
  ServiceTestimonialInterface,
  SkillInterface,
  SocialMediaInterface,
  WorkInterface,
} from "@/type"

/**
 * The locked frontend contracts use PortableTextBlock[], while the generated
 * query types correctly include this project's custom Portable Text members
 * (images, callouts, code, tables, and related-content references).
 *
 * This boundary is intentionally the only cast: Portable Text renderers receive
 * the original Sanity array unchanged, and all other fields remain checked
 * against their generated query result types.
 */
const asPortableTextBlocks = (body: unknown): PortableTextBlock[] =>
  body as PortableTextBlock[]

export const toPublications = (
  documents: PUBLICATIONS_LIST_QUERY_RESULT
): PublicationInterface[] => documents

export const toWorkItems = (
  documents: WORK_LIST_QUERY_RESULT
): WorkInterface[] =>
  documents.map((document) => ({
    ...document,
    metadata: {
      ...document.metadata,
      key_contributions: asPortableTextBlocks(
        document.metadata.key_contributions
      ),
    },
  }))

const looksLikeTimeline = (value: string) => /\b(?:19|20)\d{2}\b/.test(value)

export const toExperience = (
  documents: EXPERIENCE_QUERY_RESULT
): ExperienceInterface[] =>
  documents.map((document) => {
    const hasSwappedLocationAndTimeline =
      !looksLikeTimeline(document.timeline) &&
      looksLikeTimeline(document.company.location)

    return {
      ...document,
      company: {
        ...document.company,
        location: hasSwappedLocationAndTimeline
          ? document.timeline
          : document.company.location,
      },
      timeline: hasSwappedLocationAndTimeline
        ? document.company.location
        : document.timeline,
      key_contributions: asPortableTextBlocks(document.key_contributions),
    }
  })

export const toAcademicHistory = (
  documents: ACADEMIC_HISTORY_QUERY_RESULT
): AcademicInterface[] => documents

export const toSocialProfiles = (
  profiles: SOCIAL_PROFILES_QUERY_RESULT
): SocialMediaInterface[] => profiles

export const toSkills = (skills: SKILLS_QUERY_RESULT): SkillInterface[] =>
  skills

export const toInterests = (interests: INTERESTS_QUERY_RESULT): InterestType =>
  interests

export const toServices = (documents: unknown[]): ServiceInterface[] =>
  (documents as Record<string, unknown>[]).map((document) => ({
    ...(document as Omit<ServiceInterface, "description">),
    description: asPortableTextBlocks(document.description),
  }))

export const toServiceTestimonials = (
  documents: unknown[]
): ServiceTestimonialInterface[] =>
  documents as ServiceTestimonialInterface[]
