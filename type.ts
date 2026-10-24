import type { PortableTextBlock } from "next-sanity"

type PublicationStatus =
  "in_preparation" | "submitted" | "under_review" | "accepted" | "published"

type SocialPlatform = "x" | "instagram" | "linkedin" | "github" | "scholar"

export interface GalleryImage {
  url: string
  alt: string | null
  width: number | null
  height: number | null
  lqip: string | null
}

export interface PublicationInterface {
  id: string
  title: string
  abstract: string
  authors: string[]
  images: GalleryImage[]
  metadata: {
    journal: string | null
    status: PublicationStatus
    year: number | null
    doi: string | null
    isFeatured: boolean
  }

  createdAt: string
  updatedAt: string
}

export interface SocialMediaInterface {
  platform: SocialPlatform
  username: string
  url: string
  isHidden: boolean
}

export interface WorkInterface {
  id: string
  title: string
  description: string
  tags: string[]
  images: GalleryImage[]

  metadata: {
    isFeatured: boolean
    projectUrl: string | null
    repositoryUrl: string | null
    key_contributions: PortableTextBlock[]
  }

  createdAt: string
  updatedAt: string
}

export type CaseStudyImageKind = "illustration" | "screenshot" | "diagram"

export interface CaseStudyImageInterface {
  asset: {
    url: string
    metadata: {
      lqip: string | null
      dimensions: { width: number; height: number } | null
    } | null
  } | null
  alt: string
  kind: CaseStudyImageKind
  caption: string | null
  hotspot: { x?: number; y?: number } | null
}

export interface CaseStudyInterface {
  id: string
  title: string
  slug: string
  subtitle: string | null
  outcome: string
  listing: "featured" | "listed" | "hidden"
  priority: number
  clientName: string | null
  via: string | null
  startDate: string
  endDate: string | null
  stack: string[]
  coverImage: CaseStudyImageInterface | null
}

export interface CaseStudyPointInterface {
  _key: string
  title: string
  description: string
}

export interface CaseStudyDetailInterface extends CaseStudyInterface {
  role: string
  client: { industry: string | null; region: string | null } | null
  team: {
    _key: string
    role: string
    name: string | null
    profileUrl: string | null
  }[]
  links: { _key: string; label: string; url: string }[]
  linkNote: string | null
  problem: PortableTextBlock[]
  built: CaseStudyPointInterface[]
  decisions: CaseStudyPointInterface[]
  results: {
    _key: string
    statement: string
    metric: {
      value: number | null
      prefix: string | null
      suffix: string | null
      label: string | null
    } | null
  }[]
  credit: string | null
  coverVideoUrl: string | null
  gallery: (CaseStudyImageInterface & { _key: string })[]
  seo: { title: string; description: string; ogImageUrl: string | null }
  next: { title: string; slug: string; outcome: string } | null
  previous: { title: string; slug: string; outcome: string } | null
}

export interface ExperienceInterface {
  company: {
    name: string
    website: string | null
    location: string
    isAnonymized: boolean
  }

  timeline: string
  role: string
  key_contributions: PortableTextBlock[]

  createdAt: string
  updatedAt: string
}

export interface AcademicInterface {
  institute: {
    name: string
    website: string | null
  }

  degree: string
  field: string
  timeline: string

  createdAt: string
  updatedAt: string
}

export interface SkillInterface {
  id: string
  title: string
  tags: string[]
}

export type InterestType = string[]

export interface ServiceHighlightInterface {
  label: string
  description: string
}

export interface ServiceInterface {
  id: string
  title: string
  slug: string | null
  tagline: string | null
  description: string | null
  price: string | null
  timeline: string | null
  buyers: string[]
  deliverables: string[]
  stackTags: string[]
  highlights: ServiceHighlightInterface[]
  sortOrder: number | null
  createdAt: string
  updatedAt: string
}

export interface ClientProjectInterface {
  id: string
  title: string
  domain: string | null
  description: string
  tags: string[]
  sortOrder: number | null
  createdAt: string
  updatedAt: string
}

export interface ServiceTestimonialInterface {
  id: string
  clientName: string
  clientRole: string | null
  quote: string
  projectType: string | null
  createdAt: string
  updatedAt: string
}
