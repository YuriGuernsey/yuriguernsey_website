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
    groq`*[_type == "home"][0]`
  );
}



export async function getSettings(): Promise<Settings[]> {
  return await sanityClient.fetch(
    groq`*[_type == "settings"`
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
  heroTitle?: string;
  heroSubtitle?: string;
  herosubheading?: string;
  heroparagraph?: string;
  seoTitle?: string;
  availableForFreelance?: boolean;
  lookingForWork?: boolean;
  cv?:string;
  moreAboutMe: PortableTextBlock[];
  moreAboutMeHighlights: PortableTextBlock[];
  moreAboutMeLifeMission: PortableTextBlock[];
}

export interface Settings {
  _type: "settings";
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  mainImage?: ImageAsset & { alt?: string };
  body: PortableTextBlock[];
}


export interface Post {
  _type: "post";
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  discription?: string;
  mainImage?: ImageAsset & { alt?: string };
  body: PortableTextBlock[];
}

export interface Job {
  _type: "experience";
  _id: string;
  _createdAt: string;
  body: PortableTextBlock[];
  company: string;
  currentlyEmployed: string;
  employmentType?: string;
  endDate: string;
  location: string;
  title: string;
  startDate: string;
}

