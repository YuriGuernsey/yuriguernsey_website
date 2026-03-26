import { sanityClient } from "sanity:client";
import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

export async function getBlogPosts(): Promise<Post[]> {
  return await sanityClient.fetch(
    groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
  );
}

export async function getBlogPost(slug: string): Promise<Post> {
  return await sanityClient.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]`,
    {
      slug,
    }
  );
}


export async function getHomepage(): Promise<Home> {
  return await sanityClient.fetch(
    groq`*[_type == "home" && _id == "home"][0]{
      ...,
      "heroBackgroundVideoUrl": heroBackgroundVideo.asset->url
    }`
  );
}



export async function getSettings(): Promise<Settings | null> {
  return await sanityClient.fetch(
    groq`*[_type == "settings" && _id == "settings"][0]{
      ...,
      "faviconUrl": favicon.asset->url,
      "appleTouchIconUrl": appleTouchIcon.asset->url
    }`
  );
}


export async function getProjects(): Promise<Post[]> {
  return await sanityClient.fetch(
    groq`*[_type == "project" && defined(slug.current)] | order(_createdAt desc)`
  );
}

export async function getProject(slug: string): Promise<Post> {
  return await sanityClient.fetch(
    groq`*[_type == "project" && slug.current == $slug][0]`,
    {
      slug,
    }
  );
}

export async function getExperience(): Promise<Job[]> {
  return await sanityClient.fetch(
    groq`*[_type == "experience"] | order(startDate desc)`
  );
}




export interface Home {
  _type: "home";
  _createdAt: string;
  brandPrefix?: string;
  brandAccent?: string;
  brandMeta?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  herosubheading?: string;
  heroparagraph?: string;
  heroBackgroundVideoUrl?: string;
  heroOverlayColor?: string;
  heroOverlayOpacity?: number;
  seoTitle?: string;
  availableForFreelance?: boolean;
  lookingForWork?: boolean;
  cv?:string;
  heroPrimaryAction?: ActionLink;
  heroSecondaryAction?: ActionLink;
  focusTags?: string[];
  projectsSection?: SectionIntro;
  featuredProjectCards?: FeatureCard[];
  workSection?: SectionIntro;
  notesSection?: SectionIntro;
  noteCards?: NoteCard[];
  aboutSection?: SectionIntro;
  aboutPanels?: TextPanel[];
  manualGroups?: ManualGroup[];
  connectSection?: SectionIntro;
  connectPrimaryAction?: ActionLink;
  connectSecondaryAction?: ActionLink;
  connectCards?: ConnectCard[];
  moreAboutMe?: PortableTextBlock[];
  moreAboutMeLifeMission?: PortableTextBlock[];
}

export interface ActionLink {
  label?: string;
  href?: string;
  variant?: "primary" | "secondary";
}

export interface SectionIntro {
  overline?: string;
  title?: string;
  description?: string;
}

export interface FeatureCard {
  posterLabel?: string;
  ribbonTags?: string[];
  posterSummary?: string;
  title?: string;
  description?: string;
  tags?: string[];
  href?: string;
}

export interface NoteCard {
  meta?: string;
  title?: string;
  description?: string;
  linkLabel?: string;
  href?: string;
}

export interface ManualGroup {
  label?: string;
  items?: string[];
}

export interface ConnectCard {
  label?: string;
  title?: string;
  description?: string;
  href?: string;
}

export interface TextPanel {
  label?: string;
  body?: PortableTextBlock[];
}

export interface Settings {
  _type: "settings";
  _createdAt: string;
  title?: string;
  siteName?: string;
  siteUrl?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  twitterHandle?: string;
  themeColor?: string;
  defaultOgImage?: ImageAsset & { alt?: string };
  faviconUrl?: string;
  appleTouchIconUrl?: string;
}


export interface Post {
  _type: "post";
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  description?: string;
  mainImage?: ImageAsset & { alt?: string };
  body: PortableTextBlock[];
  tags?: string[];
}

export interface Job {
  _type: "experience";
  _id: string;
  _createdAt: string;
  body: PortableTextBlock[];
  company: string;
  currentlyEmployed: boolean;
  employmentType?: string;
  endDate: string;
  location: string;
  tags?: string[];
  title: string;
  startDate: string;
}
