import { PackageIcon } from "@sanity/icons/Package"
import { defineArrayMember, defineField, defineType } from "sanity"

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: PackageIcon,
  initialValue: {
    isActive: true,
    buyers: [],
    deliverables: [],
    stackTags: [],
    highlights: [],
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "One-line positioning statement",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "2-3 sentence expanded description",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: 'Display price — e.g. "Starting at $1,200"',
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "string",
      description: 'e.g. "7 business days" or "Per article"',
    }),
    defineField({
      name: "buyers",
      title: "Buyers",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Who this service is for — shown as tags on the UI",
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "What the client gets",
    }),
    defineField({
      name: "stackTags",
      title: "Stack Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Tech stack labels",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "description" },
          },
        }),
      ],
      description: "3-4 key selling points shown on the visual side",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Toggle visibility without deleting",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Controls display order (lower = first)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagline",
    },
  },
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
})
