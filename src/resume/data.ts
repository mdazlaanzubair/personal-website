import "server-only"

import { toPlainText } from "next-sanity"

import {
  toAcademicHistory,
  toExperience,
  toPublications,
  toSkills,
  toSocialProfiles,
  toWorkItems,
} from "@/src/sanity/adapters"
import { buildTimeFetch, client } from "@/src/sanity/client"
import {
  ACADEMIC_HISTORY_QUERY,
  CV_PROFILE_QUERY,
  EXPERIENCE_QUERY,
  PUBLICATIONS_LIST_QUERY,
  SKILLS_QUERY,
  SOCIAL_PROFILES_QUERY,
  WORK_LIST_QUERY,
} from "@/src/sanity/queries"
import { formatTimeline, timelineSortKey } from "@/components/seo/Timeline"
import { SITE_NAME } from "@/src/seo/site"
import { CV_PROFILE_DEFAULTS } from "./defaults"
import type { ResumeVariant } from "./files"
import { resolveSocialProfiles } from "@/src/seo/structured-data"
import type {
  AcademicInterface,
  PublicationInterface,
  SkillInterface,
  WorkInterface,
} from "@/type"

export interface ResumeLink {
  label: string
  url: string
}

export interface ResumeExperience {
  role: string
  company: string
  companyUrl: string | null
  location: string
  timeline: string
  bullets: string[]
}

export interface ResumeData {
  name: string
  headline: string
  summaries: Record<ResumeVariant, string>
  location: ResumeLink
  email: string
  phone: string | null
  links: ResumeLink[]
  experience: ResumeExperience[]
  education: AcademicInterface[]
  skills: SkillInterface[]
  projects: WorkInterface[]
  publications: PublicationInterface[]
}

/** Collapses stray line breaks and spaces left in CMS text. */
const clean = (text: string) => text.replace(/\s+/g, " ").trim()

// Newest first, whatever order the entries were last edited in.
const byNewest = <T extends { timeline: string }>(items: T[]) =>
  [...items].sort(
    (a, b) => timelineSortKey(b.timeline) - timelineSortKey(a.timeline)
  )

// A degree that ends after this month is still in progress.
const isUpcoming = (timeline: string) => {
  const now = new Date()
  const thisMonth = now.getFullYear() * 12 + now.getMonth() + 1
  const end = timelineSortKey(timeline)
  return Number.isFinite(end) && end > thisMonth
}

const settled = <T>(result: PromiseSettledResult<T>, fallback: T) =>
  result.status === "fulfilled" ? result.value : fallback

/**
 * Reads everything the CV needs from Sanity at build time, the same way the
 * pages do, so a content change that triggers a redeploy also refreshes it.
 */
export async function getResumeData(): Promise<ResumeData> {
  const [
    experienceResult,
    academicResult,
    skillsResult,
    workResult,
    publicationsResult,
    socialResult,
    profileResult,
  ] = await Promise.allSettled([
    client.fetch(EXPERIENCE_QUERY, {}, buildTimeFetch),
    client.fetch(ACADEMIC_HISTORY_QUERY, {}, buildTimeFetch),
    client.fetch(SKILLS_QUERY, {}, buildTimeFetch),
    client.fetch(WORK_LIST_QUERY, {}, buildTimeFetch),
    client.fetch(PUBLICATIONS_LIST_QUERY, {}, buildTimeFetch),
    client.fetch(SOCIAL_PROFILES_QUERY, {}, buildTimeFetch),
    client.fetch(CV_PROFILE_QUERY, {}, buildTimeFetch),
  ])

  // Unlike a page section, a CV missing its experience is worse than a
  // stale one, so fail the build instead of publishing it.
  if (experienceResult.status === "rejected") {
    throw new Error("Could not load experience for the CV", {
      cause: experienceResult.reason,
    })
  }

  const experience = toExperience(experienceResult.value).map((item) => ({
    role: item.role,
    company: item.company.name,
    companyUrl: item.company.website,
    location: item.company.location,
    timeline: formatTimeline(item.timeline),
    bullets: item.key_contributions
      .map((block) => clean(toPlainText([block])))
      .filter(Boolean),
  }))

  // Every Sanity link not hidden from the resume, in its saved order.
  const links: ResumeLink[] = resolveSocialProfiles(
    toSocialProfiles(settled(socialResult, []))
  )
    .filter((link) => !link.hideFromResume)
    .map(({ label, url }) => ({ label, url }))

  // Sanity's CV fields win; any left empty fall back to the defaults.
  const profile = settled(profileResult, null)
  const pick = (value: string | null | undefined, fallback: string) =>
    value?.trim() || fallback
  const location = pick(profile?.location, CV_PROFILE_DEFAULTS.location)

  return {
    name: SITE_NAME,
    headline: pick(profile?.headline, CV_PROFILE_DEFAULTS.headline),
    summaries: {
      professional: pick(
        profile?.resumeSummary,
        CV_PROFILE_DEFAULTS.resumeSummary
      ),
      academic: pick(
        profile?.academicSummary,
        CV_PROFILE_DEFAULTS.academicSummary
      ),
    },
    location: {
      label: location,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
    },
    email: pick(profile?.email, CV_PROFILE_DEFAULTS.email),
    phone: profile?.phone?.trim() || null,
    links,
    experience,
    education: byNewest(toAcademicHistory(settled(academicResult, []))).map(
      (item) => ({
        ...item,
        timeline: isUpcoming(item.timeline)
          ? `${formatTimeline(item.timeline)} (expected)`
          : formatTimeline(item.timeline),
      })
    ),
    skills: toSkills(settled(skillsResult, [])).map((skill) => ({
      ...skill,
      tags: skill.tags.map(clean).filter(Boolean),
    })),
    projects: toWorkItems(settled(workResult, [])).map((project) => ({
      ...project,
      description: clean(project.description),
      tags: project.tags.map(clean).filter(Boolean),
    })),
    publications: toPublications(settled(publicationsResult, [])).map(
      (publication) => ({ ...publication, title: clean(publication.title) })
    ),
  }
}
