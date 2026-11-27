// Guestbook printer: a thermal receipt prints out of the Settings button whenever a
// visitor does something (places a sticker or pixel, finds a hidden sticker, vends).
import { read, write } from "./api";

const queue: string[][] = [];
let busy = false;

function nextOrder() {
  let n = read<number>("yg.order", 0);
  if (!n) n = 400 + Math.floor(Math.random() * 100);
  n += 1;
  write("yg.order", n);
  return String(n).padStart(4, "0");
}

function rattle(lines: number) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const dur = Math.min(1.6, lines * 0.09);
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / ctx.sampleRate;
      const chop = Math.sin(t * 2 * Math.PI * 38) > 0 ? 1 : 0.25; // stepper-motor chatter
      data[i] = (Math.random() * 2 - 1) * chop * 0.25;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2400;
    const gain = ctx.createGain();
    gain.gain.value = 0.18;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch {
    /* silent printer */
  }
}

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}  ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const pad = (left: string, right: string, width = 28) => `${left}${" ".repeat(Math.max(1, width - left.length - right.length))}${right}`;

/** items: [label, price] pairs. */
export function printReceipt(title: string, items: Array<[string, string]>, footer = "THANKS FOR VISITING") {
  const lines = [
    "YURI-OS GUESTBOOK",
    "yuriguernsey.com",
    "----------------------------",
    stamp(),
    `ORDER #${nextOrder()}`,
    "----------------------------",
    title.toUpperCase(),
    ...items.map(([label, price]) => pad(label.toUpperCase().slice(0, 20), price)),
    "----------------------------",
    pad("TOTAL", "£0.00"),
    "",
    footer.toUpperCase(),
    "* * * * * * * * * * * * * *",
  ];
  queue.push(lines);
  if (!busy) printNext();
}

function printNext() {
  const lines = queue.shift();
  if (!lines) {
    busy = false;
    return;
  }
  busy = true;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const paper = document.createElement("div");
  paper.className = "yg-receipt yg-noinvert";
  paper.title = "Click to tear off";
  const pre = document.createElement("pre");
  pre.setAttribute("role", "status");
  paper.appendChild(pre);
  const tearBtn = document.createElement("button");
  tearBtn.type = "button";
  tearBtn.className = "yg-receipt__tear";
  tearBtn.textContent = "Tear off";
  tearBtn.setAttribute("aria-label", "Tear off receipt");
  paper.appendChild(tearBtn);
  document.body.appendChild(paper);
  document.querySelector(".yg-fab")?.classList.add("is-printing");
  rattle(lines.length);

  let i = 0;
  const done = () => {
    document.querySelector(".yg-fab")?.classList.remove("is-printing");
    const tear = () => {
      if (paper.classList.contains("is-torn")) return;
      paper.classList.add("is-torn");
      window.setTimeout(() => {
        paper.remove();
        printNext();
      }, 520);
    };
    paper.addEventListener("click", tear);
    tearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tear();
    });
    window.setTimeout(tear, 5200);
  };

  if (reduce) {
    pre.textContent = lines.join("\n");
    done();
    return;
  }
  const tick = () => {
    pre.textContent += (i ? "\n" : "") + lines[i];
    i += 1;
    if (i < lines.length) window.setTimeout(tick, 85);
    else done();
  };
  tick();
}
