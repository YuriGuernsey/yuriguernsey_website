import { loadEnv } from "vite";
import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import netlify from '@astrojs/netlify';

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
const projectId =
  env.PUBLIC_SANITY_STUDIO_PROJECT_ID ||
  env.PUBLIC_SANITY_PROJECT_ID ||
  "ek5zr1zv";
const dataset =
  env.PUBLIC_SANITY_STUDIO_DATASET ||
  env.PUBLIC_SANITY_DATASET ||
  "production";

// https://astro.build/config
export default defineConfig({
  // Hybrid+adapter is required to support embedded Sanity Studio
  output: "hybrid",
  adapter: netlify({
  imageCDN: false,
}),
  integrations: [
    sanity({
      projectId,
      dataset,
      // studioBasePath: "/admin",
      useCdn: false,
      // `false` if you want to ensure fresh data
      apiVersion: "2024-12-08", // Set to date of setup to use the latest API version
    }),
    react(), // Required for Sanity Studio
  ],
});
