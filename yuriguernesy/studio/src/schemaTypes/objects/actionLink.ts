import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'actionLink',
  title: 'Action Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL or anchor',
      description: 'Examples: /project, https://example.com, #about',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      initialValue: 'secondary',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
  },
})
