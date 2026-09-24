import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-05-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN!,
})

const services = [
  {
    _type: "service" as const,
    _id: "service-saas-mvp-starter",
    title: "SaaS MVP Starter",
    slug: { _type: "slug" as const, current: "saas-mvp-starter" },
    tagline:
      "A launch-ready SaaS application — auth, payments, dashboard, deployed.",
    price: "Starting at $1,500",
    timeline: "7 business days",
    deliverables: [
      "Next.js + TypeScript application",
      "Authentication (Clerk/NextAuth)",
      "Stripe payment integration",
      "Dashboard layout",
      "Landing page",
      "Supabase backend setup",
      "Vercel deployment",
      "Handoff documentation",
    ],
    stackTags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Stripe",
      "Vercel",
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    _type: "service" as const,
    _id: "service-ai-powered-tool-mvp",
    title: "AI-Powered Tool MVP",
    slug: { _type: "slug" as const, current: "ai-powered-tool-mvp" },
    tagline:
      "A focused web app wrapping AI/LLM APIs — auth, usage limits, billing-ready.",
    price: "Starting at $1,500",
    timeline: "7 business days",
    deliverables: [
      "AI/LLM API integration",
      "Web interface",
      "Authentication",
      "Usage tracking & rate limiting",
      "Supabase backend",
      "Deployment",
      "Handoff documentation",
    ],
    stackTags: [
      "Next.js",
      "TypeScript",
      "OpenAI/Claude API",
      "Supabase",
      "Vercel",
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    _type: "service" as const,
    _id: "service-chrome-extension-mvp",
    title: "Chrome Extension MVP",
    slug: { _type: "slug" as const, current: "chrome-extension-mvp" },
    tagline:
      "A functional browser extension — from idea to Chrome Web Store ready.",
    price: "Starting at $1,200",
    timeline: "7 business days",
    deliverables: [
      "Chrome Extension (Manifest V3)",
      "Core feature implementation",
      "Extension UI (popup/sidebar)",
      "API integration if needed",
      "Chrome Web Store listing prep",
      "Documentation",
    ],
    stackTags: ["React", "TypeScript", "Chrome APIs"],
    isActive: true,
    sortOrder: 3,
  },
  {
    _type: "service" as const,
    _id: "service-landing-page-waitlist",
    title: "Landing Page + Waitlist",
    slug: { _type: "slug" as const, current: "landing-page-waitlist" },
    tagline:
      "High-converting landing page with email capture — live in 5 days.",
    price: "Starting at $500",
    timeline: "5 business days",
    deliverables: [
      "Responsive landing page",
      "Email capture integration",
      "Analytics setup",
      "SEO basics",
      "Deployed and live",
    ],
    stackTags: ["Next.js", "Tailwind CSS", "Vercel"],
    isActive: true,
    sortOrder: 4,
  },
  {
    _type: "service" as const,
    _id: "service-automation-workflow-setup",
    title: "Automation & Workflow Setup",
    slug: { _type: "slug" as const, current: "automation-workflow-setup" },
    tagline:
      "One core business workflow — automated end to end.",
    price: "Starting at $800",
    timeline: "5 business days",
    deliverables: [
      "Workflow design and mapping",
      "n8n / Python / AI agent implementation",
      "API integrations",
      "Testing and error handling",
      "Documentation and handoff",
    ],
    stackTags: ["n8n", "Python", "AI Agents", "REST APIs"],
    isActive: true,
    sortOrder: 5,
  },
]

async function seed() {
  const transaction = client.transaction()

  for (const service of services) {
    transaction.createOrReplace(service)
  }

  const result = await transaction.commit()
  console.log(`Seeded ${services.length} services:`, result.documentIds)
}

seed().catch((error) => {
  console.error("Seed failed:", error)
  process.exit(1)
})
