import { CogIcon } from "@sanity/icons/Cog"
import { defineArrayMember, defineField, defineType } from "sanity"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  initialValue: {
    interests: [],
    skills: [],
    socialMedia: [],
  },
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "cv", title: "CV" },
  ],
  fields: [
    defineField({
      name: "skills",
      group: "profile",
      type: "array",
      initialValue: [],
      of: [defineArrayMember({ type: "skill" })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "socialMedia",
      group: "profile",
      title: "Links",
      description:
        "Profiles and contact links, shown in this order. Add as many as you like.",
      type: "array",
      initialValue: [],
      of: [defineArrayMember({ type: "socialProfile" })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "interests",
      group: "profile",
      type: "array",
      initialValue: [],
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().unique(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      description: "Shown under your name, e.g. Software Engineer.",
      type: "string",
      group: "cv",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "location",
      title: "Location",
      description: "Shown as “from …” in the header, e.g. Karachi, Pakistan.",
      type: "string",
      group: "cv",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "cv",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Contact phone",
      description:
        "Shown as Contact in the header, e.g. +92 311 3046692. Leave empty to hide it.",
      type: "string",
      group: "cv",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "resumeSummary",
      title: "Resume summary",
      description:
        "For hiring managers. Two to four short sentences: your role, core skills, current work and proof.",
      type: "text",
      rows: 4,
      group: "cv",
      validation: (rule) => rule.max(700),
    }),
    defineField({
      name: "academicSummary",
      title: "Academic CV summary",
      description:
        "For professors and research teams. Your research focus, record, studies and teaching.",
      type: "text",
      rows: 4,
      group: "cv",
      validation: (rule) => rule.max(700),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site settings",
        subtitle: "Skills, links, interests, and CV details",
      }
    },
  },
})
