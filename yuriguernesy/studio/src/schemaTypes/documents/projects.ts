import {defineField, defineType} from 'sanity'

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
    }),
    defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
        }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alternative text',
                    type: 'string',
                }),
            ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField(
          {
  name: 'tags',
  title: 'Tags',
  type: 'array',
  of: [{ type: 'string' }],
  options: {
    list: [
      { title: 'Automation', value: 'automation' },
      { title: 'Website', value: 'website' },
      { title: 'Web App', value: 'web-app' },
      { title: 'Mobile App', value: 'mobile-app' },
      { title: 'AI', value: 'ai' },
      { title: 'Hardware', value: 'hardware' },
    
    ],
  },
}
    )
  ],
 preview: {
  select: {
    title: 'title',
    tags: 'tags',
    media: 'mainImage',
  },
  prepare({ title, tags, media }) {
    return {
      title,
      subtitle: tags?.join(', '), // turn array into comma-separated string
      media,
    }
  }
}

    
    // prepare(selection) {
    //   const {author} = selection
    //   return {...selection, subtitle: author && `by ${author}`}
    // },

})
