// Sticker catalogue. Every sticker is drawn as inline SVG with a white die-cut
// border so it reads like a vinyl laptop sticker. Nothing here is user text, so
// the shared board needs no moderation: visitors can only place these designs.

export type StickerShape = "rect" | "pill" | "circle" | "burst" | "terminal";

export interface StickerDef {
  id: string;
  label: string;
  lines: string[];
  shape: StickerShape;
  bg: string;
  fg: string;
  hidden?: boolean;
  /** How a hidden sticker is unlocked (shown once found). */
  hint?: string;
  holo?: boolean;
}

export const STICKERS: StickerDef[] = [
  { id: "legocia", label: "Legocia", lines: ["LEGOCIA"], shape: "rect", bg: "#0b0b0b", fg: "#ffe600" },
  { id: "glimber", label: "Glimber", lines: ["GLIMBER"], shape: "circle", bg: "#f4f4ef", fg: "#111111" },
  { id: "buffbuddy", label: "MyBuffBuddy", lines: ["MY BUFF", "BUDDY"], shape: "pill", bg: "#5b2bd6", fg: "#ffffff" },
  { id: "works", label: "Works on my machine", lines: ["WORKS ON", "MY MACHINE"], shape: "rect", bg: "#ffe600", fg: "#0b0b0b" },
  { id: "fridays", label: "Ships on Fridays", lines: ["SHIPS ON", "FRIDAYS"], shape: "burst", bg: "#ff4d2e", fg: "#ffffff" },
  { id: "tested", label: "Unhinged but tested", lines: ["UNHINGED", "BUT TESTED"], shape: "pill", bg: "#16a34a", fg: "#ffffff" },
  { id: "guernsey", label: "Built in Guernsey", lines: ["BUILT IN", "GUERNSEY"], shape: "circle", bg: "#d62828", fg: "#ffffff" },
  { id: "rmrf", label: "rm -rf doubts", lines: ["$ rm -rf doubts"], shape: "terminal", bg: "#0b0b0b", fg: "#39ff88" },
  { id: "todo", label: "TODO: sleep", lines: ["// TODO:", "sleep"], shape: "rect", bg: "#1e3a8a", fg: "#e0e7ff" },
  { id: "feature", label: "It's a feature", lines: ["IT'S A", "FEATURE"], shape: "burst", bg: "#f472b6", fg: "#0b0b0b" },

  // Hidden: unlocked through easter eggs.
  { id: "oneup", label: "1UP", lines: ["1UP"], shape: "circle", bg: "#22c55e", fg: "#ffffff", hidden: true, hint: "Konami code" },
  { id: "certified", label: "Certified unhinged", lines: ["CERTIFIED", "UNHINGED"], shape: "burst", bg: "#facc15", fg: "#0b0b0b", hidden: true, hint: "Typed the magic word" },
  { id: "bottom", label: "Bottom feeder", lines: ["BOTTOM", "FEEDER"], shape: "pill", bg: "#0ea5e9", fg: "#ffffff", hidden: true, hint: "Scrolled all the way down" },
  { id: "yeet", label: "Yeet", lines: ["YEET"], shape: "burst", bg: "#a855f7", fg: "#ffffff", hidden: true, hint: "Flicked a sticker off the page" },
  { id: "sparky", label: "Sparky", lines: ["SPARKY"], shape: "rect", bg: "#f97316", fg: "#0b0b0b", hidden: true, hint: "Flipped the lights 5 times" },
  { id: "gymbro", label: "Gym bro", lines: ["GYM", "BRO"], shape: "circle", bg: "#ef4444", fg: "#ffffff", hidden: true, hint: "Poked BuffBuddy 5 times" },
  { id: "completionist", label: "Completionist", lines: ["COMPLETIONIST"], shape: "pill", bg: "#111111", fg: "#ffffff", hidden: true, holo: true, hint: "Found every hidden sticker" },
];

export const HIDDEN_IDS = STICKERS.filter((s) => s.hidden && s.id !== "completionist").map((s) => s.id);

export function getSticker(id: string) {
  return STICKERS.find((s) => s.id === id);
}

function burstPath(cx: number, cy: number, outer: number, inner: number, points: number) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }
  return `${d}Z`;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function stickerSvg(def: StickerDef) {
  const longest = Math.max(...def.lines.map((l) => l.length));
  const square = def.shape === "circle" || def.shape === "burst";
  const w = square ? 120 : Math.max(110, Math.min(220, longest * 13 + 36));
  const h = square ? 120 : def.lines.length > 1 ? 74 : 54;
  const pad = 5;
  const gradId = `holo-${def.id}`;
  const fill = def.holo ? `url(#${gradId})` : def.bg;

  let shape = "";
  switch (def.shape) {
    case "circle":
      shape = `<circle cx="60" cy="60" r="${60 - pad}" />`;
      break;
    case "burst":
      shape = `<path d="${burstPath(60, 60, 60 - pad, 46, 14)}" />`;
      break;
    case "pill":
      shape = `<rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="${(h - pad * 2) / 2}" />`;
      break;
    default:
      shape = `<rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="${def.shape === "terminal" ? 6 : 10}" />`;
  }

  const fontSize = square
    ? Math.min(22, 150 / Math.max(longest, 4))
    : def.shape === "terminal"
      ? 15
      : 17;
  const lineH = fontSize * 1.08;
  const startY = h / 2 - ((def.lines.length - 1) * lineH) / 2 + fontSize * 0.36;
  const family = def.shape === "terminal" ? "ui-monospace, Menlo, monospace" : "'Space Grotesk', system-ui, sans-serif";
  const text = def.lines
    .map(
      (line, i) =>
        `<text x="${w / 2}" y="${(startY + i * lineH).toFixed(1)}" text-anchor="middle" font-family="${family}" font-weight="700" font-size="${fontSize.toFixed(1)}" letter-spacing="0.5" fill="${def.fg}">${esc(line)}</text>`
    )
    .join("");

  const dots =
    def.shape === "terminal"
      ? `<circle cx="16" cy="14" r="2.4" fill="#ff5f57"/><circle cx="24" cy="14" r="2.4" fill="#febc2e"/><circle cx="32" cy="14" r="2.4" fill="#28c840"/>`
      : "";

  const defs = def.holo
    ? `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6ad5"/><stop offset="0.33" stop-color="#c774e8"/><stop offset="0.66" stop-color="#8795e8"/><stop offset="1" stop-color="#94d0ff"/></linearGradient></defs>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(def.label)} sticker">${defs}<g fill="#ffffff" stroke="#ffffff" stroke-width="${pad * 2}" stroke-linejoin="round">${shape}</g><g fill="${fill}">${shape}</g>${dots}${text}</svg>`;
}
