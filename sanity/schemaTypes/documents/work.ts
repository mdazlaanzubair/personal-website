import { ProjectsIcon } from "@sanity/icons/Projects"
import { defineArrayMember, defineField, defineType } from "sanity"

import { getYouTubeId } from "../../../lib/youtube"
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from "../shared/validation"

export const work = defineType({
  name: "work",
  title: "Work / project",
  type: "document",
  icon: ProjectsIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metadata", title: "Project details" },
  ],
  initialValue: {
    metadata: {
      isFeatured: false,
      key_contributions: [],
    },
    tags: [],
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(MAX_TITLE_LENGTH),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(MAX_DESCRIPTION_LENGTH),
    }),
    defineField({
      name: "tags",
      type: "array",
      group: "content",
      initialValue: [],
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().unique().max(12),
    }),
    defineField({
      name: "images",
      title: "Gallery images",
      description:
        "Up to 4 images: screenshots, architecture diagrams, system flows, etc.",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "previewVideo",
      title: "Preview video",
      description:
        "Optional short, silent loop (MP4 or WebM, ideally under 10 s and 5 MB). It plays on the project card when hovered and leads the gallery. The first gallery image is its poster. If a YouTube URL is also set, this upload is used.",
      type: "file",
      group: "content",
      options: { accept: "video/mp4,video/webm" },
    }),
    defineField({
      name: "previewYoutubeUrl",
      title: "Preview video (YouTube)",
      description:
        "Use a YouTube link instead of uploading, to save Sanity storage. It plays muted on the project card when hovered and leads the gallery. Watch, youtu.be and Shorts links all work.",
      type: "url",
      group: "content",
      validation: (rule) =>
        rule.custom((url) =>
          !url || getYouTubeId(url)
            ? true
            : "Use a YouTube video link, e.g. https://www.youtube.com/watch?v=…"
        ),
    }),
    defineField({
      name: "metadata",
      title: "Project details",
      type: "object",
      group: "metadata",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "isFeatured",
          title: "Feature this project",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "projectUrl",
          title: "Project URL",
          type: "url",
          validation: (rule) =>
            rule
              .uri({ scheme: ["http", "https"] })
              .error("Use a complete http:// or https:// URL."),
        }),
        defineField({
          name: "repositoryUrl",
          title: "Repository URL",
          type: "url",
          validation: (rule) =>
            rule
              .uri({ scheme: ["http", "https"] })
              .error("Use a complete http:// or https:// URL."),
        }),
        defineField({
          name: "key_contributions",
          title: "Key contributions",
          type: "portableText",
          initialValue: [],
          validation: (rule) => rule.required().min(1),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      contributions: "metadata.key_contributions",
      featured: "metadata.isFeatured",
      title: "title",
    },
    prepare({ contributions, featured, title }) {
      return {
        title,
        subtitle: [
          Array.isArray(contributions)
            ? `${contributions.length} contributions`
            : undefined,
          featured ? "Featured" : undefined,
        ]
          .filter(Boolean)
          .join(" · "),
      }
    },
  },
})
