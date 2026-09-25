import HeroSection from "@/components/custom/HeroSection"
import WhatIDo from "@/components/custom/WhatIDo"
import FeaturedServices from "@/components/custom/FeaturedServices"
import BackgroundSummary from "@/components/custom/BackgroundSummary"
import SelectedWork from "@/components/custom/SelectedWork"
import LatestWriting from "@/components/custom/LatestWriting"
import ServicesInlineCta from "@/components/custom/ServicesInlineCta"
import { client } from "@/src/sanity/client"
import {
  ACADEMIC_HISTORY_QUERY,
  EXPERIENCE_QUERY,
  WORK_LIST_QUERY,
  SERVICES_QUERY,
} from "@/src/sanity/queries"
import {
  toAcademicHistory,
  toExperience,
  toWorkItems,
  toServices,
} from "@/src/sanity/adapters"
import {
  getHashnodePosts,
  getHashnodeRssPosts,
  type HashnodePost,
} from "@/src/hashnode/hashnode"
import { createPageMetadata } from "@/src/seo/site"

const description =
  "Muhammad Azlaan Zubair — Software engineer and researcher building intelligent systems for real-world impact. Focused on scalable systems, AI, and human-centered products."

export const metadata = createPageMetadata({
  title: "Muhammad Azlaan Zubair — Software Engineer & Researcher",
  description,
  path: "/",
  keywords: [
    "Muhammad Azlaan Zubair",
    "software engineer",
    "AI researcher",
    "web engineering",
    "portfolio",
  ],
})

export const revalidate = 21600

const fetchOptions = { next: { revalidate: 21600 } }

export default async function Page() {
  const [experienceResult, academicResult, workResult, servicesResult] =
    await Promise.allSettled([
      client.fetch(EXPERIENCE_QUERY, {}, fetchOptions),
      client.fetch(ACADEMIC_HISTORY_QUERY, {}, fetchOptions),
      client.fetch(WORK_LIST_QUERY, {}, fetchOptions),
      client.fetch(SERVICES_QUERY, {}, fetchOptions),
    ])

  const experiences =
    experienceResult.status === "fulfilled"
      ? toExperience(experienceResult.value)
      : []

  const academics =
    academicResult.status === "fulfilled"
      ? toAcademicHistory(academicResult.value)
      : []

  const allProjects =
    workResult.status === "fulfilled" ? toWorkItems(workResult.value) : []
  const services =
    servicesResult.status === "fulfilled"
      ? toServices(servicesResult.value)
      : []

  const featuredProjects = allProjects
    .filter((p) => p.metadata.isFeatured)
    .slice(0, 3)
  const selectedProjects =
    featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 3)

  let posts: HashnodePost[] = []
  try {
    const res = await getHashnodePosts({ first: 3, excludeCaseStudies: false })
    posts = res.posts
  } catch {
    try {
      posts = await getHashnodeRssPosts({ first: 3, excludeCaseStudies: false })
    } catch {
      /* writing section will be empty */
    }
  }

  return (
    <>
      <HeroSection />
      <WhatIDo />
      <FeaturedServices services={services} />
      <SelectedWork projects={selectedProjects} />
      <LatestWriting posts={posts} />
      <BackgroundSummary experiences={experiences} academics={academics} />
      <ServicesInlineCta
        heading="Need something built?"
        text="I offer productized services — MVPs, websites, technical writing, and automation — delivered in days, not months."
        href="/services?service=mvp-build#service-pages-block"
      />
    </>
  )
}
