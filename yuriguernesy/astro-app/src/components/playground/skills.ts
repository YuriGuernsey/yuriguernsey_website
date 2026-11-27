// Breadboard skills. Edit freely: kind sets the component look, led its colour.
export type PartKind = "ic" | "module" | "hw";

export interface Skill {
  name: string;
  short: string; // printed on the component (keep it to ~10 chars)
  kind: PartKind;
  led: string;
  group: string;
  used: string;
}

export const SKILLS: Skill[] = [
  { name: "Laravel & PHP", short: "LARAVEL", kind: "ic", led: "#ff4d2e", group: "Backend", used: "Web apps and APIs at Bugbird; a 15-year-old internal system at Specsavers" },
  { name: "Vue.js", short: "VUE", kind: "ic", led: "#22c55e", group: "Frontend", used: "Bugbird and BermudAir front ends; sites at Submarine" },
  { name: "Flutter", short: "FLUTTER", kind: "ic", led: "#0ea5e9", group: "Mobile", used: "Apps since Submarine: jukebox, couples rewards, maths learning" },
  { name: "Swift & SwiftUI", short: "SWIFT", kind: "ic", led: "#f97316", group: "Mobile", used: "MyBuffBuddy iOS app; a Sonos menu bar app for macOS" },
  { name: "Astro", short: "ASTRO", kind: "ic", led: "#a855f7", group: "Frontend", used: "This site, Aevea client sites, Legocia Archive" },
  { name: "React & Next.js", short: "REACT", kind: "ic", led: "#38bdf8", group: "Frontend", used: "Web apps, dashboards and React Native apps" },
  { name: "Node.js & Hono", short: "HONO", kind: "ic", led: "#facc15", group: "Backend", used: "Service stacks on Hono, Drizzle and Cloudflare D1" },
  { name: "Python", short: "PYTHON", kind: "ic", led: "#3b82f6", group: "Backend", used: "Databricks reporting at Specsavers; automation jobs at Jumpman Gaming" },
  { name: "Cloudflare Workers & D1", short: "CF WORKERS", kind: "module", led: "#f97316", group: "Platform", used: "Serverless APIs at Bugbird; Legocia and Men's Shed Guernsey sites" },
  { name: "PostgreSQL & Supabase", short: "POSTGRES", kind: "module", led: "#60a5fa", group: "Data", used: "Databases behind SaaS builds like ClientCubby and BrokerKit" },
  { name: "Docker & Coolify", short: "DOCKER", kind: "module", led: "#38bdf8", group: "Platform", used: "Self-hosted deploys on VPSs with Traefik" },
  { name: "n8n, Make & Zapier", short: "N8N", kind: "module", led: "#ec4899", group: "Automation", used: "Self-hosted n8n automations for Legocia and clients" },
  { name: "OpenAI APIs & agents", short: "LLM", kind: "module", led: "#ffffff", group: "AI", used: "LLM-powered automations, assistants and workflows" },
  { name: "Godot", short: "GODOT", kind: "module", led: "#478cbf", group: "Games", used: "Deckbound, a roguelike card crawler, and Life Sim" },
  { name: "Raspberry Pi", short: "RPI", kind: "hw", led: "#ef4444", group: "Hardware", used: "Grab-and-go smart fridge: 3 cameras and card-tap unlock" },
  { name: "Arduino", short: "ARDUINO", kind: "hw", led: "#14b8a6", group: "Hardware", used: "Hardware prototypes and experiments" },
  { name: "PCB design", short: "PCB", kind: "hw", led: "#22c55e", group: "Hardware", used: "A USB Wi-Fi RGB board; the MyBuffBuddy wearable" },
];
