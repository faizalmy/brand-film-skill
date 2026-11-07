// Real mouse on the real dashboard-7 block: over the revenue chart, then its Month/Quarter toggle. One screenshot a step.
// Adds the result to public/cap/live/meta.json beside the other live captures.
import { createRequire } from "node:module"
import fs from "node:fs"
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? process.cwd()) + "/")
const { chromium } = require("playwright")
const OUT = "public/cap/live"
const clip = { x: 156, y: 70, width: 1288, height: 545 }
fs.mkdirSync(`${OUT}/dash`, { recursive: true })
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2, colorScheme: "light" })
await c.addInitScript(() => { try { localStorage.setItem("reui-theme", "light"); localStorage.setItem("theme", "light") } catch {} })
const p = await c.newPage()
await p.goto("https://reui.io/preview/base/dashboard-7", { waitUntil: "domcontentloaded" })
await p.waitForTimeout(6000)
const frames = []
let at = { x: 340, y: 150 }
const shot = async () => {
  await p.screenshot({ path: `${OUT}/dash/${String(frames.length).padStart(3, "0")}.jpg`, type: "jpeg", quality: 88, clip })
  frames.push({ x: +(at.x - clip.x).toFixed(1), y: +(at.y - clip.y).toFixed(1) })
}
const glide = async (to, steps) => {
  const from = { ...at }
  for (let i = 1; i <= steps; i++) {
    const t = ease(i / steps)
    at = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }
    await p.mouse.move(at.x, at.y)
    await shot()
  }
}
await p.mouse.move(at.x, at.y)
await glide({ x: 300, y: 380 }, 5)
await glide({ x: 760, y: 380 }, 11)
const q = await p.getByRole("radio", { name: "Quarter" }).or(p.getByRole("button", { name: "Quarter" })).first().boundingBox()
await glide({ x: q.x + q.width / 2, y: q.y + q.height / 2 }, 6)
await p.mouse.down(); await p.mouse.up()
for (const ms of [60, 120, 180, 240, 300, 400]) { await p.waitForTimeout(ms); await shot() }
await b.close()
const meta = JSON.parse(fs.readFileSync(`${OUT}/meta.json`, "utf8"))
meta.dash = { clip, frames }
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1))
console.log("frames", frames.length)
