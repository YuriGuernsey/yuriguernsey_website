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
  description:
    'Add any tags that help describe the project. Suggested examples: automation, website, web-app, mobile-app, ai, hardware.',
  type: 'array',
  of: [{ type: 'string' }],
  options: {
    layout: 'tags',
  },
  validation: (Rule) => Rule.unique(),
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
