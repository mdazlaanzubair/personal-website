import CaseStudyImage from "@/components/custom/CaseStudyImage"
import ContactCta from "@/components/custom/ContactCta"
import JsonLd from "@/components/seo/JsonLd"
import { formatCaseStudyClient, formatCaseStudyDates } from "@/lib/case-study"
import { toCaseStudy } from "@/src/sanity/adapters"
import { buildTimeFetch, client } from "@/src/sanity/client"
import { CASE_STUDY_QUERY, CASE_STUDY_SLUGS_QUERY } from "@/src/sanity/queries"
import { absoluteUrl, createPageMetadata } from "@/src/seo/site"
import { PERSON_ID } from "@/src/seo/structured-data"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
} from "lucide-react"
import type { Metadata } from "next"
import { PortableText, type PortableTextComponents } from "next-sanity"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache, type ReactNode } from "react"

export const dynamic = "force-static"
export const revalidate = false

// Every case study is built at deploy time; an unknown slug is a 404.
export const dynamicParams = false

const fetchOptions = buildTimeFetch

const getCaseStudy = cache(async (slug: string) =>
  toCaseStudy(await client.fetch(CASE_STUDY_QUERY, { slug }, fetchOptions))
)

// No try/catch: if Sanity can't be reached, the build should fail instead of
// deploying a site with no case study pages.
export async function generateStaticParams() {
  const studies = await client.fetch(CASE_STUDY_SLUGS_QUERY, {}, fetchOptions)
  return studies.map(({ slug }) => ({ slug }))
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

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-6">
      <span className="eyebrow">{index}</span>
      <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
    </div>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{children}</dd>
    </div>
  )
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) notFound()

  const clientLabel = formatCaseStudyClient(study)
  const industry = [study.client?.industry, study.client?.region]
    .filter(Boolean)
    .join(" · ")
  const [diagram, ...moreImages] = study.gallery
  let sectionCount = 0
  const nextIndex = () => String(++sectionCount).padStart(2, "0")

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

      {/* ── Header ───────────────────────────────────────── */}
      <header className="pt-10 pb-8 sm:pt-12">
        <div>
          <Link href="/work#case-studies" className="section-link">
            <ArrowLeftIcon className="size-3" /> All work
          </Link>
        </div>
        <p className="mt-8 eyebrow">
          Case study{clientLabel ? ` · ${clientLabel}` : ""}
        </p>
        <h1 className="mt-4 display-heading">{study.title}</h1>
        {study.subtitle && (
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {study.subtitle}
          </p>
        )}
        <p className="mt-6 max-w-2xl font-heading text-xl leading-8 text-foreground sm:text-2xl sm:leading-9">
          {study.outcome}
        </p>
      </header>

      {/* ── At a glance ──────────────────────────────────── */}
      <section
        aria-labelledby="at-a-glance"
        className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6"
      >
        <h2 id="at-a-glance" className="eyebrow">
          At a glance
        </h2>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {clientLabel && <Fact label="Client">{clientLabel}</Fact>}
          <Fact label="Role">{study.role}</Fact>
          <Fact label="Timeline">{formatCaseStudyDates(study)}</Fact>
          {industry && <Fact label="Industry">{industry}</Fact>}
        </dl>

        {study.results.length > 0 && (
          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Results
            </h3>
            <ul className="mt-3 space-y-3">
              {study.results.map((result) => (
                <li
                  key={result._key}
                  className="flex items-start gap-2.5 text-sm leading-6 text-foreground"
                >
                  <CheckIcon className="mt-1 size-3.5 shrink-0 text-primary" />
                  <span>
                    {typeof result.metric?.value === "number" && (
                      <strong className="font-heading text-base">
                        {result.metric.prefix}
                        {result.metric.value}
                        {result.metric.suffix}
                        {result.metric.label && ` ${result.metric.label}`}
                        {" — "}
                      </strong>
                    )}
                    {result.statement}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(study.stack.length > 0 ||
          study.links.length > 0 ||
          study.linkNote) && (
          <div className="mt-6 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
            {study.stack.length > 0 && (
              <div>
                <h3 className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  Stack
                </h3>
                <ul aria-label="Stack" className="mt-3 flex flex-wrap gap-1.5">
                  {study.stack.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-foreground"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(study.links.length > 0 || study.linkNote) && (
              <div>
                <h3 className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  Links
                </h3>
                {study.links.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {study.links.map((link) => (
                      <li key={link._key}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
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
          </div>
        )}
      </section>

      {/* ── Cover ────────────────────────────────────────── */}
      <figure className="mt-10">
        <CaseStudyImage
          image={study.coverImage}
          sizes="(min-width: 768px) 704px, 100vw"
          variant="natural"
          priority
          className="rounded-2xl border border-border"
        />
      </figure>

      {/* ── The problem ──────────────────────────────────── */}
      {study.problem.length > 0 && (
        <section className="border-b border-border py-12">
          <SectionHeading index={nextIndex()} title="The problem" />
          <div className="max-w-2xl text-base text-muted-foreground">
            <PortableText
              value={study.problem}
              components={problemComponents}
            />
          </div>
        </section>
      )}

      {/* ── What I built ─────────────────────────────────── */}
      {study.built.length > 0 && (
        <section className="border-b border-border py-12">
          <SectionHeading index={nextIndex()} title="What I built" />
          <ol className="grid gap-3 sm:grid-cols-2">
            {study.built.map((point, i) => (
              <li
                key={point._key}
                className="rounded-xl border border-border p-5 last:odd:sm:col-span-2"
              >
                <span className="font-mono text-xs text-primary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-semibold text-foreground">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {point.description}
                </p>
              </li>
            ))}
          </ol>

          {diagram && (
            <figure className="mt-8">
              <CaseStudyImage
                image={diagram}
                sizes="(min-width: 768px) 704px, 100vw"
                variant="natural"
                className="rounded-2xl border border-border"
              />
              {diagram.caption && (
                <figcaption className="mt-3 text-center text-xs text-muted-foreground">
                  {diagram.caption}
                </figcaption>
              )}
            </figure>
          )}
        </section>
      )}

      {/* ── Key decisions ────────────────────────────────── */}
      {study.decisions.length > 0 && (
        <section className="border-b border-border py-12">
          <SectionHeading index={nextIndex()} title="Key decisions" />
          <ol className="space-y-6">
            {study.decisions.map((decision) => (
              <li
                key={decision._key}
                className="border-l-2 border-primary pl-5"
              >
                <h3 className="font-semibold text-foreground">
                  {decision.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                  {decision.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── More images ──────────────────────────────────── */}
      {moreImages.length > 0 && (
        <section
          aria-label="More screenshots and diagrams"
          className="space-y-8 border-b border-border py-12"
        >
          {moreImages.map((image) => (
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

      {/* ── Team & credits ───────────────────────────────── */}
      {(study.team.length > 0 || study.credit) && (
        <section className="border-b border-border py-12">
          <SectionHeading index={nextIndex()} title="Team & credits" />
          {study.team.length > 0 && (
            <ul className="grid gap-2 sm:grid-cols-3">
              {study.team.map((member) => (
                <li
                  key={member._key}
                  className="rounded-xl border border-border px-4 py-3 text-sm"
                >
                  <span className="text-foreground">{member.role}</span>
                  {member.name &&
                    (member.profileUrl ? (
                      <a
                        href={member.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 block text-muted-foreground underline underline-offset-2 hover:text-foreground"
                      >
                        {member.name}
                      </a>
                    ) : (
                      <span className="mt-0.5 block text-muted-foreground">
                        {member.name}
                      </span>
                    ))}
                </li>
              ))}
            </ul>
          )}
          {study.credit && (
            <p className="mt-5 text-sm text-muted-foreground">{study.credit}</p>
          )}
        </section>
      )}

      {/* ── Previous / next ──────────────────────────────── */}
      {(study.previous || study.next) && (
        <nav
          aria-label="More case studies"
          className="mt-12 grid grid-cols-2 gap-3"
        >
          {study.previous ? (
            <Link
              href={`/work/${study.previous.slug}`}
              title={study.previous.title}
              className="group flex min-w-0 items-center gap-3 rounded-full border border-border px-4 py-3 text-sm transition-colors hover:border-foreground/20 hover:bg-muted/30"
            >
              <ArrowLeftIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold tracking-wider text-primary uppercase">
                  Previous
                </span>
                <span className="block truncate font-medium text-foreground">
                  {study.previous.title}
                </span>
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {study.next ? (
            <Link
              href={`/work/${study.next.slug}`}
              title={study.next.title}
              className="group flex min-w-0 items-center justify-end gap-3 rounded-full border border-border px-4 py-3 text-right text-sm transition-colors hover:border-foreground/20 hover:bg-muted/30"
            >
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold tracking-wider text-primary uppercase">
                  Next
                </span>
                <span className="block truncate font-medium text-foreground">
                  {study.next.title}
                </span>
              </span>
              <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      )}

      <ContactCta />
    </article>
  )
}
