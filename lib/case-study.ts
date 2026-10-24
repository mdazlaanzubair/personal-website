import type { CaseStudyInterface } from "@/type"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/** "2024-09-01" → "Sep 2024". Parsed by hand so the timezone never shifts the month. */
const formatMonth = (date: string) => {
  const [year, month] = date.split("-")
  return `${MONTHS[Number(month) - 1]} ${year}`
}

/** "Sep 2024 – Dec 2025", or "Sep 2024 – Present" while ongoing. */
export const formatCaseStudyDates = ({
  startDate,
  endDate,
}: Pick<CaseStudyInterface, "startDate" | "endDate">) =>
  `${formatMonth(startDate)} – ${endDate ? formatMonth(endDate) : "Present"}`

/** "Cobone via ME Digital Group", or just the client when there's no agency. */
export const formatCaseStudyClient = ({
  clientName,
  via,
}: Pick<CaseStudyInterface, "clientName" | "via">) =>
  [clientName, via ? `via ${via}` : null].filter(Boolean).join(" ")
