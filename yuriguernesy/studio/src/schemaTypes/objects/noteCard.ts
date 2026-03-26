import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'noteCard',
  title: 'Note Card',
  type: 'object',
  fields: [
    defineField({
      name: 'meta',
      title: 'Meta',
      type: 'string',
      description: 'Example: Agency ops / 2026',
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
      name: 'linkLabel',
      title: 'Link Label',
      type: 'string',
      initialValue: 'Read more',
    }),
    defineField({
      name: 'href',
      title: 'URL or anchor',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'meta',
    },
  },
})
