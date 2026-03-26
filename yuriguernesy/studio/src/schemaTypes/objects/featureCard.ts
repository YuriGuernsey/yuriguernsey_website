import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'featureCard',
  title: 'Feature Card',
  type: 'object',
  fields: [
    defineField({
      name: 'posterLabel',
      title: 'Poster Label',
      description: 'Large faded wordmark shown in the card poster.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ribbonTags',
      title: 'Ribbon Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'posterSummary',
      title: 'Poster Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'href',
      title: 'URL or anchor',
      type: 'string',
      description: 'Examples: /project/yuriguernsey-com-v2, https://example.com, #work',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'posterLabel',
    },
  },
})
