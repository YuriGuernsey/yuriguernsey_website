// Oscilloscope scroll indicator: a phosphor trace down the right edge that wiggles
// harder the faster you scroll, and flatlines when you stop.
import { read, write } from "./api";

export function initScope(root: HTMLElement) {
  const toggle = root.querySelector<HTMLInputElement>("[data-toggle='scope']");
  const wrap = document.createElement("div");
  wrap.className = "yg-scope yg-noinvert";
  wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML = `<canvas></canvas><span class="yg-scope__label">0.0 V/div</span>`;
  document.body.appendChild(wrap);
  const canvas = wrap.querySelector("canvas")!;
  const label = wrap.querySelector<HTMLElement>(".yg-scope__label")!;
  const ctx = canvas.getContext("2d")!;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let on = read<boolean>("yg.scope", true);
  const setOn = (v: boolean) => {
    on = v;
    wrap.hidden = !v;
    if (v) kick();
  };
  if (toggle) {
    toggle.checked = on;
    toggle.addEventListener("change", () => {
      write("yg.scope", toggle.checked);
      setOn(toggle.checked);
    });
  }

  let W = 0;
  let H = 0;
  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    kick();
  };

  let lastY = window.scrollY;
  let amp = 0;
  let phase = 0;
  let raf = 0;

  function draw() {
    raf = 0;
    if (!on || !W) return;
    const v = Math.abs(window.scrollY - lastY);
    lastY = window.scrollY;
    const target = Math.min(W * 0.42, v * 0.9);
    amp += (target - amp) * (target > amp ? 0.35 : 0.06);
    phase += 0.12 + amp * 0.015;

    ctx.clearRect(0, 0, W, H);
    // graticule
    ctx.strokeStyle = "rgba(57,255,136,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = 0; y < H; y += 40) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(W, y + 0.5);
    }
    ctx.moveTo(W / 2 + 0.5, 0);
    ctx.lineTo(W / 2 + 0.5, H);
    ctx.stroke();

    // trace
    ctx.strokeStyle = "#39ff88";
    ctx.shadowColor = "#39ff88";
    ctx.shadowBlur = 6;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    const freq = 0.045 + amp * 0.0012;
    for (let y = 0; y <= H; y += 2) {
      const noise = (Math.random() - 0.5) * (0.6 + amp * 0.05);
      const x = W / 2 + Math.sin(y * freq + phase) * amp + noise;
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // scroll position marker
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const my = (window.scrollY / max) * (H - 12) + 6;
    ctx.fillStyle = "#ffe600";
    ctx.beginPath();
    ctx.moveTo(0, my - 5);
    ctx.lineTo(7, my);
    ctx.lineTo(0, my + 5);
    ctx.fill();

    label.textContent = `${(amp / 10).toFixed(1)} V/div`;
    if (!reduce && (amp > 0.08 || v > 0)) raf = requestAnimationFrame(draw);
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(draw);
  }

  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", resize);
  setOn(on);
  resize();
}
