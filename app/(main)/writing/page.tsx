import WritingPageContent from "@/components/custom/WritingPageContent"
import JsonLd from "@/components/seo/JsonLd"
import {
  getHashnodePosts,
  getHashnodeRssPosts,
  type HashnodePost,
} from "@/src/hashnode/hashnode"
import { createPageMetadata } from "@/src/seo/site"

const description =
  "Ideas, notes, and explorations on AI, software engineering, and the systems that shape our world — by Muhammad Azlaan Zubair."

export const metadata = createPageMetadata({
  title: "Writing",
  description,
  path: "/writing",
  keywords: [
    "Muhammad Azlaan Zubair blog",
    "software engineering articles",
    "AI and machine learning writing",
    "web development blog",
    "tech insights",
  ],
})

export const revalidate = 21600

export default async function WritingPage() {
  let posts: HashnodePost[] = []

  try {
    const res = await getHashnodePosts({ first: 50, excludeCaseStudies: false })
    posts = res.posts
  } catch {
    try {
      posts = await getHashnodeRssPosts({
        first: 50,
        excludeCaseStudies: false,
      })
    } catch {
      /* writing section will be empty */
    }
  }

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Muhammad Azlaan Zubair — Writing",
    description,
    url: "https://mdazlaanzubair.com/writing",
    author: {
      "@type": "Person",
      name: "Muhammad Azlaan Zubair",
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.brief,
      url: post.url,
      datePublished: post.publishedAt,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    })),
  }

  return (
    <>
      <JsonLd data={blogJsonLd} />
      <WritingPageContent posts={posts} />
    </>
  )
}
