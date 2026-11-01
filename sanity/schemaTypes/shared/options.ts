export const publicationStatusOptions = [
  { title: "In preparation", value: "in_preparation" },
  { title: "Submitted", value: "submitted" },
  { title: "Under review", value: "under_review" },
  { title: "Accepted", value: "accepted" },
  { title: "Published", value: "published" },
] as const

export const publicationStatusLabels = Object.fromEntries(
  publicationStatusOptions.map(({ title, value }) => [value, title])
) as Record<string, string>
