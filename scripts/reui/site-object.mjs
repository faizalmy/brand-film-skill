// reui.io as an object: the real hero, one light and one dark still (the nav's real toggle clicked), plus 10x and 20x patches of the
// few elements the film goes macro on, with their DOM boxes. The dated "Biggest drop" badge is hidden so the film does not go stale.
import { createRequire } from "node:module"
import fs from "node:fs"
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? process.cwd()) + "/")
const { chromium } = require("playwright")
const OUT = "public/cap/site-object"
const PAGE = { width: 1600, height: 1300 }
fs.mkdirSync(OUT, { recursive: true })
const b = await chromium.launch()
const open = async (dpr, ctxState) => {
  const c = await b.newContext({ viewport: PAGE, deviceScaleFactor: dpr, colorScheme: "light" })
  const p = await c.newPage()
  await p.goto("https://reui.io", { waitUntil: "domcontentloaded" })
  await p.waitForTimeout(5000)
  for (const [label, item] of [["Select block group", "Application"], ["Select block category", "Gantt"]]) {
    await p.getByLabel(label, { exact: true }).click()
    await p.waitForTimeout(500)
    await p.getByRole("option").filter({ hasText: item }).first().click()
    await p.waitForTimeout(2500)
  }
  await p.evaluate(() => {
    const e = [...document.querySelectorAll("a,button,div")].find((n) => /^Biggest drop/.test((n.textContent || "").trim()) && n.getBoundingClientRect().height < 50)
    if (e) e.style.visibility = "hidden"
  })
  await p.mouse.move(5, 1290)
  await p.waitForTimeout(2500)
  return p
}
const toggle = async (p) => { await p.getByLabel("Toggle light or dark mode").first().click(); await p.mouse.move(5, 1290); await p.waitForTimeout(3000) }
const words = (p) => p.evaluate((list) => {
  const w = document.createTreeWalker(document.querySelector("h1"), NodeFilter.SHOW_TEXT), out = {}
  for (let n; (n = w.nextNode());) for (const t of list) { const i = n.textContent.indexOf(t); if (i >= 0) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + t.length); const q = r.getBoundingClientRect(); out[t] = { x: q.x, y: q.y, w: q.width, h: q.height } } }
  return out
}, ["Design-forward", "MCP fluency"])
const box = async (l) => { const r = await l.boundingBox(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } }
const PATCH = { head: { x: 370, y: 190, width: 860, height: 140, q: 10 }, nav: { x: 1140, y: 0, width: 450, height: 56, q: 20 } }
const clip = ({ x, y, width, height }) => ({ x, y, width, height })

const lo = await open(4)
await lo.screenshot({ path: `${OUT}/light.jpg`, type: "jpeg", quality: 88 })
const meta = { page: PAGE, patch: PATCH, words: await words(lo), moon: await box(lo.getByLabel("Toggle light or dark mode").first()), cta: await box(lo.getByRole("link", { name: "Get All-Access" }).first().or(lo.getByRole("button", { name: "Get All-Access" }).first()).first()) }
await toggle(lo)
await lo.screenshot({ path: `${OUT}/dark.jpg`, type: "jpeg", quality: 88 })
await lo.context().close()

const head = await open(PATCH.head.q)
await head.screenshot({ path: `${OUT}/head.jpg`, type: "jpeg", quality: 88, clip: clip(PATCH.head) })
await head.context().close()
const nav = await open(PATCH.nav.q)
await nav.screenshot({ path: `${OUT}/nav.jpg`, type: "jpeg", quality: 88, clip: clip(PATCH.nav) })
await toggle(nav)
await nav.screenshot({ path: `${OUT}/nav-dark.jpg`, type: "jpeg", quality: 88, clip: clip(PATCH.nav) })
await b.close()
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1))
console.log(JSON.stringify(meta))
