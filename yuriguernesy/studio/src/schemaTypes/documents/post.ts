import {defineField, defineType} from 'sanity'

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export default defineType({
  name: 'post',
  title: 'Post',
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
      { title: 'Build', value: 'build' },
      { title: 'Dev Log', value: 'dev-log' },
      { title: 'Brain Dump', value: 'brain-dump' },
      { title: 'Tutorial', value: 'tutorial' },
      { title: 'Idea', value: 'idea' },
      { title: 'Automation', value: 'automation' },
      { title: 'Stack', value: 'stack' },
      { title: 'Hardware', value: 'hardware' },
      { title: 'Meta', value: 'meta' },
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
