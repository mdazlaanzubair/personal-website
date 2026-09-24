import { PackageIcon } from "@sanity/icons/Package"
import { defineArrayMember, defineField, defineType } from "sanity"

import { MAX_TITLE_LENGTH } from "../shared/validation"

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: PackageIcon,
  initialValue: {
    isActive: true,
    deliverables: [],
    stackTags: [],
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(MAX_TITLE_LENGTH),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description: "One-line description shown on cards",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Detailed scope description",
      type: "portableText",
    }),
    defineField({
      name: "price",
      title: "Price",
      description: 'e.g. "Starting at $1,500" or "Custom"',
      type: "string",
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      description: 'e.g. "7 business days"',
      type: "string",
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      description: "Bullet list of what's included",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "stackTags",
      title: "Tech stack",
      description: 'Labels like "Next.js", "Auth", "Payments"',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      description: "Toggle visibility without deleting",
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
      tagline: "tagline",
      price: "price",
    },
    prepare({ title, tagline, price }) {
      return {
        title,
        subtitle: [tagline, price].filter(Boolean).join(" · "),
      }
    },
  },
})
