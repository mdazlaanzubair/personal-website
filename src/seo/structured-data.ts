import type {
  AcademicInterface,
  ExperienceInterface,
  PublicationInterface,
  SkillInterface,
  SocialMediaInterface,
} from "@/type"

import { absoluteUrl, SITE_DESCRIPTION, SITE_HANDLE, SITE_NAME } from "./site"

export const PERSON_ID = absoluteUrl("/#person")
export const WEBSITE_ID = absoluteUrl("/#website")

export const DEFAULT_SOCIAL_PROFILES: SocialMediaInterface[] = [
  {
    platform: "github",
    username: "mdazlaanzubair",
    url: "https://github.com/mdazlaanzubair",
    isHidden: false,
  },
  {
    platform: "linkedin",
    username: "mdazlaanzubair",
    url: "https://www.linkedin.com/in/mdazlaanzubair/",
    isHidden: false,
  },
  {
    platform: "scholar",
    username: "K7XC7-MAAAAJ",
    url: "https://scholar.google.com/citations?hl=en&user=K7XC7-MAAAAJ",
    isHidden: false,
  },
  {
    platform: "x",
    username: "mdazlaanzubair",
    url: "https://x.com/mdazlaanzubair",
    isHidden: false,
  },
  {
    platform: "instagram",
    username: "mdazlaanzubairr",
    url: "https://www.instagram.com/mdazlaanzubairr/",
    isHidden: false,
  },
]

export const resolveSocialProfiles = (
  profiles: SocialMediaInterface[]
): SocialMediaInterface[] => {
  const profilesByPlatform = new Map(
    DEFAULT_SOCIAL_PROFILES.map((profile) => [profile.platform, profile])
  )

  profiles.forEach((profile) => {
    profilesByPlatform.set(profile.platform, profile)
  })

  return [...profilesByPlatform.values()]
}

export const createSiteJsonLd = (socialProfiles: SocialMediaInterface[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: absoluteUrl("/"),
      name: `${SITE_NAME} Portfolio`,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
      hasPart: [
        { "@type": "AboutPage", name: "About", url: absoluteUrl("/about") },
        {
          "@type": "CollectionPage",
          name: "Work",
          url: absoluteUrl("/work"),
        },
        {
          "@type": "CollectionPage",
          name: "Writing",
          url: absoluteUrl("/writing"),
        },
      ],
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      alternateName: SITE_HANDLE,
      url: absoluteUrl("/about"),
      image: absoluteUrl("/architect.png"),
      email: "mailto:mdazlaan1996@gmail.com",
      birthDate: "1996-07",
      jobTitle: "Software Architect and Web Engineer",
      description: SITE_DESCRIPTION,
      homeLocation: {
        "@type": "Place",
        name: "Karachi, Pakistan",
      },
      knowsAbout: [
        "Software architecture",
        "Web engineering",
        "Frontend development",
        "Backend development",
        "Artificial intelligence",
        "Machine learning",
        "Developer automation",
      ],
      sameAs: [
        ...new Set([
          ...socialProfiles
            .filter((profile) => !profile.isHidden)
            .map((profile) => profile.url),
          "https://blog.mdazlaanzubair.com/",
        ]),
      ],
    },
  ],
})

const uniqueNamedEntities = <T extends { name: string }>(entities: T[]) => [
  ...new Map(entities.map((entity) => [entity.name, entity])).values(),
]

export const createAboutPageJsonLd = ({
  experiences,
  academics,
  skills,
  description,
}: {
  experiences: ExperienceInterface[]
  academics: AcademicInterface[]
  skills: SkillInterface[]
  description: string
}) => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${absoluteUrl("/about")}#about`,
  url: absoluteUrl("/about"),
  name: `About ${SITE_NAME}`,
  description,
  inLanguage: "en",
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    knowsAbout: [
      ...new Set(
        skills.flatMap((skill) => [skill.title, ...skill.tags]).filter(Boolean)
      ),
    ],
    alumniOf: uniqueNamedEntities(
      academics.map((academic) => ({
        "@type": "CollegeOrUniversity",
        name: academic.institute.name,
        ...(academic.institute.website
          ? { url: academic.institute.website }
          : {}),
      }))
    ),
    worksFor: uniqueNamedEntities(
      experiences
        .filter((experience) => !experience.company.isAnonymized)
        .map((experience) => ({
          "@type": "Organization",
          name: experience.company.name,
          ...(experience.company.website
            ? { url: experience.company.website }
            : {}),
          ...(experience.company.location
            ? {
                location: {
                  "@type": "Place",
                  name: experience.company.location,
                },
              }
            : {}),
        }))
    ),
  },
})

export const toPublicationUrl = (doi: string | null) => {
  if (!doi) return null
  if (/^https?:\/\//i.test(doi)) return doi

  return `https://doi.org/${doi.replace(/^doi:\s*/i, "")}`
}

const isPortfolioOwner = (author: string) => {
  const normalizedAuthor = author.toLowerCase()
  return (
    normalizedAuthor.includes("azlaan") ||
    normalizedAuthor.includes("mdazlaan") ||
    normalizedAuthor.includes("zubair")
  )
}

export const createResearchPageJsonLd = ({
  publications,
  description,
}: {
  publications: PublicationInterface[]
  description: string
}) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${absoluteUrl("/work")}#research-profile`,
  url: absoluteUrl("/work"),
  name: `${SITE_NAME} research profile`,
  description,
  inLanguage: "en",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": PERSON_ID },
  mainEntity: publications.map((publication) => {
    const publicationUrl = toPublicationUrl(publication.metadata.doi)
    const doi = publication.metadata.doi
      ?.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
      .replace(/^doi:\s*/i, "")
    const isPublished = publication.metadata.status === "published"

    return {
      "@type": "ScholarlyArticle",
      "@id": `${absoluteUrl("/work")}#${encodeURIComponent(publication.id)}`,
      headline: publication.title,
      name: publication.title,
      description: publication.abstract,
      abstract: publication.abstract,
      inLanguage: "en",
      author: publication.authors.map((author) =>
        isPortfolioOwner(author)
          ? { "@type": "Person", "@id": PERSON_ID, name: author }
          : { "@type": "Person", name: author }
      ),
      creativeWorkStatus: publication.metadata.status.replaceAll("_", " "),
      ...(isPublished && publication.metadata.year
        ? { datePublished: String(publication.metadata.year) }
        : {}),
      ...(publication.metadata.journal
        ? {
            isPartOf: {
              "@type": "Periodical",
              name: publication.metadata.journal,
            },
          }
        : {}),
      ...(publicationUrl
        ? { url: publicationUrl, sameAs: publicationUrl }
        : {}),
      ...(doi && /^10\.\d{4,9}\//.test(doi)
        ? {
            identifier: {
              "@type": "PropertyValue",
              propertyID: "DOI",
              value: doi,
            },
          }
        : {}),
    }
  }),
})

export const createCollectionJsonLd = ({
  path,
  name,
  description,
  items,
}: {
  path: string
  name: string
  description: string
  items: unknown[]
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${absoluteUrl(path)}#collection`,
  url: absoluteUrl(path),
  name,
  description,
  inLanguage: "en",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": PERSON_ID },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item,
    })),
  },
})
