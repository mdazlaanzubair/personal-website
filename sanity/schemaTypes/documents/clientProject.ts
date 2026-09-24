import { UsersIcon } from "@sanity/icons/Users"
import { defineArrayMember, defineField, defineType } from "sanity"

import { MAX_TITLE_LENGTH } from "../shared/validation"

export const clientProject = defineType({
  name: "clientProject",
  title: "Client Project",
  type: "document",
  icon: UsersIcon,
  initialValue: {
    isActive: true,
    tags: [],
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(MAX_TITLE_LENGTH),
    }),
    defineField({
      name: "domain",
      title: "Domain / Industry",
      description: 'e.g. "Design Studio", "Academic Research"',
      type: "string",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.unique().max(6),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "title",
      domain: "domain",
    },
    prepare({ title, domain }) {
      return {
        title,
        subtitle: domain,
      }
    },
  },
})
