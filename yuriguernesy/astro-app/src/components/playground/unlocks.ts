import { read, write } from "./api";
import { HIDDEN_IDS, getSticker } from "./stickers";

const KEY = "yg.unlocked";
const listeners = new Set<() => void>();

export function unlocked(): string[] {
  return read<string[]>(KEY, []);
}

export function isUnlocked(id: string) {
  return unlocked().includes(id);
}

export function onUnlock(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function toast(message: string, tone: "default" | "gold" = "default") {
  const host = document.querySelector<HTMLElement>(".yg-toasts");
  if (!host) return;
  const el = document.createElement("div");
  el.className = `yg-toast${tone === "gold" ? " yg-toast--gold" : ""}`;
  el.setAttribute("role", "status");
  el.textContent = message;
  host.appendChild(el);
  window.setTimeout(() => el.classList.add("is-out"), 3200);
  window.setTimeout(() => el.remove(), 3700);
}

export function unlock(id: string) {
  const list = unlocked();
  if (list.includes(id)) return;
  list.push(id);
  write(KEY, list);
  const def = getSticker(id);
  toast(`Hidden sticker found: ${def?.label ?? id}! Check your sticker sheet.`, "gold");

  if (id !== "completionist" && HIDDEN_IDS.every((h) => list.includes(h))) {
    window.setTimeout(() => unlock("completionist"), 900);
  }
  listeners.forEach((fn) => fn());
}
