/* Titulary demo. One peer at a time, generated client-side. */
import { randomSeed, titulary } from "./titulary.esm.js";

const DIALS = ["ridiculous", "length", "antiquity", "pretension"];
const SELECTS = ["tradition", "gender", "kind", "format"];

const peerEl = document.getElementById("peer");
const seedEl = document.getElementById("seed");
let seedText = "";
let current = "";

function coerceSeed(raw) {
  return /^-?\d+$/.test(raw) ? Number(raw) : raw;
}

function dialValue(name) {
  return Number(document.getElementById(name).value);
}

function selectValue(name) {
  return document.getElementById(name).value;
}

function generate() {
  const opts = { seed: coerceSeed(seedText) };
  const params = new URLSearchParams();
  params.set("seed", seedText);
  for (const name of DIALS) {
    opts[name] = dialValue(name);
    if (opts[name] !== 0.5) params.set(name, String(opts[name]));
  }
  const defaults = { tradition: "british", gender: "random", kind: "title", format: "html" };
  for (const name of SELECTS) {
    opts[name] = selectValue(name);
    if (opts[name] !== defaults[name]) params.set(name, opts[name]);
  }
  current = titulary(opts);
  if (opts.format === "html") {
    peerEl.innerHTML = current;
    peerEl.classList.remove("mono");
  } else {
    peerEl.textContent = "";
    const pre = document.createElement("pre");
    pre.textContent = current;
    peerEl.appendChild(pre);
    peerEl.classList.add("mono");
  }
  history.replaceState(null, "", `${location.pathname}?${params}`);
}

document.getElementById("randomize").addEventListener("click", () => {
  seedText = randomSeed();
  seedEl.value = seedText;
  generate();
  window.scrollTo({ top: 0 });
});

const copyEl = document.getElementById("copy");
copyEl.addEventListener("click", async () => {
  if (!current) return;
  try {
    await navigator.clipboard.writeText(current);
    copyEl.textContent = "copied";
    setTimeout(() => { copyEl.textContent = "copy"; }, 1200);
  } catch {
    /* leave the button alone if the clipboard is unavailable */
  }
});

let seedTimer;
seedEl.addEventListener("input", () => {
  clearTimeout(seedTimer);
  seedTimer = setTimeout(() => {
    const raw = seedEl.value.trim();
    if (!raw || raw === seedText) return;
    seedText = raw;
    generate();
  }, 250);
});

let dialTimer;
for (const name of DIALS) {
  const input = document.getElementById(name);
  const readout = document.querySelector(`[data-value="${name}"]`);
  input.addEventListener("input", () => {
    readout.textContent = dialValue(name).toFixed(2);
    clearTimeout(dialTimer);
    dialTimer = setTimeout(generate, 150);
  });
}

for (const name of SELECTS) {
  document.getElementById(name).addEventListener("change", generate);
}

const params = new URLSearchParams(location.search);
seedText = params.get("seed") ?? randomSeed();
seedEl.value = seedText;
for (const name of DIALS) {
  const raw = params.get(name);
  if (raw !== null && Number.isFinite(Number(raw))) {
    document.getElementById(name).value = String(Math.max(0, Math.min(1, Number(raw))));
  }
  document.querySelector(`[data-value="${name}"]`).textContent = dialValue(name).toFixed(2);
}
for (const name of SELECTS) {
  const raw = params.get(name);
  if (raw !== null && [...document.getElementById(name).options].some((o) => o.value === raw)) {
    document.getElementById(name).value = raw;
  }
}
generate();
