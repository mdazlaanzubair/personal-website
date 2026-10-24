import type { PortableTextBlock } from "next-sanity"

import type {
  ACADEMIC_HISTORY_QUERY_RESULT,
  CASE_STUDIES_QUERY_RESULT,
  CASE_STUDY_QUERY_RESULT,
  EXPERIENCE_QUERY_RESULT,
  INTERESTS_QUERY_RESULT,
  PUBLICATIONS_LIST_QUERY_RESULT,
  SKILLS_QUERY_RESULT,
  SOCIAL_PROFILES_QUERY_RESULT,
  WORK_LIST_QUERY_RESULT,
} from "@/sanity.types"
import type {
  AcademicInterface,
  CaseStudyDetailInterface,
  CaseStudyInterface,
  ClientProjectInterface,
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
): PublicationInterface[] => documents as PublicationInterface[]

const toCaseStudyCard = ({
  _id,
  stack,
  ...document
}: CASE_STUDIES_QUERY_RESULT[number]): CaseStudyInterface => ({
  ...document,
  id: _id,
  stack: stack ?? [],
})

export const toCaseStudies = (
  documents: CASE_STUDIES_QUERY_RESULT
): CaseStudyInterface[] => documents.map(toCaseStudyCard)

export const toCaseStudy = (
  document: CASE_STUDY_QUERY_RESULT
): CaseStudyDetailInterface | null =>
  document
    ? {
        ...toCaseStudyCard(document),
        role: document.role,
        client: document.client
          ? {
              industry: document.client.industry,
              region: document.client.region,
            }
          : null,
        team: document.team ?? [],
        links: document.links ?? [],
        linkNote: document.linkNote,
        problem: asPortableTextBlocks(document.problem),
        built: document.built,
        decisions: document.decisions ?? [],
        results: document.results,
        credit: document.credit,
        coverVideoUrl: document.coverVideoUrl,
        gallery: document.gallery ?? [],
        seo: document.seo,
        next: document.next,
      }
    : null

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
  })) as WorkInterface[]

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
  documents as ServiceInterface[]

export const toServiceTestimonials = (
  documents: unknown[]
): ServiceTestimonialInterface[] => documents as ServiceTestimonialInterface[]

export const toClientProjects = (
  documents: unknown[]
): ClientProjectInterface[] => documents as ClientProjectInterface[]
