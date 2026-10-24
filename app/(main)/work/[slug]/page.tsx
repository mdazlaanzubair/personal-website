import CaseStudyImage from "@/components/custom/CaseStudyImage"
import ServicesInlineCta from "@/components/custom/ServicesInlineCta"
import JsonLd from "@/components/seo/JsonLd"
import { formatCaseStudyClient, formatCaseStudyDates } from "@/lib/case-study"
import { toCaseStudy } from "@/src/sanity/adapters"
import { client } from "@/src/sanity/client"
import { CASE_STUDY_QUERY, CASE_STUDY_SLUGS_QUERY } from "@/src/sanity/queries"
import { absoluteUrl, createPageMetadata } from "@/src/seo/site"
import { PERSON_ID } from "@/src/seo/structured-data"
import type { CaseStudyPointInterface } from "@/type"
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"
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
    const studies = await client.fetch(CASE_STUDY_SLUGS_QUERY, {}, fetchOptions)
    return studies.map(({ slug }) => ({ slug }))
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
    title: study.seo.title,
    description: study.seo.description,
    path: `/work/${study.slug}`,
    keywords: ["Muhammad Azlaan Zubair case study", ...study.stack],
  })

  return study.seo.ogImageUrl
    ? {
        ...metadata,
        openGraph: {
          ...metadata.openGraph,
          images: [{ url: study.seo.ogImageUrl, alt: study.title }],
        },
        twitter: { ...metadata.twitter, images: [study.seo.ogImageUrl] },
      }
    : metadata
}

const problemComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-outside list-disc space-y-2 pl-5 marker:text-muted-foreground/60">
        {children}
      </ul>
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
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-primary underline underline-offset-2"
        >
          {children}
        </a>
      )
    },
  },
}

function StorySection({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-4 border-t border-border py-10 sm:grid-cols-[10rem_1fr] sm:gap-8">
      <div>
        <span className="eyebrow">{index}</span>
        <h2 className="mt-2 font-heading text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="min-w-0 text-[15px] text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

function PointList({ points }: { points: CaseStudyPointInterface[] }) {
  return (
    <ol className="space-y-6">
      {points.map((point, i) => (
        <li key={point._key} className="grid grid-cols-[2rem_1fr] gap-2">
          <span className="pt-0.5 font-mono text-xs text-muted-foreground/70 tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-semibold text-foreground">{point.title}</h3>
            <p className="mt-1 leading-7">{point.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) notFound()

  const clientLabel = formatCaseStudyClient(study)
  const details = [
    { label: "Client", value: clientLabel },
    { label: "Role", value: study.role },
    { label: "Timeline", value: formatCaseStudyDates(study) },
    {
      label: "Industry",
      value: [study.client?.industry, study.client?.region]
        .filter(Boolean)
        .join(" · "),
    },
  ].filter((detail) => Boolean(detail.value))

  const sections = [
    study.problem.length > 0 && {
      title: "The problem",
      content: (
        <PortableText value={study.problem} components={problemComponents} />
      ),
    },
    study.built.length > 0 && {
      title: "What I built",
      content: <PointList points={study.built} />,
    },
    study.decisions.length > 0 && {
      title: "Key decisions",
      content: <PointList points={study.decisions} />,
    },
    study.results.length > 0 && {
      title: "Results",
      content: (
        <ul className="space-y-5">
          {study.results.map((result) => (
            <li key={result._key}>
              {typeof result.metric?.value === "number" && (
                <p className="font-heading text-3xl font-bold text-foreground">
                  {result.metric.prefix}
                  {result.metric.value}
                  {result.metric.suffix}
                  {result.metric.label && (
                    <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">
                      {result.metric.label}
                    </span>
                  )}
                </p>
              )}
              <p className="leading-7 text-foreground">{result.statement}</p>
            </li>
          ))}
        </ul>
      ),
    },
  ].filter((section) => section !== false)

  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`/work/${study.slug}`),
    url: absoluteUrl(`/work/${study.slug}`),
    headline: study.title,
    description: study.seo.description,
    author: { "@id": PERSON_ID },
    keywords: study.stack,
    ...(study.seo.ogImageUrl ? { image: study.seo.ogImageUrl } : {}),
  }

  return (
    <article className="pb-4">
      <JsonLd data={caseStudyJsonLd} />

      <header className="pt-10 pb-8 sm:pt-12">
        <Link href="/work#case-studies" className="section-link">
          <ArrowLeftIcon className="size-3" /> All work
        </Link>
        <span className="mt-8 eyebrow block">Case study</span>
        <h1 className="mt-4 display-heading">{study.title}</h1>
        {study.subtitle && (
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {study.subtitle}
          </p>
        )}
        <p className="mt-6 max-w-2xl border-l-2 border-primary pl-4 text-base leading-7 font-medium text-foreground">
          {study.outcome}
        </p>

        <dl className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 border-y border-border py-6 sm:grid-cols-2">
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
      </header>

      <figure className="mb-10">
        <CaseStudyImage
          image={study.coverImage}
          sizes="(min-width: 768px) 704px, 100vw"
          variant="natural"
          priority
          className="rounded-2xl border border-border"
        />
      </figure>

      {sections.map((section, i) => (
        <StorySection
          key={section.title}
          index={String(i + 1).padStart(2, "0")}
          title={section.title}
        >
          {section.content}
        </StorySection>
      ))}

      {study.credit && (
        <p className="border-t border-border py-6 text-sm text-muted-foreground italic">
          {study.credit}
        </p>
      )}

      {study.gallery.length > 0 && (
        <section
          aria-label="Screenshots and diagrams"
          className="space-y-8 border-t border-border py-10"
        >
          {study.gallery.map((image) => (
            <figure key={image._key}>
              <CaseStudyImage
                image={image}
                sizes="(min-width: 768px) 704px, 100vw"
                variant="natural"
                className="rounded-2xl border border-border"
              />
              {image.caption && (
                <figcaption className="mt-3 text-center text-xs text-muted-foreground">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </section>
      )}

      <section
        aria-label="Project details"
        className="grid gap-8 border-t border-border py-10 sm:grid-cols-3"
      >
        {study.team.length > 0 && (
          <div>
            <h2 className="eyebrow">Team</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {study.team.map((member) => (
                <li key={member._key}>
                  <span className="text-foreground">{member.role}</span>
                  {member.name &&
                    (member.profileUrl ? (
                      <a
                        href={member.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-muted-foreground underline underline-offset-2 hover:text-foreground"
                      >
                        {member.name}
                      </a>
                    ) : (
                      <span className="block text-muted-foreground">
                        {member.name}
                      </span>
                    ))}
                </li>
              ))}
            </ul>
          </div>
        )}

        {study.stack.length > 0 && (
          <div>
            <h2 className="eyebrow">Stack</h2>
            <ul aria-label="Stack" className="mt-3 flex flex-wrap gap-2">
              {study.stack.map((tool) => (
                <li
                  key={tool}
                  className="rounded-md border border-border bg-muted px-2 py-px text-[11px]"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(study.links.length > 0 || study.linkNote) && (
          <div>
            <h2 className="eyebrow">Links</h2>
            {study.links.length > 0 && (
              <ul className="mt-3 space-y-2 text-sm">
                {study.links.map((link) => (
                  <li key={link._key}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-foreground underline-offset-2 hover:underline"
                    >
                      {link.label}
                      <ArrowUpRightIcon className="size-3" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {study.linkNote && (
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {study.linkNote}
              </p>
            )}
          </div>
        )}
      </section>

      {study.next && (
        <Link
          href={`/work/${study.next.slug}`}
          className="group mt-4 flex items-center justify-between gap-6 rounded-2xl border border-border p-5 transition-colors hover:border-foreground/20 hover:bg-muted/30 sm:p-6"
        >
          <div className="min-w-0">
            <span className="eyebrow">Next case study</span>
            <p className="mt-2 font-heading text-lg font-bold text-foreground">
              {study.next.title}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {study.next.outcome}
            </p>
          </div>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}

      <ServicesInlineCta
        heading="Have a problem like this?"
        text="I help teams find the real problem underneath the brief, then build the system that solves it."
        href="/services"
      />
    </article>
  )
}
