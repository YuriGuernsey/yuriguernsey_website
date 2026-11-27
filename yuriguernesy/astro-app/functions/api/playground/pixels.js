import { hash, json, kv, visitor } from "./_shared.js";

// Keep in sync with WALL_W / WALL_H in src/components/playground/api.ts
const W = 64;
const H = 20;
const COLOURS = 8; // palette indexes 1..8 (0 = empty)
const KEY = "wall:v1";

async function load(store) {
  const grid = await store.get(KEY);
  return { w: W, h: H, grid: grid && grid.length === W * H ? grid : "0".repeat(W * H) };
}

export async function onRequestGet({ env }) {
  const store = kv(env);
  if (!store) return json({ error: "playground storage not configured" }, 503);
  return json(await load(store));
}

export async function onRequestPost({ request, env }) {
  const store = kv(env);
  if (!store) return json({ error: "playground storage not configured" }, 503);
  const body = await request.json().catch(() => ({}));
  const x = Number(body.x);
  const y = Number(body.y);
  const c = Number(body.c);
  if (![x, y, c].every(Number.isInteger) || x < 0 || y < 0 || x >= W || y >= H || c < 1 || c > COLOURS) {
    return json({ error: "bad pixel" }, 400);
  }
  const day = new Date().toISOString().slice(0, 10);
  const dayKey = `px:${day}:${await hash(visitor(request))}`;
  if (await store.get(dayKey)) return json({ error: "one pixel per day" }, 429);
  await store.put(dayKey, "1", { expirationTtl: 60 * 60 * 26 });

  const wall = await load(store);
  const i = y * W + x;
  wall.grid = wall.grid.slice(0, i) + String(c) + wall.grid.slice(i + 1);
  await store.put(KEY, wall.grid);
  return json(wall);
}
