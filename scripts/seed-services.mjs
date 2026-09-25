import { createClient } from "@sanity/client"
import { existsSync, readFileSync } from "node:fs"

function loadEnvFile(path) {
  if (!existsSync(path)) return

  const lines = readFileSync(path, "utf8").split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const separatorIndex = trimmed.indexOf("=")
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(".env.local")
loadEnvFile(".env")

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET"
  )
}

if (!token) {
  throw new Error(
    "Missing SANITY_API_WRITE_TOKEN or SANITY_WRITE_TOKEN. Add a write token before seeding."
  )
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-09-25",
  useCdn: false,
})

const services = [
  {
    _type: "service",
    title: "MVP Build",
    slug: { _type: "slug", current: "mvp-build" },
    tagline: "Your idea, built and deployed in 7 business days.",
    description:
      "I take your product idea — SaaS app, AI-powered tool, or Chrome extension — and ship a working, deployed MVP with auth, payments, and core features. You get production-ready code, not a prototype.",
    price: "Starting at $1,200",
    timeline: "7 business days",
    buyers: [
      "Founders & Startups",
      "Solo Entrepreneurs",
      "Non-Technical Co-Founders",
      "Product Teams",
    ],
    deliverables: [
      "Working application — web app or browser extension",
      "Authentication & user management",
      "Payment integration (Stripe) if needed",
      "Core feature implementation",
      "Database & backend setup (Supabase)",
      "Deployed on production infrastructure",
      "Handoff documentation & full source code",
    ],
    stackTags: [
      "Next.js",
      "TypeScript",
      "React",
      "Supabase",
      "Stripe",
      "Chrome APIs",
      "AI/LLM APIs",
      "Vercel",
    ],
    highlights: [
      {
        _type: "object",
        _key: "mvp-fixed-scope-price",
        label: "Fixed Scope & Price",
        description:
          "No hourly billing. Clear deliverables agreed before work begins.",
      },
      {
        _type: "object",
        _key: "mvp-daily-progress-updates",
        label: "Daily Progress Updates",
        description:
          "You see the product take shape in real time — no black box.",
      },
      {
        _type: "object",
        _key: "mvp-production-ready",
        label: "Production-Ready",
        description:
          "Deployed on a real domain with auth, payments, and documentation.",
      },
      {
        _type: "object",
        _key: "mvp-full-ownership",
        label: "Full Ownership",
        description:
          "You get the complete source code and deployment. No lock-in.",
      },
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    _type: "service",
    title: "Web & Product",
    slug: { _type: "slug", current: "web-and-product" },
    tagline:
      "Landing pages, websites, feature builds, and product audits — for products that already exist or are about to launch.",
    description:
      "Whether you need a high-converting landing page, a professional portfolio, a new feature on your existing app, or a UX and performance audit that finds what your users feel but can't articulate — I build, extend, and improve web products.",
    price: "Starting at $500",
    timeline: "5 business days",
    buyers: [
      "Startups with Existing Products",
      "Small Businesses",
      "Professionals & Freelancers",
      "SaaS Companies",
    ],
    deliverables: [
      "Custom landing page or portfolio website",
      "Feature implementation on existing codebases",
      "UI/UX review with annotated recommendations",
      "Performance audit (Core Web Vitals, bundle, loading)",
      "Basic SEO setup & Google indexing",
      "Mobile-responsive, production-deployed",
      "Email capture & analytics integration",
    ],
    stackTags: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vercel",
      "SEO",
    ],
    highlights: [
      {
        _type: "object",
        _key: "web-build-or-improve",
        label: "Build or Improve",
        description:
          "New landing pages and websites, or features and fixes on your existing product.",
      },
      {
        _type: "object",
        _key: "web-frontend-first-quality",
        label: "Frontend-First Quality",
        description:
          "Built by an engineer with years of production frontend experience.",
      },
      {
        _type: "object",
        _key: "web-seo-performance",
        label: "SEO & Performance",
        description:
          "Not just pretty — fast, indexed, and optimized for real users.",
      },
      {
        _type: "object",
        _key: "web-ux-perspective",
        label: "UX Perspective",
        description:
          "I find the friction your users feel but can't articulate.",
      },
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    _type: "service",
    title: "Technical Writing",
    slug: { _type: "slug", current: "technical-writing" },
    tagline:
      "Technical content written by an engineer who builds the things he writes about.",
    description:
      "Blog posts, product documentation, developer guides, and research-informed content. I investigate before I write — every article is grounded in evidence, engineering experience, and clear reasoning. Not SEO filler.",
    price: "Starting at $300",
    timeline: "Per article",
    buyers: [
      "Tech Companies",
      "Developer Tool Brands",
      "SaaS Companies",
      "Agencies & Publications",
    ],
    deliverables: [
      "Long-form technical article (1,500–3,000 words)",
      "SEO-optimized with meta description and tags",
      "Original research, diagrams, or code examples",
      "Product documentation & developer guides",
      "One round of revisions included",
    ],
    stackTags: [
      "Technical Content",
      "SEO",
      "Developer Documentation",
      "Research",
    ],
    highlights: [
      {
        _type: "object",
        _key: "writing-engineer-written",
        label: "Engineer-Written",
        description:
          "Written by someone who builds production software — not a copywriter Googling the topic.",
      },
      {
        _type: "object",
        _key: "writing-published-track-record",
        label: "Published Track Record",
        description:
          "22+ published articles on AI, software engineering, and product analysis.",
      },
      {
        _type: "object",
        _key: "writing-research-backed",
        label: "Research-Backed",
        description:
          "Every claim is grounded in evidence. I flag what I know vs. what I'm inferring.",
      },
      {
        _type: "object",
        _key: "writing-seo-that-works",
        label: "SEO That Works",
        description:
          "Structured for search engines and AI citation systems without sacrificing depth.",
      },
    ],
    isActive: true,
    sortOrder: 3,
  },
  {
    _type: "service",
    title: "Automation & AI Setup",
    slug: { _type: "slug", current: "automation-and-ai-setup" },
    tagline:
      "Workflows, automations, and AI-powered workspaces — set up and running in days, not weeks.",
    description:
      "I automate your repetitive work and set up AI-powered workflows tailored to how you actually operate. From n8n pipelines and Python scripts to custom Claude workspaces with scheduled tasks and context-aware prompts — one setup that keeps working without you.",
    price: "Starting at $500",
    timeline: "5 business days",
    buyers: [
      "Content Creators",
      "Small Businesses",
      "Solo Founders",
      "Professionals & Teams",
    ],
    deliverables: [
      "Workflow design and mapping",
      "n8n, Python, or AI agent implementation",
      "API integrations between your existing tools",
      "Custom Claude/AI workspace configuration",
      "Tailored prompt templates for your workflows",
      "Scheduled automation tasks",
      "Testing, error handling, and documentation",
    ],
    stackTags: ["n8n", "Python", "Claude", "Codex", "AI Agents", "REST APIs"],
    highlights: [
      {
        _type: "object",
        _key: "automation-end-to-end-automation",
        label: "End-to-End Automation",
        description:
          "From manual process to fully automated pipeline — designed around your actual workflow.",
      },
      {
        _type: "object",
        _key: "automation-ai-workspace-setup",
        label: "AI Workspace Setup",
        description:
          "Custom Claude projects, Codex configs, and prompt systems tailored to your work.",
      },
      {
        _type: "object",
        _key: "automation-works-while-you-sleep",
        label: "Works While You Sleep",
        description:
          "Scheduled tasks and automated pipelines that run without your involvement.",
      },
      {
        _type: "object",
        _key: "automation-connects-your-tools",
        label: "Connects Your Tools",
        description:
          "Integrates the tools you already use — no platform switching required.",
      },
    ],
    isActive: true,
    sortOrder: 4,
  },
]

async function seedServices() {
  const existingServices = await client.fetch('*[_type == "service"]{ _id }')

  if (existingServices.length > 0) {
    const transaction = client.transaction()
    existingServices.forEach((doc) => transaction.delete(doc._id))
    await transaction.commit()
    console.log(
      `Deleted ${existingServices.length} existing service document(s).`
    )
  } else {
    console.log("No existing service documents to delete.")
  }

  const createTransaction = client.transaction()
  services.forEach((service) => createTransaction.create(service))
  await createTransaction.commit()
  console.log(`Created ${services.length} service document(s).`)

  const verification = await client.fetch(
    '*[_type == "service"] | order(sortOrder asc) { title, tagline, price, sortOrder }'
  )

  console.log(JSON.stringify(verification, null, 2))
}

seedServices().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
