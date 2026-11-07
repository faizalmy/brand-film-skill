// Real mouse on the real flow-1 and event-calendar-1 blocks, one screenshot a step (same frame format as dash.mjs): a step dragged
// across the workflow canvas, an event dragged to another day. Measures the boxes for the dimension layer. Adds both to public/cap/live/meta.json.
import { createRequire } from "node:module"
import fs from "node:fs"
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? process.cwd()) + "/")
const { chromium } = require("playwright")
const OUT = "public/cap/live"
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const b = await chromium.launch()
const meta = fs.existsSync(`${OUT}/meta.json`) ? JSON.parse(fs.readFileSync(`${OUT}/meta.json`, "utf8")) : {}
const run = async ({ dir, url, theme, clip, grab, by, measure, tool }) => {
  const c = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2, colorScheme: theme })
  await c.addInitScript((t) => { try { localStorage.setItem("reui-theme", t); localStorage.setItem("theme", t) } catch {} }, theme)
  const p = await c.newPage()
  await p.goto(`https://reui.io/preview/base/${url}`, { waitUntil: "domcontentloaded" })
  await p.waitForTimeout(7000)
  if (tool) { await p.getByRole("button", { name: tool, exact: true }).first().click(); await p.waitForTimeout(300) }
  fs.rmSync(`${OUT}/${dir}`, { recursive: true, force: true }); fs.mkdirSync(`${OUT}/${dir}`, { recursive: true })
  const box = await p.getByText(grab, { exact: true }).first().boundingBox()
  const from = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  const rects = await p.evaluate(measure)
  const frames = []; let at = { x: from.x - 70, y: from.y - 90 }
  const shot = async () => { await p.screenshot({ path: `${OUT}/${dir}/${String(frames.length).padStart(3, "0")}.jpg`, type: "jpeg", quality: 88, clip }); frames.push({ x: +(at.x - clip.x).toFixed(1), y: +(at.y - clip.y).toFixed(1) }) }
  const glide = async (to, steps) => { const s = { ...at }; for (let i = 1; i <= steps; i++) { const t = ease(i / steps); at = { x: s.x + (to.x - s.x) * t, y: s.y + (to.y - s.y) * t }; await p.mouse.move(at.x, at.y); await shot() } }
  await p.mouse.move(at.x, at.y)
  await glide(from, 6)
  await p.mouse.down(); await shot()
  await glide({ x: from.x + by.x, y: from.y + by.y }, 16)
  await p.mouse.up()
  for (const w of [90, 150, 220, 300, 400]) { await p.waitForTimeout(w); await shot() }
  meta[dir] = { clip, frames }
  console.log(dir, frames.length, JSON.stringify(rects))
  await c.close()
}
await run({ dir: "flow", url: "flow-1", theme: "dark", tool: "Select", clip: { x: 150, y: 230, width: 1288, height: 545 }, grab: "Notify sales", by: { x: 300, y: 40 }, measure: () => {
  const r = (t) => { let e = [...document.querySelectorAll("*")].find((n) => n.children.length === 0 && n.textContent.trim() === t); while (e && e.getBoundingClientRect().height < 70) e = e.parentElement; const x = e.getBoundingClientRect(); return [x.x, x.y, x.width, x.height] }
  return { form: r("Form submitted"), plan: r("Plan is Enterprise"), notify: r("Notify sales") }
} })
await run({ dir: "calendar", url: "event-calendar-1", theme: "light", clip: { x: 0, y: 8, width: 1600, height: 614 }, grab: "Design review", by: { x: 224, y: 0 }, measure: () => {
  const t = (s) => { const e = [...document.querySelectorAll("*")].find((n) => n.children.length === 0 && n.textContent.trim() === s); return e.getBoundingClientRect() }
  const m = t("Mon"), u = t("Tue"), six = t("6"), thirteen = [...document.querySelectorAll("*")].find((n) => n.children.length === 0 && n.textContent.trim() === "13").getBoundingClientRect()
  return { colW: u.x - m.x, monX: m.x, rowH: thirteen.y - six.y, sixY: six.y }
} })
await b.close()
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1))
