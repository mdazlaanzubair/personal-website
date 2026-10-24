import { CaseIcon } from "@sanity/icons/Case"
import { defineArrayMember, defineField, defineType } from "sanity"

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  SLUG_PATTERN,
  uniqueSlugWithinType,
} from "../shared/validation"

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metadata", title: "Case-study details" },
    { name: "seo", title: "SEO" },
  ],
  initialValue: {
    metadata: {
      isFeatured: false,
    },
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      description:
        "Use a public-safe title that does not reveal an anonymized organization.",
      group: "content",
      validation: (rule) => rule.required().max(MAX_TITLE_LENGTH),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: uniqueSlugWithinType,
      },
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            value?.current && SLUG_PATTERN.test(value.current)
              ? true
              : "Use lowercase letters, numbers, and single hyphens only."
          ),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description:
        "Write a public-safe summary that omits confidential identifiers.",
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
      name: "body",
      type: "portableText",
      group: "content",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "metadata",
      title: "Case-study details",
      type: "object",
      group: "metadata",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "isFeatured",
          title: "Feature this case study",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "timeline",
          type: "string",
          description: "A human-readable range, for example Jan–Mar 2026.",
          validation: (rule) => rule.max(120),
        }),
        defineField({
          name: "project",
          type: "projectSummary",
        }),
        defineField({
          name: "company",
          type: "company",
        }),
      ],
    }),
    defineField({
      name: "seo",
      type: "seo",
      description:
        "For anonymized work, public queries ignore SEO overrides and use the public-safe title and description.",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      company: "metadata.company.name",
      featured: "metadata.isFeatured",
      isAnonymized: "metadata.company.isAnonymized",
      title: "title",
    },
    prepare({ company, featured, isAnonymized, title }) {
      return {
        title,
        subtitle: [
          isAnonymized ? "Confidential organization" : company,
          featured ? "Featured" : undefined,
        ]
          .filter(Boolean)
          .join(" · "),
      }
    },
  },
})
