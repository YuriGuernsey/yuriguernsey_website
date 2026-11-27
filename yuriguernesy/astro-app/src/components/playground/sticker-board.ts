import { addSticker, isRemote, loadStickers, moveSticker, read, removeSticker, write, type PlacedSticker } from "./api";
import { STICKERS, getSticker, stickerSvg, HIDDEN_IDS } from "./stickers";
import { isUnlocked, onUnlock, toast, unlock, unlocked } from "./unlocks";
import { printReceipt } from "./printer";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const docWidth = () => document.documentElement.clientWidth;
const docHeight = () => document.documentElement.scrollHeight;
const normRot = (deg: number) => Math.round((((deg % 360) + 540) % 360) - 180);
const rotOf = (el: HTMLElement, fallback: number) => normRot(Number.parseFloat(el.style.getPropertyValue("--rot")) || fallback);

interface DragSample {
  x: number;
  y: number;
  t: number;
}

export function initStickerBoard(root: HTMLElement) {
  const layer = document.createElement("div");
  layer.className = "yg-sticker-layer yg-noinvert";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const sheet = root.querySelector<HTMLElement>(".yg-sheet")!;
  const grid = root.querySelector<HTMLElement>(".yg-sheet__grid")!;
  const count = root.querySelector<HTMLElement>(".yg-sheet__count")!;
  const mode = root.querySelector<HTMLElement>(".yg-sheet__mode")!;
  const toggleBtn = root.querySelector<HTMLButtonElement>(".yg-fab")!;
  const showToggle = root.querySelector<HTMLInputElement>("[data-toggle='stickers']")!;

  let placed: PlacedSticker[] = [];
  const els = new Map<string, HTMLElement>();

  // ---------- visibility ----------
  const visible = read<boolean>("yg.stickers.visible", true);
  showToggle.checked = visible;
  layer.hidden = !visible;
  showToggle.addEventListener("change", () => {
    layer.hidden = !showToggle.checked;
    write("yg.stickers.visible", showToggle.checked);
  });

  // ---------- sheet ----------
  const setOpen = (open: boolean) => {
    sheet.hidden = !open;
    toggleBtn.setAttribute("aria-expanded", String(open));
    root.classList.toggle("is-open", open);
  };
  toggleBtn.addEventListener("click", () => setOpen(sheet.hidden));
  root.querySelector(".yg-sheet__close")?.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sheet.hidden) setOpen(false);
  });

  function renderSheet() {
    grid.innerHTML = "";
    for (const def of STICKERS) {
      const locked = def.hidden && !isUnlocked(def.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `yg-sheet__item${locked ? " is-locked" : ""}${def.holo ? " is-holo" : ""}`;
      if (locked) {
        btn.disabled = true;
        btn.innerHTML = `<span class="yg-sheet__lock">?</span>`;
        btn.title = "Hidden sticker. Keep exploring.";
        btn.setAttribute("aria-label", "Locked hidden sticker");
      } else {
        btn.innerHTML = stickerSvg(def);
        btn.title = def.hidden ? `${def.label} (found: ${def.hint})` : `Drag ${def.label} onto the page`;
        btn.setAttribute("aria-label", `Place ${def.label} sticker`);
        btn.addEventListener("pointerdown", (e) => startFromSheet(e, def.id));
        btn.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            placeAt(def.id, window.scrollX + window.innerWidth * (0.2 + Math.random() * 0.6), window.scrollY + window.innerHeight * (0.25 + Math.random() * 0.5));
          }
        });
      }
      grid.appendChild(btn);
    }
    const found = unlocked().filter((id) => HIDDEN_IDS.includes(id)).length;
    count.textContent = `Hidden stickers found: ${found}/${HIDDEN_IDS.length}`;
  }
  renderSheet();
  onUnlock(renderSheet);

  // ---------- rendering placed stickers ----------
  function position(el: HTMLElement, s: PlacedSticker) {
    el.style.left = `${s.x * docWidth()}px`;
    el.style.top = `${s.y}px`;
    el.style.setProperty("--rot", `${s.r}deg`);
  }

  function renderOne(s: PlacedSticker) {
    const def = getSticker(s.t);
    if (!def) return;
    let el = els.get(s.id);
    if (!el) {
      el = document.createElement("div");
      el.className = `yg-sticker${def.holo ? " is-holo" : ""}${s.token ? " is-mine" : ""}`;
      el.innerHTML = stickerSvg(def);
      if (s.token) {
        el.title = "Your sticker: drag to move, flick it off the page to remove";
        const ref = s;
        el.addEventListener("pointerdown", (e) => startFromPlaced(e, ref));
      }
      layer.appendChild(el);
      els.set(s.id, el);
    }
    position(el, s);
  }

  function renderAll() {
    layer.style.height = `${docHeight()}px`;
    placed.forEach(renderOne);
  }

  window.addEventListener("resize", () => {
    layer.style.height = "0px";
    requestAnimationFrame(renderAll);
  });

  loadStickers()
    .then((list) => {
      placed = list;
      renderAll();
      mode.textContent = isRemote()
        ? "Stickers you place are visible to every visitor."
        : "Local mode: your stickers are saved in this browser only.";
    })
    .catch(() => {
      mode.textContent = "Couldn't load the sticker board right now.";
    });

  // ---------- dragging + physics ----------
  let samples: DragSample[] = [];

  function pickUp(el: HTMLElement) {
    el.classList.remove("is-landing");
    el.classList.add("is-held");
    document.body.classList.add("yg-dragging");
  }

  function land(el: HTMLElement) {
    el.classList.remove("is-held", "is-flying");
    document.body.classList.remove("yg-dragging");
    if (!reduceMotion()) {
      el.classList.add("is-landing");
      el.addEventListener("animationend", () => el.classList.remove("is-landing"), { once: true });
    }
  }

  function velocity() {
    const recent = samples.filter((s) => performance.now() - s.t < 90);
    if (recent.length < 2) return { vx: 0, vy: 0 };
    const a = recent[0];
    const b = recent[recent.length - 1];
    const dt = Math.max(1, b.t - a.t);
    const cap = (v: number) => Math.max(-4, Math.min(4, v));
    return { vx: cap((b.x - a.x) / dt), vy: cap((b.y - a.y) / dt) };
  }

  /** Coasts a released sticker with friction. Resolves with its resting page coords, or null if it flew off. */
  function fling(el: HTMLElement, x: number, y: number, vx: number, vy: number, canLeave: boolean): Promise<{ x: number; y: number } | null> {
    return new Promise((resolve) => {
      if (reduceMotion() || Math.hypot(vx, vy) < 1.8) return resolve({ x, y });
      el.classList.add("is-flying");
      let px = x;
      let py = y;
      let fx = vx * 16;
      let fy = vy * 16;
      let spin = Number.parseFloat(el.style.getPropertyValue("--rot")) || 0;
      const step = () => {
        px += fx;
        py += fy;
        fx *= 0.94;
        fy *= 0.94;
        spin += fx * 0.6;
        el.style.left = `${px}px`;
        el.style.top = `${py}px`;
        el.style.setProperty("--rot", `${spin}deg`);
        const off = px < -80 || px > docWidth() + 80 || py < window.scrollY - 160 || py > docHeight() + 80;
        if (off && canLeave) return resolve(null);
        if (!canLeave) {
          // fresh stickers bounce off the edges instead of being lost
          if (px < 40 || px > docWidth() - 40) {
            px = Math.max(40, Math.min(docWidth() - 40, px));
            fx *= -0.5;
          }
          if (py < 40 || py > docHeight() - 40) {
            py = Math.max(40, Math.min(docHeight() - 40, py));
            fy *= -0.5;
          }
        }
        if (Math.hypot(fx, fy) < 0.4) return resolve({ x: px, y: py });
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function overUi(clientX: number, clientY: number) {
    const hit = document.elementFromPoint(clientX, clientY);
    return !!hit?.closest(".yg-root");
  }

  function track(e: PointerEvent) {
    samples.push({ x: e.pageX, y: e.pageY, t: performance.now() });
    if (samples.length > 8) samples.shift();
  }

  function drag(el: HTMLElement, onRelease: (e: PointerEvent) => void) {
    const move = (e: PointerEvent) => {
      e.preventDefault();
      track(e);
      el.style.left = `${e.pageX}px`;
      el.style.top = `${e.pageY}px`;
    };
    const up = (e: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      onRelease(e);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  function startFromSheet(e: PointerEvent, type: string) {
    const def = getSticker(type);
    if (!def || e.button > 0) return;
    e.preventDefault();
    if (layer.hidden) {
      layer.hidden = false;
      showToggle.checked = true;
      write("yg.stickers.visible", true);
    }
    const r = Math.round(Math.random() * 24 - 12);
    const ghost = document.createElement("div");
    ghost.className = `yg-sticker is-mine${def.holo ? " is-holo" : ""}`;
    ghost.innerHTML = stickerSvg(def);
    ghost.style.setProperty("--rot", `${r}deg`);
    ghost.style.left = `${e.pageX}px`;
    ghost.style.top = `${e.pageY}px`;
    layer.style.height = `${docHeight()}px`;
    layer.appendChild(ghost);
    pickUp(ghost);
    samples = [];
    setOpen(false);

    drag(ghost, async (up) => {
      if (overUi(up.clientX, up.clientY)) {
        ghost.remove();
        document.body.classList.remove("yg-dragging");
        return;
      }
      // fresh stickers slap down exactly where they're dropped
      const rest = {
        x: Math.max(30, Math.min(docWidth() - 30, up.pageX)),
        y: Math.max(30, Math.min(docHeight() - 30, up.pageY)),
      };
      ghost.style.left = `${rest.x}px`;
      ghost.style.top = `${rest.y}px`;
      land(ghost);
      try {
        const s = await addSticker({ t: type, x: rest.x / docWidth(), y: Math.round(rest.y), r: rotOf(ghost, r) });
        ghost.remove();
        placed.push(s);
        renderOne(s);
        printReceipt("Sticker placed", [[`1x ${def.label}`, "£0.00"]], isRemote() ? "Everyone can see it now" : "Thanks for visiting");
      } catch (err) {
        ghost.remove();
        const status = (err as { status?: number }).status;
        toast(status === 429 ? "Easy, tiger. Sticker limit hit, try again in a bit." : "That sticker didn't stick. Try again.");
      }
    });
  }

  async function placeAt(type: string, x: number, y: number) {
    try {
      const s = await addSticker({ t: type, x: x / docWidth(), y: Math.round(y), r: Math.round(Math.random() * 24 - 12) });
      placed.push(s);
      renderOne(s);
      const el = els.get(s.id);
      if (el) land(el);
      printReceipt("Sticker placed", [[`1x ${getSticker(type)?.label ?? type}`, "£0.00"]]);
    } catch {
      toast("That sticker didn't stick. Try again.");
    }
  }

  function startFromPlaced(e: PointerEvent, s: PlacedSticker) {
    const el = els.get(s.id);
    if (!el || e.button > 0) return;
    e.preventDefault();
    samples = [];
    pickUp(el);
    drag(el, async (up) => {
      const { vx, vy } = velocity();
      const rest = await fling(el, up.pageX, up.pageY, vx, vy, true);
      if (!rest) {
        el.remove();
        els.delete(s.id);
        placed = placed.filter((p) => p.id !== s.id);
        document.body.classList.remove("yg-dragging");
        unlock("yeet");
        removeSticker(s).catch(() => undefined);
        return;
      }
      land(el);
      s.x = rest.x / docWidth();
      s.y = Math.round(rest.y);
      s.r = rotOf(el, s.r);
      moveSticker(s).catch(() => undefined);
    });
  }
}
