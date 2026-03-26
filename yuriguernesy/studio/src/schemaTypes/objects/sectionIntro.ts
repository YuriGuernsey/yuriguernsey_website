import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sectionIntro',
  title: 'Section Intro',
  type: 'object',
  fields: [
    defineField({
      name: 'overline',
      title: 'Overline',
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'overline',
    },
  },
})
