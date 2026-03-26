import blockContent from './objects/blockContent'
import actionLink from './objects/actionLink'
import sectionIntro from './objects/sectionIntro'
import featureCard from './objects/featureCard'
import noteCard from './objects/noteCard'
import manualGroup from './objects/manualGroup'
import connectCard from './objects/connectCard'
import textPanel from './objects/textPanel'
import post from './documents/post'
import project from './documents/projects'
import home from './documents/home'
import experience from './documents/experience'
import settings from './documents/settings'
// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  project,
  post,
  blockContent,
  actionLink,
  sectionIntro,
  featureCard,
  noteCard,
  manualGroup,
  connectCard,
  textPanel,
  home,
  experience,
  settings,
]
