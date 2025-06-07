import blockContent from './objects/blockContent'
import post from './documents/post'
import project from './documents/projects'
import home from './documents/home'
import experience from './documents/experience'
import settings from './documents/settings'
// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [project,post, blockContent, home, experience, settings]
