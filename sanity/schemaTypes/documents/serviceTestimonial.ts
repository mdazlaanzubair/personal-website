import { UsersIcon } from "@sanity/icons/Users"
import { defineField, defineType } from "sanity"

export const serviceTestimonial = defineType({
  name: "serviceTestimonial",
  title: "Service Testimonial",
  type: "document",
  icon: UsersIcon,
  initialValue: {
    isActive: true,
  },
  fields: [
    defineField({
      name: "clientName",
      title: "Client name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "clientRole",
      title: "Client role",
      description: 'e.g. "Founder, SaaS Startup" or "PhD Researcher"',
      type: "string",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectType",
      title: "Project type",
      description: 'Contextual label like "SaaS MVP" or "AI Tool"',
      type: "string",
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
      title: "clientName",
      projectType: "projectType",
    },
    prepare({ title, projectType }) {
      return {
        title,
        subtitle: projectType,
      }
    },
  },
})
