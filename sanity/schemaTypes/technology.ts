import {defineField, defineType} from 'sanity'
import {CodeIcon} from '@sanity/icons/Code'

/** A tool, language or service. Shared by case studies, services and the About skills list. */
export const technology = defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  icon: CodeIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          {title: 'Frontend', value: 'frontend'},
          {title: 'Backend', value: 'backend'},
          {title: 'AI / ML', value: 'ai'},
          {title: 'Integration & auth', value: 'integration'},
          {title: 'Automation', value: 'automation'},
          {title: 'Tooling & delivery', value: 'tooling'},
          {title: 'Design', value: 'design'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'category'}},
})
