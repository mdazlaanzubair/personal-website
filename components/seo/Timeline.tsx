const monthNumbers: Record<string, string> = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
}

type TimelinePart = {
  dateTime: string
  label: string
  year: number
}

const parseTimelinePart = (
  value: string,
  startYear?: number
): TimelinePart | null => {
  const normalized = value.trim().replace(/\.$/, "")
  const monthAndYear = normalized.match(/^([A-Za-z]+)\s+(\d{4})$/)

  if (monthAndYear) {
    const month = monthNumbers[monthAndYear[1].toLowerCase()]
    const year = Number(monthAndYear[2])

    if (month) {
      return {
        dateTime: `${year}-${month}`,
        label: normalized,
        year,
      }
    }
  }

  if (/^\d{4}$/.test(normalized)) {
    const year = Number(normalized)
    return { dateTime: normalized, label: normalized, year }
  }

  if (/^\d{2}$/.test(normalized) && startYear) {
    const century = Math.floor(startYear / 100) * 100
    let year = century + Number(normalized)

    if (year < startYear) year += 100

    return { dateTime: String(year), label: String(year), year }
  }

  return null
}

const parseTimeline = (timeline: string) => {
  const normalized = timeline.trim()
  const compactYearRange = normalized.match(/^(\d{4})-(\d{2}|\d{4})$/)
  const range =
    compactYearRange ?? normalized.match(/^(.+?)\s+(?:–|—|-)\s+(.+)$/)

  if (!range) return null

  const start = parseTimelinePart(range[1])
  const endLabel = range[2].trim()
  const isPresent = /^present$/i.test(endLabel)
  const end = isPresent ? null : parseTimelinePart(endLabel, start?.year)

  if (!start || (!isPresent && !end)) return null

  return { start, end, isPresent }
}

/** A timeline as plain text, e.g. "2024-26" becomes "2024 – 2026". */
export const formatTimeline = (value: string) => {
  const timeline = parseTimeline(value)
  if (!timeline) return value
  return `${timeline.start.label} – ${
    timeline.isPresent ? "Present" : timeline.end!.label
  }`
}

/** Orders timelines by when they end; ongoing ones sort last (newest). */
export const timelineSortKey = (value: string) => {
  const timeline = parseTimeline(value)
  if (!timeline) return 0
  if (timeline.isPresent) return Number.POSITIVE_INFINITY
  const [year, month = "12"] = timeline.end!.dateTime.split("-")
  return Number(year) * 12 + Number(month)
}

export default function Timeline({ value }: { value: string }) {
  const timeline = parseTimeline(value)

  if (!timeline) return <span>{value}</span>

  return (
    <span aria-label={value}>
      <time dateTime={timeline.start.dateTime}>{timeline.start.label}</time>
      <span aria-hidden="true"> – </span>
      {timeline.isPresent ? (
        <span>Present</span>
      ) : (
        <time dateTime={timeline.end!.dateTime}>{timeline.end!.label}</time>
      )}
    </span>
  )
}
