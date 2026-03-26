import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'manualGroup',
  title: 'Manual Group',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      items: 'items',
    },
    prepare({title, items}) {
      return {
        title,
        subtitle: items?.slice(0, 2)?.join(' • '),
      }
    },
  },
})
