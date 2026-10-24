import { CaseIcon } from "@sanity/icons/Case"
import { defineField, defineType } from "sanity"

type CompanyValue = {
  isAnonymized?: boolean
  logo?: { asset?: unknown }
  name?: string
  website?: string
}

export const company = defineType({
  name: "company",
  title: "Organization",
  type: "object",
  icon: CaseIcon,
  description:
    "Only public organization information belongs here. For anonymized work, enable anonymization and do not store the real name or identifying assets.",
  validation: (rule) =>
    rule.custom((rawValue) => {
      const value = rawValue as CompanyValue | undefined

      if (!value) return true

      if (value.isAnonymized) {
        if (value.name?.trim() || value.website || value.logo?.asset) {
          return "An anonymized organization cannot store a name, website, or logo."
        }

        return true
      }

      return value.name?.trim()
        ? true
        : "A public organization name is required when anonymization is off."
    }),
  fields: [
    defineField({
      name: "isAnonymized",
      title: "Anonymize this organization",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "name",
      title: "Public organization name",
      type: "string",
      description: "Never enter a confidential real name in this field.",
      hidden: ({ parent }) =>
        Boolean((parent as CompanyValue | undefined)?.isAnonymized),
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) =>
        Boolean((parent as CompanyValue | undefined)?.isAnonymized),
    }),
    defineField({
      name: "website",
      type: "url",
      hidden: ({ parent }) =>
        Boolean((parent as CompanyValue | undefined)?.isAnonymized),
      validation: (rule) =>
        rule
          .uri({ scheme: ["http", "https"] })
          .error("Use a complete http:// or https:// URL."),
    }),
  ],
  preview: {
    select: {
      isAnonymized: "isAnonymized",
      media: "logo",
      title: "name",
    },
    prepare({ isAnonymized, media, title }) {
      return {
        title: isAnonymized ? "Confidential organization" : title,
        subtitle: isAnonymized ? "Anonymized" : undefined,
        media: isAnonymized ? undefined : media,
      }
    },
  },
})
