import { isRemote, loadWall, placePixel, placedToday, type PixelWall } from "./api";
import { toast } from "./unlocks";

export const PALETTE = ["#141414", "#f4f4ef", "#ffe600", "#ff4d2e", "#22c55e", "#0ea5e9", "#a855f7", "#f472b6", "#f97316"];
const CELL = 12;

function untilMidnightUtc() {
  const now = new Date();
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  const mins = Math.max(1, Math.round((next - now.getTime()) / 60000));
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function initPixelWall() {
  const root = document.querySelector<HTMLElement>(".yg-wall");
  if (!root || root.dataset.ready) return;
  root.dataset.ready = "1";
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const status = root.querySelector<HTMLElement>(".yg-wall__status")!;
  const swatches = root.querySelector<HTMLElement>(".yg-wall__palette")!;
  const ctx = canvas.getContext("2d")!;

  let wall: PixelWall | null = null;
  let colour = 2;
  let hover: { x: number; y: number } | null = null;

  PALETTE.slice(1).forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "yg-wall__swatch";
    b.style.background = c;
    b.setAttribute("aria-label", `Colour ${i + 1}`);
    b.setAttribute("aria-pressed", String(i + 1 === colour));
    b.addEventListener("click", () => {
      colour = i + 1;
      swatches.querySelectorAll("button").forEach((s, j) => s.setAttribute("aria-pressed", String(j + 1 === colour)));
      draw();
    });
    swatches.appendChild(b);
  });

  function setStatus() {
    if (!wall) return;
    const filled = [...wall.grid].filter((c) => c !== "0").length;
    const placed = `${filled} ${filled === 1 ? "pixel" : "pixels"} placed so far`;
    const shared = isRemote() ? "" : " (local mode: only you can see this wall)";
    status.textContent = placedToday()
      ? `Thanks for leaving your mark. Next pixel in ${untilMidnightUtc()}. ${placed}${shared}.`
      : `Pick a colour and click a square. One pixel per visitor per day. ${placed}${shared}.`;
  }

  function draw() {
    if (!wall) return;
    canvas.width = wall.w * CELL;
    canvas.height = wall.h * CELL;
    ctx.fillStyle = "#070707";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < wall.h; y++) {
      for (let x = 0; x < wall.w; x++) {
        const idx = Number(wall.grid[y * wall.w + x]) || 0;
        ctx.fillStyle = PALETTE[idx] ?? PALETTE[0];
        ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
      }
    }
    if (hover && !placedToday()) {
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = PALETTE[colour];
      ctx.fillRect(hover.x * CELL + 1, hover.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(hover.x * CELL + 0.5, hover.y * CELL + 0.5, CELL - 1, CELL - 1);
    }
  }

  function cellAt(e: PointerEvent) {
    if (!wall) return null;
    const r = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * wall.w);
    const y = Math.floor(((e.clientY - r.top) / r.height) * wall.h);
    return x >= 0 && y >= 0 && x < wall.w && y < wall.h ? { x, y } : null;
  }

  canvas.addEventListener("pointermove", (e) => {
    hover = cellAt(e);
    draw();
  });
  canvas.addEventListener("pointerleave", () => {
    hover = null;
    draw();
  });
  canvas.addEventListener("click", async (e) => {
    const cell = cellAt(e as PointerEvent);
    if (!cell || !wall) return;
    if (placedToday()) {
      toast(`You've placed today's pixel. Next one in ${untilMidnightUtc()}.`);
      return;
    }
    try {
      wall = await placePixel(cell.x, cell.y, colour);
      hover = null;
      draw();
      setStatus();
      toast("Pixel placed. You're part of the wall now.");
    } catch (err) {
      const status = (err as { status?: number }).status;
      toast(status === 429 ? "You've already placed a pixel today." : "Couldn't place that pixel. Try again.");
    }
  });

  loadWall().then((w) => {
    wall = w;
    draw();
    setStatus();
  });
}
