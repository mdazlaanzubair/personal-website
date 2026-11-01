import { CaseIcon } from "@sanity/icons/Case"
import { defineField, defineType } from "sanity"

import { MAX_TITLE_LENGTH } from "../shared/validation"

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "company",
      type: "experienceCompany",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timeline",
      type: "string",
      description: "A human-readable range, for example Jan 2024–Present.",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "role",
      type: "string",
      validation: (rule) => rule.required().max(MAX_TITLE_LENGTH),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      description:
        "Controls where this role is listed. Smaller numbers are older roles, larger numbers are newer; the largest is shown first.",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "key_contributions",
      title: "Key contributions",
      type: "portableText",
      initialValue: [],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    {
      title: "Sort order, newest first",
      name: "sortOrderDesc",
      by: [{ field: "sortOrder", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      company: "company.name",
      isAnonymized: "company.isAnonymized",
      location: "company.location",
      role: "role",
      timeline: "timeline",
    },
    prepare({ company, isAnonymized, location, role, timeline }) {
      return {
        title: role,
        subtitle: [
          isAnonymized ? "Confidential organization" : company,
          location,
          timeline,
        ]
          .filter(Boolean)
          .join(" · "),
      }
    },
  },
})
