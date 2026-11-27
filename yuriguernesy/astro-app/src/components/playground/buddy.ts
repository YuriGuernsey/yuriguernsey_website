import { read, write } from "./api";
import { unlock } from "./unlocks";

// 16x16 pixel BuffBuddy. k outline, p body, l highlight, r headband, w eye, b pupil.
const BODY = [
  "................",
  "....kkkkkkkk....",
  "...kllppppppk...",
  "..klpppppppppk..",
  "..krrrrrrrrrrk..",
  "..kpwwppppwwpk..",
  "..kpwbppppwbpk..",
  "..kppppppppppk..",
  ".kkpppkkkkpppkk.",
  "kpkppppppppppkpk",
  "kk.kppppppppk.kk",
  "...kppppppppk...",
  "....kkkkkkkk....",
];
const FEET_A = ["....kk....kk....", "................", "................"];
const FEET_B = ["...kk......kk...", "................", "................"];
const BLINK_ROW = "..kpkkppppkkpk..";

const COLORS: Record<string, string> = {
  k: "#1b1033",
  p: "#8b5cf6",
  l: "#c4b5fd",
  r: "#ef4444",
  w: "#ffffff",
  b: "#1b1033",
};

function sprite(rows: string[]) {
  let rects = "";
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = COLORS[ch];
      if (fill) rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${fill}"/>`;
    });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">${rects}</svg>`;
}

const LINES = [
  "Did you hydrate?",
  "Ship it. Then stretch.",
  "One more rep. One more commit.",
  "Leg day? Never heard of it.",
  "Hire Yuri. I'm biased.",
  "This site has hidden stickers...",
  "Protein shake == coffee, right?",
];

type State = "walk" | "idle" | "hop" | "sit";

export function initBuddy(root: HTMLElement) {
  const toggle = root.querySelector<HTMLInputElement>("[data-toggle='buddy']")!;
  const el = document.createElement("button");
  el.type = "button";
  el.className = "yg-buddy yg-noinvert";
  el.setAttribute("aria-label", "BuffBuddy, a tiny pixel gym companion. Poke him.");
  const frames = [
    sprite([...BODY, ...FEET_A]),
    sprite([...BODY, ...FEET_B]),
    sprite([...BODY.slice(0, 6), BLINK_ROW, ...BODY.slice(7), ...FEET_A]),
  ];
  el.innerHTML = `<span class="yg-buddy__sprite">${frames[0]}</span><span class="yg-buddy__bubble" hidden></span>`;
  document.body.appendChild(el);
  const spriteEl = el.querySelector<HTMLElement>(".yg-buddy__sprite")!;
  const bubble = el.querySelector<HTMLElement>(".yg-buddy__bubble")!;

  const enabled = read<boolean>("yg.buddy.visible", true);
  toggle.checked = enabled;
  el.hidden = !enabled;
  toggle.addEventListener("change", () => {
    el.hidden = !toggle.checked;
    write("yg.buddy.visible", toggle.checked);
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const size = () => (window.innerWidth < 600 ? 40 : 56);
  const floor = () => window.innerHeight - size() - 10;

  let x = 24;
  let y = floor();
  let dir = 1;
  let state: State = "walk";
  let stateUntil = performance.now() + 4000;
  let frame = 0;
  let lastFrameAt = 0;
  let seat: HTMLElement | null = null;
  let hop: { fx: number; fy: number; tx: () => number; ty: () => number; start: number; dur: number; then: State } | null = null;
  let bounceUntil = 0;
  let pokes = 0;
  let bubbleTimer = 0;

  function say(text: string) {
    bubble.textContent = text;
    bubble.hidden = false;
    window.clearTimeout(bubbleTimer);
    bubbleTimer = window.setTimeout(() => (bubble.hidden = true), 2400);
  }

  function seatPoint(h: HTMLElement) {
    const range = document.createRange();
    range.selectNodeContents(h);
    const rects = range.getClientRects();
    const first = rects[0] ?? h.getBoundingClientRect();
    return { x: Math.min(first.right - size() * 0.6, window.innerWidth - size() - 8), y: first.top - size() + 8 };
  }

  function pickSeat() {
    const options = [...document.querySelectorAll<HTMLElement>("main h2, main h3")].filter((h) => {
      const r = h.getBoundingClientRect();
      return r.top > 90 && r.top < window.innerHeight - 160 && r.width > 0;
    });
    return options[Math.floor(Math.random() * options.length)] ?? null;
  }

  function startHop(tx: () => number, ty: () => number, then: State) {
    hop = { fx: x, fy: y, tx, ty, start: performance.now(), dur: 650, then };
    state = "hop";
  }

  el.addEventListener("pointerenter", () => {
    bounceUntil = performance.now() + 420;
    say(LINES[Math.floor(Math.random() * LINES.length)]);
  });
  el.addEventListener("click", () => {
    pokes += 1;
    bounceUntil = performance.now() + 420;
    if (pokes === 5) {
      say("GAINS!");
      unlock("gymbro");
    } else {
      say(["Oi.", "That tickles.", "Spot me?", "Careful, I bench pixels."][pokes % 4]);
    }
  });

  function place(now: number) {
    const bounce = now < bounceUntil ? Math.sin(((bounceUntil - now) / 420) * Math.PI) * 14 : 0;
    el.style.transform = `translate(${x.toFixed(1)}px, ${(y - bounce).toFixed(1)}px)`;
    spriteEl.style.transform = `scaleX(${dir})`;
    el.style.width = el.style.height = `${size()}px`;
  }

  if (reduce) {
    y = floor();
    place(performance.now());
    window.addEventListener("resize", () => {
      y = floor();
      place(performance.now());
    });
    return;
  }

  function tick(now: number) {
    if (!el.hidden) {
      const maxX = window.innerWidth - size() - 150; // keep clear of the sticker button
      if (state === "walk") {
        x += dir * (window.innerWidth < 600 ? 0.5 : 0.8);
        y = floor();
        if (x < 8 || x > maxX) {
          dir *= -1;
          x = Math.max(8, Math.min(maxX, x));
        }
        if (now > stateUntil) {
          const roll = Math.random();
          const target = roll < 0.55 ? pickSeat() : null;
          if (target) {
            seat = target;
            dir = seatPoint(target).x > x ? 1 : -1;
            startHop(() => seatPoint(target).x, () => seatPoint(target).y, "sit");
            stateUntil = now + 6000 + Math.random() * 6000;
          } else {
            state = "idle";
            stateUntil = now + 1500 + Math.random() * 2000;
          }
        }
      } else if (state === "idle") {
        y = floor();
        if (now > stateUntil) {
          state = "walk";
          if (Math.random() < 0.4) dir *= -1;
          stateUntil = now + 5000 + Math.random() * 7000;
        }
      } else if (state === "sit" && seat) {
        const p = seatPoint(seat);
        x = p.x;
        y = p.y;
        const gone = p.y < -size() || p.y > floor();
        if (gone || now > stateUntil) {
          seat = null;
          if (gone) {
            x = Math.max(8, Math.min(maxX, x));
            y = Math.max(-size(), Math.min(floor(), y));
          }
          startHop(() => Math.max(8, Math.min(maxX, x + dir * 60)), floor, "walk");
          stateUntil = now + 6000 + Math.random() * 6000;
        }
      } else if (state === "hop" && hop) {
        const t = Math.min(1, (now - hop.start) / hop.dur);
        const tx = hop.tx();
        const ty = hop.ty();
        x = hop.fx + (tx - hop.fx) * t;
        const arc = Math.sin(t * Math.PI) * 90;
        y = hop.fy + (ty - hop.fy) * t - arc;
        if (t >= 1) {
          state = hop.then;
          hop = null;
        }
      }

      // animation frames: walk cycle, occasional blink
      const moving = state === "walk";
      if (now - lastFrameAt > (moving ? 160 : 2600)) {
        frame = moving ? (frame === 0 ? 1 : 0) : frame === 2 ? 0 : 2;
        lastFrameAt = now - (frame === 2 ? 2450 : 0);
        spriteEl.innerHTML = frames[frame];
      }
      place(now);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
