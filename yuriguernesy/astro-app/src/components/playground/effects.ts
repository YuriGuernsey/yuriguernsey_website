import { read, write } from "./api";
import { unlock } from "./unlocks";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- hero: pick-and-place headline ----------

export function initHeroBuild() {
  const h1 = document.querySelector<HTMLElement>(".home-hero h1");
  if (!h1 || h1.dataset.ygBuilt) return;
  h1.dataset.ygBuilt = "1";
  const text = h1.textContent?.trim() ?? "";
  if (!text) return;

  h1.setAttribute("aria-label", text);
  h1.classList.add("yg-build");
  let i = 0;
  const words = text.split(/(\s+)/).map((part) => {
    if (/^\s+$/.test(part)) return " ";
    const chars = [...part]
      .map((ch) => `<span class="yg-chip" style="--i:${i++}">${ch.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`)
      .join("");
    return `<span class="yg-word">${chars}</span>`;
  });
  h1.innerHTML = `<span aria-hidden="true">${words.join("")}</span><span class="yg-head" aria-hidden="true"></span>`;

  const chips = [...h1.querySelectorAll<HTMLElement>(".yg-chip")];
  const head = h1.querySelector<HTMLElement>(".yg-head")!;

  if (reduceMotion()) {
    chips.forEach((c) => c.classList.add("is-placed"));
    head.remove();
    return;
  }

  // The "pick-and-place head" visits each footprint and drops a component.
  let n = 0;
  const place = () => {
    const chip = chips[n];
    if (!chip) {
      head.classList.add("is-done");
      return;
    }
    head.style.transform = `translate(${chip.offsetLeft + chip.offsetWidth / 2}px, ${chip.offsetTop}px)`;
    chip.classList.add("is-placed");
    n += 1;
    window.setTimeout(place, chip.textContent === " " ? 0 : 38);
  };
  window.setTimeout(place, 350);
}

// ---------- hero: PCB traces that route as you scroll ----------

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function initTraces() {
  const stage = document.querySelector<HTMLElement>(".home-top-stage");
  if (!stage || stage.querySelector(".yg-traces")) return;
  const rand = rng(1337);
  const W = 1200;
  const H = 800;
  let paths = "";
  let pads = "";
  for (let t = 0; t < 16; t++) {
    const fromLeft = t % 2 === 0;
    let x = fromLeft ? -10 : W + 10;
    let y = 60 + rand() * (H - 120);
    let d = `M${x},${y}`;
    const segments = 3 + Math.floor(rand() * 3);
    for (let s = 0; s < segments; s++) {
      const run = 60 + rand() * 180;
      x += fromLeft ? run : -run;
      d += ` L${x.toFixed(0)},${y.toFixed(0)}`;
      if (s < segments - 1) {
        const diag = (rand() < 0.5 ? -1 : 1) * (20 + rand() * 50);
        x += fromLeft ? Math.abs(diag) : -Math.abs(diag);
        y += diag;
        d += ` L${x.toFixed(0)},${y.toFixed(0)}`;
      }
    }
    paths += `<path d="${d}" pathLength="1"/>`;
    pads += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" style="--at:${(0.55 + rand() * 0.4).toFixed(2)}"/>`;
  }
  stage.insertAdjacentHTML(
    "beforeend",
    `<svg class="yg-traces" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="yg-traces__paths">${paths}</g><g class="yg-traces__pads">${pads}</g></svg>`
  );
  const svg = stage.querySelector<SVGElement>(".yg-traces")!;
  const pathEls = [...svg.querySelectorAll<SVGPathElement>("path")];
  const padEls = [...svg.querySelectorAll<SVGCircleElement>("circle")];

  const update = () => {
    const total = stage.offsetHeight || 1;
    const p = reduceMotion() ? 1 : Math.min(1, 0.22 + (window.scrollY / total) * 1.3);
    pathEls.forEach((path) => (path.style.strokeDashoffset = String(1 - p)));
    padEls.forEach((pad) => pad.classList.toggle("is-lit", p >= Number(pad.style.getPropertyValue("--at"))));
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

// ---------- solder cursor + smoke over hardware work ----------

const HARDWARE = /hardware|embedded|pcb|firmware|raspberry|arduino|wearable|iot|electronic|sensor|esp32|bluetooth/i;

export function initSolder(root: HTMLElement) {
  const toggle = root.querySelector<HTMLInputElement>("[data-toggle='solder']");
  if (!window.matchMedia("(pointer: fine)").matches) {
    toggle?.closest("label")?.setAttribute("hidden", "");
    return;
  }
  const targets = [
    ...document.querySelectorAll<HTMLElement>(".home-project-card, .home-work-row, .home-pill, .home-manual-group, .home-note-card"),
  ].filter((el) => HARDWARE.test(el.textContent || ""));

  let on = read<boolean>("yg.solder", false);
  const apply = () => targets.forEach((el) => el.classList.toggle("yg-solder", on));
  if (toggle) {
    toggle.checked = on;
    toggle.addEventListener("change", () => {
      on = toggle.checked;
      write("yg.solder", on);
      apply();
    });
  }
  apply();

  let last = 0;
  targets.forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      if (!on || reduceMotion()) return;
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      const puff = document.createElement("span");
      puff.className = "yg-smoke yg-noinvert";
      puff.style.left = `${e.clientX + 2}px`;
      puff.style.top = `${e.clientY - 26}px`;
      puff.style.setProperty("--drift", `${(Math.random() * 24 - 12).toFixed(0)}px`);
      document.body.appendChild(puff);
      window.setTimeout(() => puff.remove(), 1100);
    });
  });
}

// ---------- light switch ----------

function clickSound() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const len = Math.floor(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1800;
    const gain = ctx.createGain();
    gain.gain.value = 0.5;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch {
    /* no audio: silent switch */
  }
}

export function initLightSwitch(root: HTMLElement) {
  const host = root.querySelector<HTMLElement>(".yg-settings__lights");
  if (!host || host.querySelector(".yg-switch")) return;
  const html = document.documentElement;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "yg-switch";
  btn.innerHTML = `<span class="yg-switch__plate"><span class="yg-switch__lever"></span></span><span class="yg-switch__label">Lights</span><span class="yg-switch__hint">Light / dark mode</span>`;
  host.appendChild(btn);

  const sync = () => {
    const on = html.classList.contains("yg-light");
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", on ? "Turn the lights off (dark mode)" : "Turn the lights on (light mode)");
  };
  sync();

  let flips = 0;
  let busy = false;
  btn.addEventListener("click", () => {
    if (busy) return;
    clickSound();
    flips += 1;
    if (flips === 5) unlock("sparky");
    const turningOn = !html.classList.contains("yg-light");
    write("yg.lights", turningOn ? "on" : "off");
    if (!turningOn || reduceMotion()) {
      html.classList.toggle("yg-light", turningOn);
      sync();
      return;
    }
    // fluorescent-tube flicker on the way up
    busy = true;
    const pattern = [true, false, true, false, false, true];
    pattern.forEach((state, i) => window.setTimeout(() => html.classList.toggle("yg-light", state), i * 70));
    window.setTimeout(() => {
      html.classList.add("yg-light");
      busy = false;
      sync();
    }, pattern.length * 70 + 10);
  });

  if (read<string>("yg.lights", "off") === "on") {
    html.classList.add("yg-light");
    sync();
  }
}

// ---------- keyboard + scroll easter eggs ----------

export function initEasterEggs() {
  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let k = 0;
  let typed = "";
  document.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("input, textarea, [contenteditable='true']")) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    k = key === konami[k] ? k + 1 : key === konami[0] ? 1 : 0;
    if (k === konami.length) {
      k = 0;
      unlock("oneup");
    }
    if (key.length === 1) {
      typed = (typed + key).slice(-12);
      if (typed.endsWith("unhinged")) unlock("certified");
    }
  });

  const footer = document.querySelector(".home-footer");
  if (footer) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        unlock("bottom");
        io.disconnect();
      }
    });
    io.observe(footer);
  }
}
