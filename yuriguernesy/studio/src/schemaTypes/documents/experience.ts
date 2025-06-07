import {defineField, defineType} from 'sanity'

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
  name: 'employmentType',
  title: 'Employment Type',
  type: 'string',
  options: {
    list: [
      { title: 'Full-Time', value: 'full-time' },
      { title: 'Part-Time', value: 'part-time' },
      { title: 'Freelance', value: 'freelance' },
      { title: 'Self-Employed', value: 'self-employed' }
    ],
    layout: 'dropdown' // Optional: defaults to 'dropdown'
  }
}),
defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM' // Display only month and year
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'currentlyEmployed',
      title: 'Currently Employed',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM' // Display only month and year
      },
      hidden: ({ parent }) => parent?.currentlyEmployed === true
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string'
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
   
  ],
 preview: {
  select: {
    title: 'title',
    company: 'company',
    media: 'mainImage',
  },
    prepare({ title, company, media }) {
    return {
      title,
      subtitle: company, // turn array into comma-separated string
      media,
    }
  }
 
}

    
    // prepare(selection) {
    //   const {author} = selection
    //   return {...selection, subtitle: author && `by ${author}`}
    // },

})
