import {defineField, defineType} from 'sanity'
import {CogIcon, HomeIcon, LinkIcon, ControlsIcon} from '@sanity/icons'

const paragraph = (text: string) => ({
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', text, marks: []}],
})

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  initialValue: {
    title: 'Home',
    brandPrefix: 'Yuri',
    brandAccent: 'Guernsey',
    brandMeta: 'Portfolio / 2026',
    heroEyebrow: 'Guernsey based / working worldwide',
    heroTitle: 'I build real systems in days, not months.',
    herosubheading:
      'Mobile apps, automation systems, AI workflows, and experiments that actually ship. Based in Guernsey. Built for real problems, not pitch decks.',
    heroPrimaryAction: {
      label: 'Featured work',
      href: '#projects',
      variant: 'primary',
    },
    heroSecondaryAction: {
      label: 'Operating manual',
      href: '#about',
      variant: 'secondary',
    },
    heroSubtitle: 'Founder / Product builder',
    heroparagraph:
      'Legocia, Aevea, and a rotating backlog of useful experiments. Shipping across software, automation, and hardware.',
    focusTags: ['Flutter', 'AI agents', 'Automation', 'Hardware', 'Local SaaS'],
    moreAboutMeLifeMission: [
      paragraph(
        'Build tools that help people, automate the boring parts, and leave better systems behind so the next builder does not have to start from scratch.',
      ),
    ],
    projectsSection: {
      overline: 'Current bets',
      title: 'Featured projects',
      description:
        'Three active directions: a privacy-first wearable, an automation-first agency model, and a stream of practical software experiments.',
    },
    featuredProjectCards: [
      {
        posterLabel: 'Legocia',
        ribbonTags: ['Privacy first', 'Wearable', 'Always on'],
        posterSummary:
          'Continuous life capture, sensitive-content redaction, and secure personal memory recall.',
        title: 'Legocia',
        description:
          'A long-term product bet on remembering more without turning life into surveillance.',
        tags: ['AI redaction', 'Raspberry Pi', 'Secure storage'],
        href: '#work',
      },
      {
        posterLabel: 'Agency OS',
        ribbonTags: ['Automation first', 'Ops', 'Delivery'],
        posterSummary:
          'AI agents handling sales, onboarding, support, and service delivery until a human decision actually matters.',
        title: 'Aevea operating model',
        description:
          'An agency system designed for operational leverage instead of more manual overhead.',
        tags: ['n8n', 'Lead automation', 'Productised services'],
        href: '#work',
      },
      {
        posterLabel: 'Useful builds',
        ribbonTags: ['Local SaaS', 'Utility', 'Experiments'],
        posterSummary:
          'Boring-but-useful software, Guernsey-focused tools, and slightly unhinged side projects with a point.',
        title: 'Useful experiments',
        description:
          'From OnTheTinkle to GympleBuddy to scheduling assistants, the point is always the same: ship fast and learn from reality.',
        tags: ['OnTheTinkle', 'GympleBuddy', 'Scheduling agents'],
        href: '#notes',
      },
    ],
    workSection: {
      overline: 'Selected roles',
      title: 'Work',
      description:
        'Startups, enterprise systems, and founder mode. Different environments, same delivery bias.',
    },
    notesSection: {
      overline: 'Process',
      title: 'Build logs, experiments & rants',
      description:
        'No fluff. Just the process, the systems, the failures, and the ideas worth testing properly.',
    },
    noteCards: [
      {
        meta: 'Wearable systems / 2026',
        title: 'How do you capture more of life without building surveillance?',
        description:
          'The Legocia problem space: memory, privacy, redaction, and the reality of always-on devices.',
        linkLabel: 'Read the project',
        href: '#projects',
      },
      {
        meta: 'Agency ops / 2026',
        title: 'Can an agency run mostly on agents?',
        description:
          'Sales, onboarding, support, and delivery workflows pushed toward automation without losing judgment.',
        linkLabel: 'Read the work',
        href: '#work',
      },
      {
        meta: 'Local software / 2026',
        title: 'Why boring Guernsey utilities are worth building',
        description:
          'Small local problems are still real problems, and often easier to validate than shiny global ideas.',
        linkLabel: 'Read the thinking',
        href: '#about',
      },
      {
        meta: 'Experiments / ongoing',
        title: 'Useful, weird, or slightly unhinged. Preferably all three.',
        description:
          'OnTheTinkle, GympleBuddy, scheduling assistants, subscription concepts, and whatever survives contact with users.',
        linkLabel: 'Read the current mode',
        href: '#connect',
      },
    ],
    aboutSection: {
      overline: 'Long form',
      title: 'You want to know more? OK.',
      description: 'The broad picture, the working style, and the systems behind the shipping bias.',
    },
    moreAboutMe: [
      paragraph(
        'I am a Guernsey-based builder working across software, automation, and experimental hardware. I prefer shipping over over-engineering, momentum over ceremony, and real-world testing over theory.',
      ),
      paragraph(
        'The work ranges from mobile apps and internal systems to AI workflows and edge-device experiments, but the principle is consistent: build something useful, keep it understandable, and automate anything repetitive.',
      ),
    ],
    aboutPanels: [
      {
        label: 'Core identity',
        body: [paragraph('Builder first. Product thinker second. Comfortable moving between code, operations, hardware, and business constraints.')],
      },
      {
        label: 'Working style',
        body: [paragraph('MVP-first, fast iteration, real-world testing, and a low tolerance for complexity that does not earn its keep.')],
      },
    ],
    manualGroups: [
      {
        label: 'Languages & frameworks',
        items: [
          'Flutter, React, React Native, Astro, Next.js, Tailwind',
          'Node.js, Python, PHP',
          'PostgreSQL, Supabase, Drizzle, Prisma',
        ],
      },
      {
        label: 'Tools & platforms',
        items: [
          'Docker, VPS hosting, Traefik, Coolify',
          'Cloudflare Workers and CI/CD pipelines',
          'Workflow tooling across n8n, Zapier, and Make',
        ],
      },
      {
        label: 'AI & automation',
        items: [
          'OpenAI APIs and custom assistants',
          'Prompt engineering and workflow orchestration',
          'Ops automation for sales, onboarding, support, and delivery',
        ],
      },
      {
        label: 'Hardware & experimental',
        items: [
          'Raspberry Pi and Arduino builds',
          'Real-time video processing and AI redaction pipelines',
          'Products that need more than a browser and a database',
        ],
      },
      {
        label: 'Builder rules',
        items: [
          'Ship fast, iterate faster',
          'Build real things, not just ideas',
          'Prefer simple systems over clever ones',
        ],
      },
      {
        label: 'Interesting bits',
        items: [
          'Founder of Legocia, a privacy-first wearable memory product',
          'Building an automation-heavy agency operating model',
          'Comfortable moving between product, code, systems, and hardware',
        ],
      },
    ],
    connectSection: {
      overline: 'Elsewhere',
      title: "Let's connect",
      description: 'Got an idea? A project? A weird challenge? Use this section for contact points, profiles, and the next obvious click.',
    },
    connectPrimaryAction: {
      label: 'Featured work',
      href: '#projects',
      variant: 'primary',
    },
    connectSecondaryAction: {
      label: 'View all posts',
      href: '/post',
      variant: 'secondary',
    },
    connectCards: [
      {
        label: 'Platform',
        title: 'GitHub',
        description: 'github.com/YuriGuernsey',
        href: 'https://github.com/YuriGuernsey',
      },
      {
        label: 'Profile',
        title: 'LinkedIn',
        description: 'Add your LinkedIn URL in Studio',
      },
      {
        label: 'Asset',
        title: 'Resume',
        description: 'Upload your CV in Home settings to make this live',
      },
      {
        label: 'Updates',
        title: 'Build logs',
        description: 'Posts, experiments, and process notes',
        href: '/post',
      },
    ],
  },
  groups: [
    {
      name: 'brand',
      title: 'Brand',
      icon: HomeIcon,
      default: true,
    },
    {
      name: 'hero',
      title: 'Hero',
      icon: ControlsIcon,
    },
    {
      name: 'sections',
      title: 'Sections',
      icon: LinkIcon,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: CogIcon,
    },
    {
      name: 'settings',
      title: 'Settings',
      icon: CogIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      hidden: true,
      initialValue: 'Home',
    }),
    defineField({
      name: 'brandPrefix',
      title: 'Brand Prefix',
      type: 'string',
      group: 'brand',
      initialValue: 'Yuri',
    }),
    defineField({
      name: 'brandAccent',
      title: 'Brand Accent',
      type: 'string',
      group: 'brand',
      initialValue: 'Guernsey',
    }),
    defineField({
      name: 'brandMeta',
      title: 'Brand Meta',
      type: 'string',
      group: 'brand',
      initialValue: 'Portfolio / 2026',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
      initialValue: 'Guernsey based / working worldwide',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue: 'I build real systems in days, not months.',
    }),
    defineField({
      name: 'herosubheading',
      title: 'Hero Summary',
      type: 'text',
      rows: 4,
      group: 'hero',
      initialValue:
        'Mobile apps, automation systems, AI workflows, and experiments that actually ship. Based in Guernsey. Built for real problems, not pitch decks.',
    }),
    defineField({
      name: 'heroPrimaryAction',
      title: 'Hero Primary Action',
      type: 'actionLink',
      group: 'hero',
      initialValue: {
        label: 'Featured work',
        href: '#projects',
        variant: 'primary',
      },
    }),
    defineField({
      name: 'heroSecondaryAction',
      title: 'Hero Secondary Action',
      type: 'actionLink',
      group: 'hero',
      initialValue: {
        label: 'Operating manual',
        href: '#about',
        variant: 'secondary',
      },
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Current Title',
      type: 'string',
      group: 'hero',
      initialValue: 'Founder / Product builder',
    }),
    defineField({
      name: 'heroparagraph',
      title: 'Current Description',
      type: 'text',
      rows: 4,
      group: 'hero',
      initialValue:
        'Legocia, Aevea, and a rotating backlog of useful experiments. Shipping across software, automation, and hardware.',
    }),
    defineField({
      name: 'focusTags',
      title: 'Focus Tags',
      type: 'array',
      of: [{type: 'string'}],
      group: 'hero',
      initialValue: ['Flutter', 'AI agents', 'Automation', 'Hardware', 'Local SaaS'],
    }),
    defineField({
      name: 'moreAboutMeLifeMission',
      title: 'Life Mission',
      type: 'blockContent',
      group: 'hero',
    }),
    defineField({
      name: 'projectsSection',
      title: 'Projects Section Intro',
      type: 'sectionIntro',
      group: 'sections',
      initialValue: {
        overline: 'Current bets',
        title: 'Featured projects',
        description:
          'Three active directions: a privacy-first wearable, an automation-first agency model, and a stream of practical software experiments.',
      },
    }),
    defineField({
      name: 'featuredProjectCards',
      title: 'Featured Project Cards',
      type: 'array',
      of: [{type: 'featureCard'}],
      group: 'sections',
    }),
    defineField({
      name: 'workSection',
      title: 'Work Section Intro',
      type: 'sectionIntro',
      group: 'sections',
      initialValue: {
        overline: 'Selected roles',
        title: 'Work',
        description: 'Startups, enterprise systems, and founder mode. Different environments, same delivery bias.',
      },
    }),
    defineField({
      name: 'notesSection',
      title: 'Notes Section Intro',
      type: 'sectionIntro',
      group: 'sections',
      initialValue: {
        overline: 'Process',
        title: 'Build logs, experiments & rants',
        description: 'No fluff. Just the process, the systems, the failures, and the ideas worth testing properly.',
      },
    }),
    defineField({
      name: 'noteCards',
      title: 'Homepage Note Cards',
      type: 'array',
      of: [{type: 'noteCard'}],
      group: 'sections',
    }),
    defineField({
      name: 'aboutSection',
      title: 'About Section Intro',
      type: 'sectionIntro',
      group: 'sections',
      initialValue: {
        overline: 'Long form',
        title: 'You want to know more? OK.',
        description: 'The broad picture, the working style, and the systems behind the shipping bias.',
      },
    }),
    defineField({
      name: 'moreAboutMe',
      title: 'About Copy',
      type: 'blockContent',
      group: 'sections',
    }),
    defineField({
      name: 'aboutPanels',
      title: 'About Side Panels',
      type: 'array',
      of: [{type: 'textPanel'}],
      group: 'sections',
    }),
    defineField({
      name: 'manualGroups',
      title: 'Manual Groups',
      type: 'array',
      of: [{type: 'manualGroup'}],
      group: 'sections',
    }),
    defineField({
      name: 'connectSection',
      title: 'Connect Section Intro',
      type: 'sectionIntro',
      group: 'sections',
      initialValue: {
        overline: 'Elsewhere',
        title: "Let's connect",
        description:
          'Got an idea? A project? A weird challenge? Use this section for contact points, profiles, and the next obvious click.',
      },
    }),
    defineField({
      name: 'connectPrimaryAction',
      title: 'Connect Primary Action',
      type: 'actionLink',
      group: 'sections',
      initialValue: {
        label: 'Featured work',
        href: '#projects',
        variant: 'primary',
      },
    }),
    defineField({
      name: 'connectSecondaryAction',
      title: 'Connect Secondary Action',
      type: 'actionLink',
      group: 'sections',
      initialValue: {
        label: 'View all posts',
        href: '/post',
        variant: 'secondary',
      },
    }),
    defineField({
      name: 'connectCards',
      title: 'Connect Cards',
      type: 'array',
      of: [{type: 'connectCard'}],
      group: 'sections',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'text',
      group: 'seo',
    }),
    defineField({
      name: 'availableForFreelance',
      title: 'Open For Freelance Work',
      type: 'boolean',
      group: 'settings',
    }),
    defineField({
      name: 'lookingForWork',
      title: 'Open for Work',
      type: 'boolean',
      group: 'settings',
    }),
    defineField({
      name: 'cv',
      title: 'CV',
      type: 'file',
      group: 'settings',
    }),
  ],
})
