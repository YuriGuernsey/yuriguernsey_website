import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/schemaTypes'
import { media } from 'sanity-plugin-media'
import { iconify } from 'sanity-plugin-iconify'
import { HomeIcon, CogIcon } from '@sanity/icons';
// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// Define allowed actions for singleton documents
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Define singleton document types
const singletonTypes = new Set(['home', 'settings'])

export default defineConfig({
  name: 'yuriguernsey',
  title: 'YuriGuernsey',
  projectId,
  dataset,
  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton document: Home
            S.listItem()
              .title('Home')
              .id('home')
               .icon(HomeIcon) 
              .child(
                S.document()
                  .schemaType('home')
                  .documentId('home')
              ),
            // Divider for clarity
            S.divider(),
            // Include all other document types except singleton types
            ...S.documentTypeListItems().filter(
              (listItem) => !singletonTypes.has(listItem.getId())
            ),
             S.divider(),
             S.listItem()
              .title('Settings')
              .id('settings')
              .icon(CogIcon) 
              .child(
                S.document()
                  .schemaType('settings')
                  .documentId('settings')
              ),
          ]),
    }),
    visionTool(),
    media(),
    iconify(),
  ],
  schema: {
    types: schemaTypes,
    // Filter out singleton types from the global “New document” menu options
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` set defined above
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => singletonActions.has(action))
        : input,
  },
})
