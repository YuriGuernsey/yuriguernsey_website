import {defineField, defineType} from 'sanity'
import { HomeIcon, CogIcon } from '@sanity/icons';
/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
   groups: [
    {
      name: 'content',
      title: 'Content',
      icon: HomeIcon,
      default: true
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: CogIcon
    },
    {
      name: 'settings',
      title: 'Settings',
      icon: CogIcon
    }
  ],
  fieldsets: [
    {
      name: 'hero',
      title: 'Hero',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: true,
    }),
     defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'text',
      group: 'content',
      fieldset: 'hero'
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      group: 'content',
      fieldset: 'hero'

    }),
        defineField({
      name: 'herosubheading',
      title: 'Hero Subheading',
      type: 'text',
      group: 'content',
      fieldset: 'hero'
    }),
    defineField({
      name: 'heroparagraph',
      title: 'Hero Paragraph',
      type: 'text',
      group: 'content',
      fieldset: 'hero'
    }),
     defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'text',
      group: 'seo'
    }),
    defineField({
      name: 'availableForFreelance',
      title: 'Open For Freelance Work',
      type: 'boolean',
      group: 'settings'
    }),
    defineField({
      name: 'lookingForWork',
      title: 'Open for Work',
      type: 'boolean',
      group: 'settings'
    }),
    defineField({
      name: 'cv',
      title: 'CV',
      type: 'file',
      group: 'settings'
    }),
    
   defineField({
      name: 'moreAboutMe',
      title: 'About me',
      type: 'blockContent',
      group: 'content'
    }),

    defineField({
      name: 'moreAboutMeHighlights',
      title: 'Highlights',
      type: 'blockContent',
      group: 'content'
    }),
     defineField({
      name: 'moreAboutMeLifeMission',
      title: 'Life Mission',
      type: 'blockContent',
      group: 'content'
    }),
  ],
 
})
