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

export interface ServiceInterface {
  id: string
  title: string
  slug: string | null
  tagline: string | null
  description: PortableTextBlock[]
  price: string | null
  timeline: string | null
  deliverables: string[]
  stackTags: string[]
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
