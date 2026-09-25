import "server-only"

import { toPlainText } from "next-sanity"

import { getHashnodeRssPosts, type HashnodePost } from "@/src/hashnode/hashnode"
import {
  toAcademicHistory,
  toExperience,
  toInterests,
  toPublications,
  toSkills,
  toWorkItems,
} from "@/src/sanity/adapters"
import { client } from "@/src/sanity/client"
import {
  ACADEMIC_HISTORY_QUERY,
  EXPERIENCE_QUERY,
  INTERESTS_QUERY,
  PUBLICATIONS_LIST_QUERY,
  SKILLS_QUERY,
  WORK_LIST_QUERY,
} from "@/src/sanity/queries"
import { absoluteUrl } from "@/src/seo/site"
import type { KnowledgeDocument } from "./types"

const fetchOptions = {
  next: { revalidate: 21600, tags: ["assistant-knowledge"] },
}

const STATIC_KNOWLEDGE: KnowledgeDocument[] = [
  {
    id: "profile-core",
    kind: "profile",
    title: "Professional profile",
    body: [
      "Muhammad Azlaan Zubair is a software engineer and researcher based in Karachi, Pakistan.",
      "He works across scalable systems, product engineering, artificial intelligence, machine learning, and automation.",
      "His public handle is @mdazlaanzubair but only for Instagram it is @mdazlaanzubairr.",
      "Azlaan's contact number is not mentioned but visitors can contact him via his email, i.e. mdazlaan1996@gmail.com or other social media accounts like LinkedIn, Twitter, Instagram, etc.",
    ].join(" "),
    tags: [
      "profile",
      "about",
      "software engineering",
      "technical research",
      "AI",
      "automation",
      "Karachi",
    ],
    sourceUrl: absoluteUrl("/about"),
    citationLabel: "About",
  },
  {
    id: "principles-engineering",
    kind: "principle",
    title: "Engineering approach",
    body: [
      "Azlaan approaches development with structure, clarity, and long-term thinking.",
      "He has led architectural initiatives, optimized high-traffic applications, and contributed to technical decision-making that supports product growth.",
      "He believes strong engineering is defined not just by delivery, but by durability.",
    ].join(" "),
    tags: [
      "principles",
      "working style",
      "architecture",
      "clarity",
      "durability",
      "decision making",
    ],
    sourceUrl: absoluteUrl("/about"),
    citationLabel: "Professional summary",
  },
  {
    id: "principles-growth",
    kind: "principle",
    title: "Growth and reflection",
    body: [
      "Azlaan uses his portfolio to track his progress as a developer and designer. Thats why he preserved all of his portfolios in Github and hosted them in subdomains with proper versioning from v1.mdazlaanzubair.com to v5.mdazlaanzubair.com",
      "He values remembering what he has learned, observing how his design understanding changes over time, and sharing that journey so it may help others.",
    ].join(" "),
    tags: ["growth", "learning", "reflection", "design journey", "sharing"],
    sourceUrl: "https://github.com/mdazlaanzubair/the-chronicles-of-UI-UX",
    citationLabel: "Portfolio repository",
  },
]

const clean = (value: string | null | undefined) => value?.trim() || ""

const compact = (values: Array<string | null | undefined>) =>
  values.map(clean).filter(Boolean).join(" · ")

const postToDocument = (post: HashnodePost): KnowledgeDocument => ({
  id: `post-${post.id}`,
  kind: post.series ? "case-study" : "article",
  title: post.title,
  body: compact([
    post.brief,
    post.content,
    post.tags.length
      ? `Topics: ${post.tags.map((tag) => tag.name).join(", ")}`
      : undefined,
  ]),
  tags: [
    post.series ? "case study" : "article",
    ...post.tags.map((tag) => tag.name),
  ],
  sourceUrl: post.url,
  citationLabel: post.series ? "Case study" : "Writing",
  publishedAt: post.publishedAt,
})

export async function loadPortfolioKnowledge(): Promise<KnowledgeDocument[]> {
  const [
    experienceResult,
    academicResult,
    skillsResult,
    interestsResult,
    workResult,
    publicationsResult,
    postsResult,
  ] = await Promise.allSettled([
    client.fetch(EXPERIENCE_QUERY, {}, fetchOptions),
    client.fetch(ACADEMIC_HISTORY_QUERY, {}, fetchOptions),
    client.fetch(SKILLS_QUERY, {}, fetchOptions),
    client.fetch(INTERESTS_QUERY, {}, fetchOptions),
    client.fetch(WORK_LIST_QUERY, {}, fetchOptions),
    client.fetch(PUBLICATIONS_LIST_QUERY, {}, fetchOptions),
    getHashnodeRssPosts({ first: 30 }),
  ])

  const documents = [...STATIC_KNOWLEDGE]

  if (experienceResult.status === "fulfilled") {
    toExperience(experienceResult.value).forEach((experience, index) => {
      documents.push({
        id: `experience-${index}`,
        kind: "experience",
        title: `${experience.role} at ${experience.company.name}`,
        body: compact([
          experience.timeline,
          experience.company.location,
          toPlainText(experience.key_contributions),
        ]),
        tags: ["experience", experience.role, experience.company.name],
        sourceUrl: absoluteUrl("/about"),
        citationLabel: "Experience",
        updatedAt: experience.updatedAt,
      })
    })
  }

  if (academicResult.status === "fulfilled") {
    toAcademicHistory(academicResult.value).forEach((academic, index) => {
      documents.push({
        id: `education-${index}`,
        kind: "education",
        title: `${academic.degree} in ${academic.field}`,
        body: compact([
          academic.institute.name,
          academic.timeline,
          academic.institute.website,
        ]),
        tags: ["education", academic.degree, academic.field],
        sourceUrl: absoluteUrl("/about"),
        citationLabel: "Education",
        updatedAt: academic.updatedAt,
      })
    })
  }

  if (skillsResult.status === "fulfilled") {
    toSkills(skillsResult.value).forEach((skill) => {
      documents.push({
        id: `skill-${skill.id}`,
        kind: "skill",
        title: skill.title,
        body: `Skills and tools: ${skill.tags.join(", ")}`,
        tags: ["skills", skill.title, ...skill.tags],
        sourceUrl: absoluteUrl("/about"),
        citationLabel: "Skills",
      })
    })
  }

  if (interestsResult.status === "fulfilled") {
    const interests = toInterests(interestsResult.value)
    if (interests.length) {
      documents.push({
        id: "interests",
        kind: "interest",
        title: "Interests",
        body: interests.join(", "),
        tags: ["interests", ...interests],
        sourceUrl: absoluteUrl("/about"),
        citationLabel: "Interests",
      })
    }
  }

  if (workResult.status === "fulfilled") {
    toWorkItems(workResult.value).forEach((project) => {
      documents.push({
        id: `project-${project.id}`,
        kind: "project",
        title: project.title,
        body: compact([
          project.description,
          toPlainText(project.metadata.key_contributions),
          project.tags.length
            ? `Topics: ${project.tags.join(", ")}`
            : undefined,
        ]),
        tags: ["project", ...project.tags],
        sourceUrl: project.metadata.projectUrl || absoluteUrl("/projects"),
        citationLabel: "Project",
        updatedAt: project.updatedAt,
      })
    })
  }

  if (publicationsResult.status === "fulfilled") {
    toPublications(publicationsResult.value).forEach((publication) => {
      documents.push({
        id: `publication-${publication.id}`,
        kind: "publication",
        title: publication.title,
        body: compact([
          publication.abstract,
          publication.authors.length
            ? `Authors: ${publication.authors.join(", ")}`
            : undefined,
          publication.metadata.journal,
          publication.metadata.year
            ? String(publication.metadata.year)
            : undefined,
          `Status: ${publication.metadata.status.replaceAll("_", " ")}`,
        ]),
        tags: [
          "research",
          "publication",
          publication.metadata.status.replaceAll("_", " "),
        ],
        sourceUrl: publication.metadata.doi
          ? publication.metadata.doi.startsWith("http")
            ? publication.metadata.doi
            : `https://doi.org/${publication.metadata.doi.replace(/^doi:\s*/i, "")}`
          : absoluteUrl("/research"),
        citationLabel: "Research",
        updatedAt: publication.updatedAt,
      })
    })
  }

  if (postsResult.status === "fulfilled") {
    documents.push(...postsResult.value.map(postToDocument))
  }

  return documents.filter((document) => document.body.length > 0)
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "about",
  "can",
  "do",
  "does",
  "for",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "the",
  "to",
  "what",
  "which",
  "who",
  "with",
  "you",
  "your",
])

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))

const KIND_HINTS: Array<[RegExp, KnowledgeDocument["kind"][]]> = [
  [/\b(project|built|build|portfolio|work)\b/i, ["project", "case-study"]],
  [
    /\b(write|writing|wrote|blog|article|latest|recent|read)\b/i,
    ["article", "case-study"],
  ],
  [/\b(research|paper|publication|published|study)\b/i, ["publication"]],
  [/\b(experience|job|role|company|career|worked)\b/i, ["experience"]],
  [/\b(education|degree|university|academic)\b/i, ["education"]],
  [/\b(skill|stack|technology|tool|know)\b/i, ["skill", "project"]],
  [
    /\b(think|approach|principle|style|decision|behave|personality)\b/i,
    ["principle", "profile"],
  ],
  [/\b(interest|hobby|care about)\b/i, ["interest", "profile"]],
]

export function selectKnowledge(
  question: string,
  documents: KnowledgeDocument[],
  limit = 7
) {
  const terms = tokenize(question)
  const latestIntent = /\b(latest|newest|recent|recently)\b/i.test(question)

  return documents
    .map((document) => {
      const title = document.title.toLowerCase()
      const tags = document.tags.join(" ").toLowerCase()
      const body = document.body.toLowerCase()
      let score = document.kind === "profile" ? 1 : 0

      terms.forEach((term) => {
        if (title.includes(term)) score += 7
        if (tags.includes(term)) score += 4
        if (body.includes(term)) score += 1
      })

      KIND_HINTS.forEach(([pattern, kinds]) => {
        if (pattern.test(question) && kinds.includes(document.kind)) score += 6
      })

      if (
        latestIntent &&
        (document.kind === "article" || document.kind === "case-study")
      ) {
        score += 5
      }

      return { document, score }
    })
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score

      const rightDate = Date.parse(
        right.document.publishedAt || right.document.updatedAt || ""
      )
      const leftDate = Date.parse(
        left.document.publishedAt || left.document.updatedAt || ""
      )

      return (
        (Number.isNaN(rightDate) ? 0 : rightDate) -
        (Number.isNaN(leftDate) ? 0 : leftDate)
      )
    })
    .slice(0, limit)
    .map(({ document }) => document)
}
