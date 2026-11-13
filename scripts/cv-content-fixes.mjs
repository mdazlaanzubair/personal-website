// Applies the November 2026 CV review fixes to Sanity content:
// action-verb experience bullets, location and data fixes, cleaner skill
// names, and resume-only link hiding.
//
// Every bullet stays within brand-knowledge-base/02-azlaan-profile.md. No
// metrics are added: none are public, so none are claimed.
import { getCliClient } from "sanity/cli"

// Uses the Sanity CLI login, so no API token is needed. Run with:
//   npx sanity exec scripts/cv-content-fixes.mjs --with-user-token
// Append `-- --dry-run` to print the changes without writing them.
const dryRun = process.argv.includes("--dry-run")
const client = getCliClient({ apiVersion: "2026-09-25", useCdn: false })

const block = (text, index) => ({
  _key: `cv2026-${index}`,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _key: `cv2026-${index}-span`, _type: "span", marks: [], text }],
})

// Keyed by company name so the script does not depend on document IDs.
const BULLETS = {
  "PM Workbench AI": [
    "Built the product frontend in Next.js, TypeScript and Tailwind CSS for product managers turning requirements into AI-generated documents.",
    "Built WebSocket-driven tracking that shows long-running AI jobs moving through extraction, embedding, analysis and synthesis in real time.",
    "Integrated Slack, Google Drive and file uploads as data sources for the backend AI pipelines.",
    "Coordinated server and client state with TanStack React Query and Zustand.",
    "Implemented authentication refresh flows and the shared API client.",
  ],
  Cobone: [
    "Built React and Next.js features for a production e-commerce platform serving multiple Gulf markets.",
    "Improved frontend performance with code splitting, lazy loading, bundle optimization and caching.",
    "Integrated secure third-party payment and loyalty services.",
    "Built mobile-responsive UI and real-time product filtering on REST APIs.",
    "Shipped to production with backend, design, QA and product teams, from debugging and testing through deployment.",
  ],
  YallaCompare: [
    "Built React micro-frontend applications for insurance and travel comparison.",
    "Integrated third-party insurance and travel APIs.",
    "Redesigned interfaces for responsiveness and accessibility, and documented the modular frontend architecture.",
  ],
  Transviti: [
    "Built workforce-management portals with React, Redux and TypeScript.",
    "Built two-way user sync with Microsoft Entra ID through the Microsoft Graph API.",
    "Implemented OAuth 2.0 sign-in and enterprise identity integration.",
    "Automated recurring logistics workflows, with API validation and full error states.",
  ],
  SUPARCO: [
    "Built internal React web applications and document-approval workflow automation.",
    "Delivered responsive, cross-browser interfaces.",
    "Took part in agile sprints, code review and IT modernization.",
  ],
}

const LOCATIONS = { Transviti: "Riyadh, Saudi Arabia" }

const SKILLS = [
  {
    title: "Frontend",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Redux",
      "Zustand",
      "TanStack Query",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend",
    tags: [
      "Node.js",
      "Express.js",
      "Python",
      "Flask",
      "REST APIs",
      "WebSockets",
      "Server-Sent Events (SSE)",
      "OAuth 2.0",
      "Microsoft Graph API",
      "MongoDB",
      "PostgreSQL",
      "Supabase",
    ],
  },
  {
    title: "AI & ML",
    tags: [
      "LLMs",
      "VLMs",
      "RAG",
      "LangChain",
      "Vector databases",
      "Prompt engineering",
      "TensorFlow.js",
      "Transformers.js",
      "Computer Vision",
    ],
  },
  {
    title: "Automation",
    tags: [
      "n8n",
      "Browser automation",
      "Chrome Extension APIs",
      "Robotic Process Automation (RPA)",
    ],
  },
  { title: "Delivery", tags: ["Git", "CI/CD", "Docker"] },
]

const HIDE_FROM_RESUME = new Set(["instagram", "threads", "whatsapp"])

const looksLikeTimeline = (value = "") => /\b(19|20)\d{2}\b/.test(value)

const [drafts, experiences, settings] = await Promise.all([
  client.fetch(
    `*[_id in path("drafts.**") && (_type == "experience" || _id == "drafts.siteSettings")]._id`
  ),
  client.fetch(
    `*[_type == "experience" && !(_id in path("drafts.**"))]{_id, timeline, company}`
  ),
  client.fetch(`*[_id == "siteSettings"][0]{skills, socialMedia}`),
])

if (drafts.length > 0) {
  // A draft would hide these published edits in Studio and get published
  // over them later, so stop rather than leave the two out of step.
  throw new Error(
    `Unpublished drafts exist, publish or discard them first: ${drafts.join(", ")}`
  )
}

const tx = client.transaction()
const log = []

for (const doc of experiences) {
  const name = doc.company?.name
  const set = {}

  if (BULLETS[name]) {
    set.key_contributions = BULLETS[name].map(block)
  }
  if (LOCATIONS[name]) set["company.location"] = LOCATIONS[name]

  // SUPARCO had its dates and location saved in each other's fields.
  if (
    !looksLikeTimeline(doc.timeline) &&
    looksLikeTimeline(doc.company?.location)
  ) {
    set.timeline = doc.company.location
    set["company.location"] = doc.timeline
  }

  if (Object.keys(set).length > 0) {
    tx.patch(doc._id, (patch) => patch.set(set))
    log.push(`${name}: ${Object.keys(set).join(", ")}`)
  }
}

const existingSkillKeys = new Map(
  (settings?.skills ?? []).map((skill) => [skill.title, skill._key])
)
const skills = SKILLS.map((skill, i) => ({
  _key: existingSkillKeys.get(skill.title) ?? `cv2026-skill-${i}`,
  _type: "skill",
  ...skill,
}))
const skillType = settings?.skills?.[0]?._type
if (skillType) skills.forEach((skill) => (skill._type = skillType))
else skills.forEach((skill) => delete skill._type)

const socialSet = {}
for (const link of settings?.socialMedia ?? []) {
  if (HIDE_FROM_RESUME.has(String(link.label ?? "").toLowerCase())) {
    socialSet[`socialMedia[_key=="${link._key}"].hideFromResume`] = true
  }
  if (link.label === "Github") {
    socialSet[`socialMedia[_key=="${link._key}"].label`] = "GitHub"
  }
}

tx.patch("siteSettings", (patch) => patch.set({ skills, ...socialSet }))
log.push(`siteSettings: skills, link fixes: ${Object.keys(socialSet).length}`)

console.log(log.join("\n"))
if (dryRun) {
  console.log("\nDry run, nothing written.")
} else {
  await tx.commit()
  console.log("\nCommitted.")
}
