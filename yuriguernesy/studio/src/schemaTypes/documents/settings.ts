import {defineField, defineType} from 'sanity'
import {CogIcon, EarthGlobeIcon, ImageIcon} from '@sanity/icons'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  initialValue: {
    title: 'Settings',
    siteName: 'Yuri Guernsey',
    defaultTitle: 'Portfolio 2026',
    defaultDescription:
      'Yuri Alves is a Guernsey-based builder creating practical software, automation systems, and experimental hardware.',
    siteUrl: 'https://yuriguernsey.com',
    themeColor: '#040404',
  },
  groups: [
    {
      name: 'site',
      title: 'Site',
      icon: EarthGlobeIcon,
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: CogIcon,
    },
    {
      name: 'icons',
      title: 'Icons',
      icon: ImageIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      hidden: true,
      initialValue: 'Settings',
    }),
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'site',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      description: 'Used to generate canonical URLs and social metadata.',
      type: 'url',
      group: 'site',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultTitle',
      title: 'Default Page Title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 4,
      group: 'seo',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter / X Handle',
      description: 'Optional. Example: @yuriguernsey',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'themeColor',
      title: 'Theme Color',
      description: 'Used by supported browsers for the browser UI color.',
      type: 'string',
      group: 'seo',
      initialValue: '#040404',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Social Share Image',
      description: 'Used when a page does not provide its own image.',
      type: 'image',
      group: 'seo',
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
      name: 'favicon',
      title: 'Favicon',
      description: 'Upload a .ico, .png, or .svg favicon.',
      type: 'file',
      group: 'icons',
      options: {
        accept: '.ico,.png,.svg',
      },
    }),
    defineField({
      name: 'appleTouchIcon',
      title: 'Apple Touch Icon',
      description: 'Recommended size: 180x180 PNG.',
      type: 'image',
      group: 'icons',
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
  ],
  preview: {
    select: {
      title: 'siteName',
      subtitle: 'siteUrl',
      media: 'defaultOgImage',
    },
  },
})
