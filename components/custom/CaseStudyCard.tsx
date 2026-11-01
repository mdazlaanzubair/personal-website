import { formatCaseStudyClient, formatCaseStudyDates } from "@/lib/case-study"
import type { CaseStudyInterface } from "@/type"
import WorkCard from "./WorkCard"

/** A case study as a compact work card. */
export default function CaseStudyCard({
  study,
}: {
  study: CaseStudyInterface
}) {
  const cover = study.coverImage?.asset
    ? {
        url: study.coverImage.asset.url,
        alt: study.coverImage.alt,
        lqip: study.coverImage.asset.metadata?.lqip ?? null,
      }
    : null

  return (
    <WorkCard
      href={`/work/${study.slug}`}
      title={study.title}
      label={formatCaseStudyClient(study)}
      description={study.outcome}
      footer={[formatCaseStudyDates(study), ...study.stack.slice(0, 3)].join(
        " · "
      )}
      thumbnail={cover}
    />
  )
}
