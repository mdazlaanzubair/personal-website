import { ProjectsIcon } from "@sanity/icons/Projects"
import { defineField, defineType } from "sanity"

import { SLUG_PATTERN } from "../shared/validation"

export const projectSummary = defineType({
  name: "projectSummary",
  title: "Project summary",
  type: "object",
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "Optional route slug when this project has its own public page.",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) =>
        rule.custom((value) =>
          !value?.current || SLUG_PATTERN.test(value.current)
            ? true
            : "Use lowercase letters, numbers, and single hyphens only."
        ),
    }),
    defineField({
      name: "website",
      type: "url",
      validation: (rule) =>
        rule
          .uri({ scheme: ["http", "https"] })
          .error("Use a complete http:// or https:// URL."),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "website",
    },
  },
})
