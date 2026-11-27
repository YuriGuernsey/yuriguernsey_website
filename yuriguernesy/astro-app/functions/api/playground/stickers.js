import { hash, json, kv, limited, randomId, visitor } from "./_shared.js";

// Keep in sync with src/components/playground/stickers.ts
const TYPES = new Set([
  "legocia", "glimber", "buffbuddy", "works", "fridays", "tested", "guernsey", "rmrf", "todo", "feature",
  "oneup", "certified", "bottom", "yeet", "sparky", "gymbro", "completionist",
]);
const KEY = "stickers:v1";
const MAX = 150;

async function load(store) {
  return (await store.get(KEY, "json")) || [];
}

function clean(body) {
  const x = Number(body.x);
  const y = Number(body.y);
  const r = Number(body.r);
  if (!TYPES.has(body.t)) return null;
  if (!Number.isFinite(x) || x < 0 || x > 1) return null;
  if (!Number.isFinite(y) || y < 0 || y > 50000) return null;
  return { t: body.t, x: Math.round(x * 10000) / 10000, y: Math.round(y), r: Number.isFinite(r) ? Math.max(-180, Math.min(180, Math.round(r))) : 0 };
}

const publicView = (list) => list.map(({ tokenHash, ...s }) => s);

export async function onRequestGet({ env }) {
  const store = kv(env);
  if (!store) return json({ error: "playground storage not configured" }, 503);
  return json({ stickers: publicView(await load(store)) });
}

export async function onRequestPost({ request, env }) {
  const store = kv(env);
  if (!store) return json({ error: "playground storage not configured" }, 503);
  if (await limited(store, `rl:stk:${await hash(visitor(request))}`, 20, 3600)) {
    return json({ error: "sticker limit reached" }, 429);
  }
  const data = clean(await request.json().catch(() => ({})));
  if (!data) return json({ error: "bad sticker" }, 400);
  const id = randomId();
  const token = randomId() + randomId();
  const list = await load(store);
  list.push({ id, ...data, tokenHash: await hash(token), ts: Date.now() });
  await store.put(KEY, JSON.stringify(list.slice(-MAX)));
  return json({ id, token });
}

export async function onRequestPut({ request, env }) {
  const store = kv(env);
  if (!store) return json({ error: "playground storage not configured" }, 503);
  const body = await request.json().catch(() => ({}));
  const data = clean(body);
  if (!data || !body.id || !body.token) return json({ error: "bad sticker" }, 400);
  const tokenHash = await hash(String(body.token));
  const list = await load(store);
  const item = list.find((s) => s.id === body.id && s.tokenHash === tokenHash);
  if (!item) return json({ error: "not your sticker" }, 403);
  Object.assign(item, { x: data.x, y: data.y, r: data.r });
  await store.put(KEY, JSON.stringify(list));
  return json({ ok: true });
}

export async function onRequestDelete({ request, env }) {
  const store = kv(env);
  if (!store) return json({ error: "playground storage not configured" }, 503);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const token = url.searchParams.get("token");
  if (!id || !token) return json({ error: "bad request" }, 400);
  const tokenHash = await hash(token);
  const list = await load(store);
  const next = list.filter((s) => !(s.id === id && s.tokenHash === tokenHash));
  if (next.length === list.length) return json({ error: "not your sticker" }, 403);
  await store.put(KEY, JSON.stringify(next));
  return json({ ok: true });
}
