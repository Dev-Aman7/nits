import { chromium, firefox } from "playwright";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

/** The page uses scroll-behavior: smooth, so a scrollTo does not land at once. */
async function scrollTo(page, y) {
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: "instant" }), y);
  await page.waitForFunction(
    (target) => Math.abs(window.scrollY - target) < 2 || window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2,
    y,
    { timeout: 5000 },
  );
  await page.waitForTimeout(280); // let the rAF-throttled listener publish
}

const b = await chromium.launch({ executablePath: CHROME });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });

/* --- tokens actually reached the DOM ----------------------------------- */
const tokens = await p.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  return {
    paper: cs.getPropertyValue("--paper").trim(),
    ink: cs.getPropertyValue("--ink").trim(),
    indigo: cs.getPropertyValue("--indigo").trim(),
  };
});
check("tokens", tokens.paper === "#f4f3f0" && tokens.ink === "#0b0c10" && tokens.indigo === "#4b55ee", JSON.stringify(tokens));

/* --- three grounds, no fourth ------------------------------------------ */
const grounds = await p.evaluate(() => {
  const ids = ["act-00", "act-01", "act-02", "act-03", "act-04", "act-05", "contact"];
  return ids.map((id) => [id, getComputedStyle(document.getElementById(id)).backgroundColor]);
});
const allowed = new Set(["rgb(244, 243, 240)", "rgb(11, 12, 16)", "rgb(75, 85, 238)"]);
check("three grounds only", grounds.every(([, c]) => allowed.has(c)), JSON.stringify(grounds));

/* --- zero box-shadows anywhere ----------------------------------------- */
const shadows = await p.evaluate(() =>
  [...document.querySelectorAll("*")].filter((e) => {
    const s = getComputedStyle(e).boxShadow;
    return s && s !== "none";
  }).length);
check("no box-shadow", shadows === 0, `found ${shadows}`);

/* --- one mono label style ---------------------------------------------- */
const mono = await p.evaluate(() => {
  const set = new Set();
  document.querySelectorAll(".mono").forEach((e) => {
    const s = getComputedStyle(e);
    set.add(`${s.fontSize}/${s.fontWeight}/${s.letterSpacing}`);
  });
  return [...set];
});
check("single mono label style", mono.length === 1 && mono[0].startsWith("11px/500/1.54px"), JSON.stringify(mono));

/* --- radii: 0, pill, circle only --------------------------------------- */
const radii = await p.evaluate(() => {
  const set = new Set();
  document.querySelectorAll("section *, header *, footer *").forEach((e) => {
    const r = getComputedStyle(e).borderRadius;
    if (r && r !== "0px") set.add(r);
  });
  return [...set];
});
check("square by default", radii.every((r) => r === "999px" || r === "50%"), JSON.stringify(radii));

/* --- nav ground inverts over each ink section -------------------------- */
const nav = [];
for (const id of ["act-00", "act-01", "act-02", "act-03", "act-04", "act-05", "contact"]) {
  const top = await p.evaluate((i) => document.getElementById(i).offsetTop, id);
  await scrollTo(p, top + 4);
  nav.push([id, await p.evaluate(() => document.querySelector("header").dataset.ground)]);
}
const expected = { "act-00": "paper", "act-01": "ink", "act-02": "ink", "act-03": "ink", "act-04": "ink", "act-05": "paper", contact: "paper" };
check("nav ground inversion", nav.every(([id, g]) => g === expected[id]), JSON.stringify(nav));

/* --- depth readout buckets --------------------------------------------- */
const t2 = await p.evaluate(() => document.getElementById("act-02").offsetTop);
const h2 = await p.evaluate(() => document.getElementById("act-02").offsetHeight);
/* The readout buckets the section's own scrollable travel (height − viewport),
   as v3's logic class does — not a fraction of its height. */
const travel = h2 - (await p.evaluate(() => window.innerHeight));
const depths = [];
for (const frac of [0.1, 0.5, 0.9]) {
  await scrollTo(p, t2 + travel * frac);
  depths.push(await p.evaluate(() => document.querySelector("#act-02 p[aria-label]").textContent.replace(/\s/g, "")));
}
check(
  "depth readout steps",
  JSON.stringify(depths) === JSON.stringify(["10−1m", "10−3m", "10−5m"]),
  JSON.stringify(depths),
);

/* --- progress bar reaches 100% ----------------------------------------- */
await scrollTo(p, await p.evaluate(() => document.documentElement.scrollHeight));
const prog = await p.evaluate(() => document.querySelector("header").previousElementSibling.firstElementChild.style.width);
check("progress bar", parseFloat(prog) > 99, prog);

/* --- images all resolve ------------------------------------------------ */
const broken = await p.evaluate(() =>
  [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
check("all images load", broken.length === 0, JSON.stringify(broken));

/* --- headings in order, single h1 -------------------------------------- */
const headings = await p.evaluate(() => [...document.querySelectorAll("h1,h2,h3")].map((h) => h.tagName));
check("one h1", headings.filter((h) => h === "H1").length === 1, headings.join(","));

/* --- no horizontal overflow at 390px ----------------------------------- */
const m = await b.newPage({ viewport: { width: 390, height: 844 } });
await m.goto("http://localhost:3100", { waitUntil: "networkidle" });
await m.waitForTimeout(500);
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("no horizontal overflow @390", overflow <= 0, `${overflow}px`);

/* --- mobile menu toggles ------------------------------------------------ */
const btn = m.locator("header button").first();
await btn.click();
await m.waitForTimeout(300);
const open = await btn.getAttribute("aria-expanded");
const visible = await m.locator("header nav a").first().isVisible();
await m.keyboard.press("Escape");
await m.waitForTimeout(300);
const closed = await btn.getAttribute("aria-expanded");
check("mobile menu", open === "true" && visible && closed === "false", `open=${open} visible=${visible} closed=${closed}`);

await b.close();

/* --- fallback path in Firefox ------------------------------------------ */
const fb = await firefox.launch();
const fp = await fb.newPage({ viewport: { width: 1440, height: 900 } });
await fp.goto("http://localhost:3100", { waitUntil: "networkidle" });
const supports = await fp.evaluate(() => CSS.supports("animation-timeline", "view()"));
const pre = await fp.evaluate(() => getComputedStyle(document.querySelector("#act-05 [data-reveal]")).opacity);
const top5 = await fp.evaluate(() => document.getElementById("act-05").offsetTop);
await scrollTo(fp, top5);
await fp.waitForTimeout(1500);
const post = await fp.evaluate(() => getComputedStyle(document.querySelector("#act-05 [data-reveal]")).opacity);
check("fallback reveal (firefox)", supports === false && pre === "0" && post === "1", `supports=${supports} before=${pre} after=${post}`);
await fb.close();

/* --- report ------------------------------------------------------------ */
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : `  → ${r.detail}`}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
