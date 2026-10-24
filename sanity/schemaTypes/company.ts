import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

/**
 * An employer or a client. Shared by case studies and, later,
 * the About page's experience timeline.
 */
export const company = defineType({
  name: 'company',
  title: 'Company',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'The public name, e.g. "ME Digital Group".',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'website', type: 'url', validation: (rule) => rule.uri({scheme: ['https']})}),
    defineField({name: 'location', type: 'string', description: 'e.g. "Dubai, UAE"'}),
  ],
  preview: {select: {title: 'name', subtitle: 'location'}},
})
