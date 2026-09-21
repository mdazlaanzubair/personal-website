import { DocumentTextIcon } from "@sanity/icons/DocumentText"
import { defineArrayMember, defineField, defineType } from "sanity"

import {
  publicationStatusLabels,
  publicationStatusOptions,
} from "../shared/options"
import { MAX_TITLE_LENGTH, URL_PATTERN } from "../shared/validation"

const maximumPublicationYear = new Date().getFullYear() + 1

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metadata", title: "Publication details" },
  ],
  initialValue: {
    metadata: {
      isFeatured: false,
      status: "in_preparation",
    },
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(MAX_TITLE_LENGTH),
    }),
    defineField({
      name: "abstract",
      type: "text",
      rows: 8,
      group: "content",
      validation: (rule) => rule.required().max(5000),
    }),
    defineField({
      name: "authors",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "images",
      title: "Gallery images",
      description:
        "Up to 4 images: mind maps, architecture diagrams, paper abstract screenshots, etc.",
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
      name: "metadata",
      title: "Publication details",
      type: "object",
      group: "metadata",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "journal",
          type: "string",
          validation: (rule) => rule.max(240),
        }),
        defineField({
          name: "status",
          type: "string",
          options: {
            list: [...publicationStatusOptions],
            layout: "radio",
          },
          initialValue: "in_preparation",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "year",
          type: "number",
          validation: (rule) =>
            rule
              .integer()
              .min(1900)
              .max(maximumPublicationYear)
              .error(
                `Use a four-digit year from 1900 to ${maximumPublicationYear}.`
              ),
        }),
        defineField({
          name: "doi",
          title: "DOI",
          type: "string",
          description:
            "Enter a DOI or publication URL (e.g. 10.1000/xyz123 or https://doi.org/... or https://arxiv.org/...)",
          validation: (rule) =>
            rule.regex(URL_PATTERN, {
              name: "URL or DOI",
              invert: false,
            }),
        }),
        defineField({
          name: "isFeatured",
          title: "Feature this publication",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Publication year, newest",
      name: "publicationYearDesc",
      by: [
        { field: "metadata.year", direction: "desc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      featured: "metadata.isFeatured",
      journal: "metadata.journal",
      status: "metadata.status",
      title: "title",
      year: "metadata.year",
    },
    prepare({ featured, journal, status, title, year }) {
      const details = [
        publicationStatusLabels[status] ?? status,
        journal,
        year,
        featured ? "Featured" : undefined,
      ].filter(Boolean)

      return {
        title,
        subtitle: details.join(" · "),
      }
    },
  },
})
