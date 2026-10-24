import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'
import {LinkIcon} from '@sanity/icons/Link'
import {UserIcon} from '@sanity/icons/User'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {TrendUpwardIcon} from '@sanity/icons/TrendUpward'

/**
 * Short rich text: paragraphs, bullet lists, bold, italic and links.
 * No headings, so every case study keeps the same layout.
 */
export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Paragraph', value: 'normal'}],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            icon: LinkIcon,
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({scheme: ['https', 'mailto'], allowRelative: true}),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})

/** A titled point: used for "What I built" and "Key decisions". */
export const caseStudyPoint = defineType({
  name: 'caseStudyPoint',
  title: 'Point',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.required().max(320).warning('Keep it to two or three sentences.'),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'description'}},
})

/**
 * A result. A number is optional, but it needs evidence.
 * Evidence is private: the site never queries it.
 */
export const caseStudyResult = defineType({
  name: 'caseStudyResult',
  title: 'Result',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: 'statement',
      type: 'text',
      rows: 2,
      description: 'What changed, in one sentence. Only claim what you did or can prove.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'metric',
      title: 'Number (optional)',
      type: 'object',
      description: 'Only for a figure someone has confirmed. Shown with a count-up animation.',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'value', type: 'number'}),
        defineField({name: 'prefix', type: 'string', description: 'e.g. "$" or "+"'}),
        defineField({name: 'suffix', type: 'string', description: 'e.g. "%", "x" or " hours"'}),
        defineField({name: 'label', type: 'string', description: 'e.g. "faster quote journey"'}),
      ],
    }),
    defineField({
      name: 'evidence',
      title: 'Evidence (private)',
      type: 'string',
      description:
        'Who confirmed the number and how, e.g. "Email from the marketing lead, Mar 2025". Never shown on the site.',
      validation: (rule) =>
        rule.custom((evidence, context) => {
          const parent = context.parent as {metric?: {value?: number}} | undefined
          if (typeof parent?.metric?.value === 'number' && !evidence) {
            return 'Add the evidence for this number, or remove the number.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'statement', value: 'metric.value', suffix: 'metric.suffix'},
    prepare: ({title, value, suffix}) => ({
      title,
      subtitle: typeof value === 'number' ? `${value}${suffix ?? ''}` : 'No number',
    }),
  },
})

/** A teammate. Their name is shown only after they agree. */
export const teamMember = defineType({
  name: 'teamMember',
  title: 'Teammate',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'role',
      type: 'string',
      description: 'e.g. "Backend developer". Always shown.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'name', type: 'string'}),
    defineField({
      name: 'canName',
      title: 'They agreed to be named',
      type: 'boolean',
      initialValue: false,
      description: 'Until this is on, the site shows the role only.',
    }),
    defineField({
      name: 'profileUrl',
      title: 'Profile link',
      type: 'url',
      description: 'LinkedIn or GitHub. Shown only when they agreed to be named.',
    }),
  ],
  preview: {
    select: {name: 'name', role: 'role', canName: 'canName'},
    prepare: ({name, role, canName}) => ({
      title: name ?? role,
      subtitle: name ? `${role} · ${canName ? 'named' : 'name hidden'}` : 'Role only',
    }),
  },
})

export const externalLink = defineType({
  name: 'externalLink',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      description: 'e.g. "Live site"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['https']}),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'url'}},
})

/** Every case-study image: cover, screenshots and diagrams. */
export const caseStudyImage = defineType({
  name: 'caseStudyImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'visualId',
      title: 'Visual ID',
      type: 'string',
      description:
        'Matches an ID in visual-prompts.md, e.g. "cobone-cover". Tells you which generated image goes here. Not shown on the site.',
      validation: (rule) =>
        rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {name: 'kebab-case'}).warning(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'What the image shows, for screen readers and Google.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      type: 'string',
      options: {
        list: [
          {title: 'Illustration (AI or drawn; shown with an "Illustrative" label)', value: 'illustration'},
          {title: 'Screenshot or recording still of a public page', value: 'screenshot'},
          {title: 'Diagram (export it as SVG so labels stay sharp)', value: 'diagram'},
        ],
        layout: 'radio',
      },
      initialValue: 'illustration',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'caption', type: 'string'}),
  ],
  preview: {
    select: {visualId: 'visualId', alt: 'alt', media: 'asset'},
    prepare: ({visualId, alt, media}) => ({
      title: visualId ?? alt ?? 'Image',
      subtitle: media ? alt : 'No image uploaded yet',
      media,
    }),
  },
})

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Falls back to the case-study title.',
      validation: (rule) => rule.max(60).warning('Google cuts titles longer than about 60 characters.'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Falls back to the outcome line.',
      validation: (rule) =>
        rule.max(160).warning('Google cuts descriptions longer than about 160 characters.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description: '1200 × 630. Falls back to the cover image.',
    }),
  ],
})
