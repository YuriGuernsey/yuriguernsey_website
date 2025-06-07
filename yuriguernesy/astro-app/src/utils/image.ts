import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "@sanity/types";
import { sanityClient } from "sanity:client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Image) {
  return builder.image(source);
}

export async function urlforFile(){
 const query = `*[_type == "home"][0]{ "cvUrl": cv.asset->url }`;

const homeData = await sanityClient.fetch(query);
const cvUrl = homeData?.cvUrl;
return cvUrl;
}
