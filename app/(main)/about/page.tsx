import ExperienceAccordion from "@/components/custom/ExperienceAccordion"
import EducationAccordion from "@/components/custom/EducationAccordion"
import Skills from "@/components/custom/Skills"
import AboutHeader from "@/components/custom/AboutHeader"
import JsonLd from "@/components/seo/JsonLd"
import {
  toAcademicHistory,
  toExperience,
  toSkills,
} from "@/src/sanity/adapters"
import { client } from "@/src/sanity/client"
import {
  ACADEMIC_HISTORY_QUERY,
  EXPERIENCE_QUERY,
  SKILLS_QUERY,
} from "@/src/sanity/queries"
import { createPageMetadata } from "@/src/seo/site"
import { createAboutPageJsonLd } from "@/src/seo/structured-data"

const description =
  "Learn about Muhammad Azlaan Zubair's professional experience, academic background, software engineering skills, AI expertise, and technical interests."

export const metadata = createPageMetadata({
  title: "About",
  description,
  path: "/about",
  keywords: [
    "Muhammad Azlaan Zubair experience",
    "software architect biography",
    "web engineering skills",
    "AI engineer education",
    "Next.js and Sanity developer",
  ],
})

export const revalidate = 21600

const fetchOptions = {
  next: { revalidate: 21600, tags: ["sanity-about"] },
}

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback

export default async function AboutPage() {
  const [experienceResult, academicResult, skillsResult] =
    await Promise.allSettled([
      client.fetch(EXPERIENCE_QUERY, {}, fetchOptions),
      client.fetch(ACADEMIC_HISTORY_QUERY, {}, fetchOptions),
      client.fetch(SKILLS_QUERY, {}, fetchOptions),
    ])

  const experiences =
    experienceResult.status === "fulfilled"
      ? toExperience(experienceResult.value)
      : []
  const academics =
    academicResult.status === "fulfilled"
      ? toAcademicHistory(academicResult.value)
      : []
  const skillSets =
    skillsResult.status === "fulfilled" ? toSkills(skillsResult.value) : []

  const experienceError =
    experienceResult.status === "rejected"
      ? errorMessage(
          experienceResult.reason,
          "Professional experience is temporarily unavailable."
        )
      : undefined
  const academicError =
    academicResult.status === "rejected"
      ? errorMessage(
          academicResult.reason,
          "Academic history is temporarily unavailable."
        )
      : undefined
  const skillsError =
    skillsResult.status === "rejected"
      ? errorMessage(skillsResult.reason, "Skills are temporarily unavailable.")
      : undefined

  if (experienceError)
    console.error("Sanity experience fetch error:", experienceError)
  if (academicError)
    console.error("Sanity academic fetch error:", academicError)
  if (skillsError) console.error("Sanity skills fetch error:", skillsError)

  const aboutJsonLd = createAboutPageJsonLd({
    experiences,
    academics,
    skills: skillSets,
    description,
  })

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <AboutHeader />
      <ExperienceAccordion items={experiences} fetchError={experienceError} />
      <EducationAccordion items={academics} fetchError={academicError} />
      <Skills skillSets={skillSets} fetchError={skillsError} />
    </>
  )
}
