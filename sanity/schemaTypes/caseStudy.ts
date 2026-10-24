import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

/**
 * A case study. One document per project page at /work/[slug].
 *
 * Rules built into the fields:
 * - Confidential clients show a public label, never their name.
 * - Teammates show only their role until they agree to be named.
 * - A number in Results needs private evidence.
 * - Private fields (evidence, visual IDs, internal notes) are never queried by the site.
 *
 * If your dataset is public, anyone can read published documents through the API,
 * private fields included. Make the dataset private, or never type a confidential
 * client's real name into any field.
 */
export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'story', title: 'Story'},
    {name: 'media', title: 'Images'},
    {name: 'seo', title: 'SEO'},
    {name: 'internal', title: 'Private'},
  ],
  fields: [
    // ── Overview ───────────────────────────────────────────
    defineField({
      name: 'title',
      type: 'string',
      group: 'overview',
      description: 'e.g. "Cobone Relaunch"',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'overview',
      description: 'The page address: /work/<slug>',
      options: {source: 'title', maxLength: 80},
      validation: (rule) =>
        rule.required().custom((slug) =>
          slug?.current && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)
            ? 'Use lowercase letters, numbers and hyphens only.'
            : true,
        ),
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      group: 'overview',
      description: 'One short line under the title.',
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'outcome',
      title: 'Outcome line',
      type: 'text',
      rows: 2,
      group: 'overview',
      description: 'The single sentence a visitor should remember. Shown on cards.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'listing',
      title: 'Where it appears',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          {title: 'Featured (Home and Work)', value: 'featured'},
          {title: 'Work page only', value: 'listed'},
          {title: 'Hidden (saved, not shown anywhere)', value: 'hidden'},
        ],
        layout: 'radio',
      },
      initialValue: 'hidden',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priority',
      type: 'number',
      group: 'overview',
      description: 'Display order. 1 shows first, and the first featured study gets the large tile on Home.',
      initialValue: 10,
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'employer',
      type: 'reference',
      to: [{type: 'company'}],
      group: 'overview',
      description: 'Who employed or contracted you. Shown as "via …" when it differs from the client.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      type: 'object',
      group: 'overview',
      fields: [
        defineField({
          name: 'visibility',
          type: 'string',
          options: {
            list: [
              {title: 'Named (public, and your contract allows it)', value: 'named'},
              {title: 'Confidential (anonymised)', value: 'confidential'},
            ],
            layout: 'radio',
          },
          initialValue: 'confidential',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'company',
          type: 'reference',
          to: [{type: 'company'}],
          hidden: ({parent}) => parent?.visibility !== 'named',
          validation: (rule) =>
            rule.custom((value, context) =>
              (context.parent as {visibility?: string})?.visibility === 'named' && !value
                ? 'Pick the client.'
                : true,
            ),
        }),
        defineField({
          name: 'publicLabel',
          title: 'Public description',
          type: 'string',
          description: 'Shown instead of a name, e.g. "An enterprise task-management platform".',
          hidden: ({parent}) => parent?.visibility !== 'confidential',
          validation: (rule) =>
            rule.custom((value, context) =>
              (context.parent as {visibility?: string})?.visibility === 'confidential' && !value
                ? 'Describe the client without naming it.'
                : true,
            ),
        }),
        defineField({name: 'industry', type: 'string', description: 'e.g. "E-commerce · Deals"'}),
        defineField({name: 'region', type: 'string', description: 'e.g. "UAE"'}),
      ],
    }),
    defineField({
      name: 'role',
      title: 'Your role',
      type: 'string',
      group: 'overview',
      description: 'e.g. "Frontend Developer · Sole developer"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'team',
      type: 'array',
      group: 'overview',
      of: [defineArrayMember({type: 'teamMember'})],
    }),
    defineField({
      name: 'startDate',
      type: 'date',
      group: 'overview',
      options: {dateFormat: 'MMM YYYY'},
      description: 'The day is ignored; the site shows month and year.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'date',
      group: 'overview',
      options: {dateFormat: 'MMM YYYY'},
      description: 'Leave empty if the work is ongoing.',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const start = (context.document as {startDate?: string})?.startDate
          return start && endDate && endDate < start ? 'The end date is before the start date.' : true
        }),
    }),
    defineField({
      name: 'stack',
      type: 'array',
      group: 'overview',
      of: [defineArrayMember({type: 'reference', to: [{type: 'technology'}]})],
      validation: (rule) => rule.unique().max(10).warning('Keep the stack to the tools that matter.'),
    }),
    defineField({
      name: 'links',
      type: 'array',
      group: 'overview',
      of: [defineArrayMember({type: 'externalLink'})],
    }),
    defineField({
      name: 'linkNote',
      type: 'string',
      group: 'overview',
      description: 'e.g. "Internal tools, so there’s no public link."',
    }),

    // ── Story ──────────────────────────────────────────────
    defineField({
      name: 'problem',
      type: 'richText',
      group: 'story',
      description: 'What was wrong, and why it mattered. Two short paragraphs.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'built',
      title: 'What I built',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({type: 'caseStudyPoint'})],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    defineField({
      name: 'decisions',
      title: 'Key decisions',
      type: 'array',
      group: 'story',
      description: 'Why you did it this way. This is what CTOs read.',
      of: [defineArrayMember({type: 'caseStudyPoint'})],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'results',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({type: 'caseStudyResult'})],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'credit',
      type: 'string',
      group: 'story',
      description: 'e.g. "Designed by Cobone’s designer. I implemented it in production."',
    }),

    // ── Images ─────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      type: 'caseStudyImage',
      group: 'media',
      description: '16:10, at least 1600 px wide. Used on cards and at the top of the page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverVideoUrl',
      title: 'Cover video URL (optional)',
      type: 'url',
      group: 'media',
      description:
        'A short screen recording hosted on Mux, YouTube or Vimeo. Plays in place of the cover image. Don’t upload video files to Sanity.',
    }),
    defineField({
      name: 'gallery',
      title: 'Screenshots and diagrams',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({type: 'caseStudyImage'})],
      validation: (rule) => rule.max(6),
    }),

    // ── SEO ────────────────────────────────────────────────
    defineField({name: 'seo', type: 'seo', group: 'seo'}),

    // ── Private ────────────────────────────────────────────
    defineField({
      name: 'internalNotes',
      title: 'Internal notes',
      type: 'text',
      rows: 6,
      group: 'internal',
      description:
        'TODOs, permissions, hold reasons. Never shown on the site. Never write a confidential client’s real name here.',
    }),
  ],
  orderings: [
    {title: 'Display order', name: 'priorityAsc', by: [{field: 'priority', direction: 'asc'}]},
    {title: 'Newest first', name: 'startDateDesc', by: [{field: 'startDate', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', listing: 'listing', priority: 'priority', media: 'coverImage'},
    prepare: ({title, listing, priority, media}) => ({
      title,
      subtitle: `${priority ?? '–'} · ${
        listing === 'featured' ? 'Featured' : listing === 'listed' ? 'Work page' : 'Hidden'
      }`,
      media,
    }),
  },
})
