// Shared state for the sticker board and pixel wall.
// Talks to the Cloudflare Pages Functions in /functions/api/playground. If those
// aren't deployed (or the KV binding is missing) everything falls back to
// localStorage, so the toys still work, just privately per visitor.

export interface PlacedSticker {
  id: string;
  t: string; // sticker type id
  x: number; // 0..1 of page width
  y: number; // px from top of document
  r: number; // rotation in degrees
  token?: string; // only present on stickers this visitor placed
}

export interface PixelWall {
  w: number;
  h: number;
  grid: string; // one palette index char per pixel, row-major
}

export const WALL_W = 64;
export const WALL_H = 20;

const BASE = "/api/playground";
const LS = {
  stickers: "yg.stickers",
  mine: "yg.stickers.mine",
  wall: "yg.wall",
  pixelDay: "yg.wall.day",
};

let remote: boolean | null = null;

export function isRemote() {
  return remote === true;
}

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: fine, state just won't persist */
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function mine(): Record<string, string> {
  return read<Record<string, string>>(LS.mine, {});
}

async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (remote === false) return null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...(init?.headers || {}) },
    });
    const type = res.headers.get("content-type") || "";
    if (!type.includes("application/json")) {
      remote = false; // static host served HTML / 404 page: no API here
      return null;
    }
    const body = (await res.json()) as T & { error?: string };
    if (res.status === 503) {
      remote = false;
      return null;
    }
    remote = true;
    if (!res.ok) throw Object.assign(new Error(body.error || `HTTP ${res.status}`), { status: res.status });
    return body;
  } catch (err) {
    if ((err as { status?: number }).status) throw err;
    remote = false;
    return null;
  }
}

// ---------- stickers ----------

export async function loadStickers(): Promise<PlacedSticker[]> {
  const ownTokens = mine();
  const res = await call<{ stickers: PlacedSticker[] }>("/stickers");
  const list = res ? res.stickers : read<PlacedSticker[]>(LS.stickers, []);
  return list.map((s) => (ownTokens[s.id] ? { ...s, token: ownTokens[s.id] } : s));
}

export async function addSticker(s: Omit<PlacedSticker, "id" | "token">): Promise<PlacedSticker> {
  const res = await call<{ id: string; token: string }>("/stickers", { method: "POST", body: JSON.stringify(s) });
  const placed: PlacedSticker = res ? { ...s, ...res } : { ...s, id: uid(), token: uid() };
  write(LS.mine, { ...mine(), [placed.id]: placed.token });
  if (!res) write(LS.stickers, [...read<PlacedSticker[]>(LS.stickers, []), { ...placed, token: undefined }].slice(-150));
  return placed;
}

export async function moveSticker(s: PlacedSticker) {
  if (!s.token) return;
  const res = await call("/stickers", { method: "PUT", body: JSON.stringify(s) });
  if (!res) {
    write(
      LS.stickers,
      read<PlacedSticker[]>(LS.stickers, []).map((x) => (x.id === s.id ? { ...x, x: s.x, y: s.y, r: s.r } : x))
    );
  }
}

export async function removeSticker(s: PlacedSticker) {
  if (!s.token) return;
  const res = await call(`/stickers?id=${encodeURIComponent(s.id)}&token=${encodeURIComponent(s.token)}`, {
    method: "DELETE",
  });
  if (!res) write(LS.stickers, read<PlacedSticker[]>(LS.stickers, []).filter((x) => x.id !== s.id));
  const own = mine();
  delete own[s.id];
  write(LS.mine, own);
}

// ---------- pixel wall ----------

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function emptyWall(): PixelWall {
  return { w: WALL_W, h: WALL_H, grid: "0".repeat(WALL_W * WALL_H) };
}

export async function loadWall(): Promise<PixelWall> {
  const res = await call<PixelWall>("/pixels");
  return res || read<PixelWall>(LS.wall, emptyWall());
}

export function placedToday() {
  return read<string>(LS.pixelDay, "") === today();
}

export async function placePixel(x: number, y: number, c: number): Promise<PixelWall> {
  const res = await call<PixelWall>("/pixels", { method: "POST", body: JSON.stringify({ x, y, c }) });
  write(LS.pixelDay, today());
  if (res) return res;
  const wall = read<PixelWall>(LS.wall, emptyWall());
  const i = y * wall.w + x;
  wall.grid = wall.grid.slice(0, i) + String(c) + wall.grid.slice(i + 1);
  write(LS.wall, wall);
  return wall;
}
