import { ImageIcon } from "@sanity/icons/Image"
import { defineField, defineType } from "sanity"

import {
  MAX_SEO_DESCRIPTION_LENGTH,
  MAX_SEO_TITLE_LENGTH,
} from "../shared/validation"

export const seo = defineType({
  name: "seo",
  title: "SEO and social sharing",
  type: "object",
  icon: ImageIcon,
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "Optional override. The document title is used by default.",
      validation: (rule) =>
        rule
          .max(MAX_SEO_TITLE_LENGTH)
          .warning(
            `Keep meta titles under ${MAX_SEO_TITLE_LENGTH} characters.`
          ),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      description:
        "Optional override. The document description is used by default.",
      validation: (rule) =>
        rule
          .max(MAX_SEO_DESCRIPTION_LENGTH)
          .warning(
            `Keep meta descriptions under ${MAX_SEO_DESCRIPTION_LENGTH} characters.`
          ),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      validation: (rule) =>
        rule
          .uri({ scheme: ["http", "https"] })
          .error("Use a complete http:// or https:// URL."),
    }),
    defineField({
      name: "openGraphImage",
      title: "Open Graph image",
      type: "image",
      description: "A 1200 × 630 image works well on most social platforms.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Exclude from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
})
