import ServicesInlineCta from "@/components/custom/ServicesInlineCta"
import JsonLd from "@/components/seo/JsonLd"
import { toCaseStudy } from "@/src/sanity/adapters"
import { client } from "@/src/sanity/client"
import { CASE_STUDY_QUERY, CASE_STUDY_SLUGS_QUERY } from "@/src/sanity/queries"
import { absoluteUrl, createPageMetadata } from "@/src/seo/site"
import { PERSON_ID } from "@/src/seo/structured-data"
import { ArrowLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import { PortableText, type PortableTextComponents } from "next-sanity"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"

export const revalidate = 21600

const fetchOptions = {
  next: { revalidate: 21600, tags: ["sanity-case-studies"] },
}

const getCaseStudy = cache(async (slug: string) =>
  toCaseStudy(await client.fetch(CASE_STUDY_QUERY, { slug }, fetchOptions))
)

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(CASE_STUDY_SLUGS_QUERY, {}, fetchOptions)
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) return {}

  const metadata = createPageMetadata({
    title: `${study.seo.title} — Case study`,
    description: study.seo.description,
    path: `/work/${study.slug}`,
    keywords: ["Muhammad Azlaan Zubair case study", ...study.tags],
  })

  return study.seo.noIndex
    ? { ...metadata, robots: { index: false, follow: true } }
    : metadata
}

const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-5">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-14 border-t border-border pt-10 font-heading text-2xl font-bold tracking-tight text-foreground first:mt-0 first:border-t-0 first:pt-0 sm:text-[1.75rem]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-lg font-semibold text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 text-base font-semibold text-foreground">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-primary pl-5 font-heading text-lg leading-8 text-foreground italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 list-outside list-disc space-y-2 pl-5 marker:text-muted-foreground/60">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 list-outside list-decimal space-y-2 pl-5 marker:text-muted-foreground/60">
        {children}
      </ol>
    ),
  },
  listItem: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : undefined
      if (!href) return <>{children}</>
      const openInNewTab = value.openInNewTab === true
      return (
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="text-primary underline underline-offset-2"
        >
          {children}
        </a>
      )
    },
  },
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) notFound()

  const details = [
    { label: "Organization", value: study.metadata.company?.name },
    { label: "Project", value: study.metadata.projectName },
    { label: "Timeline", value: study.metadata.timeline },
  ].filter((detail): detail is { label: string; value: string } =>
    Boolean(detail.value)
  )

  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`/work/${study.slug}`),
    url: absoluteUrl(`/work/${study.slug}`),
    headline: study.seo.title,
    description: study.seo.description,
    author: { "@id": PERSON_ID },
    keywords: study.tags,
    datePublished: study.createdAt,
    dateModified: study.updatedAt,
  }

  return (
    <article className="pb-4">
      <JsonLd data={caseStudyJsonLd} />

      <header className="pt-10 pb-10 sm:pt-12">
        <Link href="/work#case-studies" className="section-link">
          <ArrowLeftIcon className="size-3" /> All work
        </Link>
        <span className="mt-8 eyebrow block">Case study</span>
        <h1 className="mt-4 display-heading">{study.title}</h1>
        {study.description && (
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {study.description}
          </p>
        )}

        {details.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-6 sm:grid-cols-3">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  {detail.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {study.body.length > 0 && (
        <div className="max-w-[65ch] text-base text-muted-foreground">
          <PortableText value={study.body} components={bodyComponents} />
        </div>
      )}

      {study.tags.length > 0 && (
        <ul
          aria-label="Technologies"
          className="mt-14 flex flex-wrap gap-2 border-t border-border pt-8"
        >
          {study.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border bg-muted px-2 py-px text-[11px]"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <ServicesInlineCta
        heading="Have a problem like this?"
        text="I help teams find the real problem underneath the brief, then build the system that solves it."
        href="/services"
      />
    </article>
  )
}
