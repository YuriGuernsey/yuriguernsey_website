// Helpers shared by the playground Pages Functions.
// Needs a KV namespace bound to this Pages project as `PLAYGROUND`.
// Without it every endpoint answers 503 and the site falls back to local mode.

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export function kv(env) {
  return env && env.PLAYGROUND ? env.PLAYGROUND : null;
}

export function visitor(request) {
  return request.headers.get("cf-connecting-ip") || "anon";
}

export async function hash(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Fixed-window rate limit. Returns true when the caller is over the limit. */
export async function limited(store, key, max, windowSeconds) {
  const count = Number((await store.get(key)) || 0);
  if (count >= max) return true;
  await store.put(key, String(count + 1), { expirationTtl: Math.max(60, windowSeconds) });
  return false;
}

export function randomId() {
  const bytes = crypto.getRandomValues(new Uint8Array(9));
  return [...bytes].map((b) => b.toString(36).padStart(2, "0")).join("").slice(0, 14);
}
