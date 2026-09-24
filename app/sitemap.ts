import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/src/seo/site"

export const revalidate = 21600

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.8,
      images: [absoluteUrl("/architect.png")],
    },
    {
      url: absoluteUrl("/work"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/services"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/writing"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]
}
