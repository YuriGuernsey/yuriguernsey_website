import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'connectCard',
  title: 'Connect Card',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
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
      name: 'href',
      title: 'URL',
      description: 'Optional. If provided, the card becomes clickable.',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'label',
      href: 'href',
    },
    prepare({title, subtitle, href}) {
      return {
        title,
        subtitle: href || subtitle,
      }
    },
  },
})
