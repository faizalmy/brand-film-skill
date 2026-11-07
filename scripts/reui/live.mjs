// Real interactions on the real components: a mouse drives c-kanban-1 and c-data-grid-22 on reui.io, one screenshot a
// step, so the film plays the components' own behaviour. Also measures their boxes from the DOM for the dimension layer.
import { createRequire } from "node:module"
import fs from "node:fs"
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? process.cwd()) + "/")
const { chromium } = require("playwright")
const OUT = "public/cap/live"
const DPR = 2
const b = await chromium.launch()
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const open = async (theme, item) => {
  const c = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: DPR, colorScheme: theme })
  await c.addInitScript((t) => { try { localStorage.setItem("reui-theme", t); localStorage.setItem("theme", t) } catch {} }, theme)
  const p = await c.newPage()
  await p.goto(`https://reui.io/preview/base/components/${item}`, { waitUntil: "domcontentloaded" })
  await p.waitForTimeout(3500)
  return p
}
const shooter = (p, dir, clip) => {
  fs.mkdirSync(`${OUT}/${dir}`, { recursive: true })
  const frames = []
  let at = { x: 0, y: 0 }
  return {
    frames,
    async shot() {
      await p.screenshot({ path: `${OUT}/${dir}/${String(frames.length).padStart(3, "0")}.jpg`, type: "jpeg", quality: 88, clip })
      frames.push({ x: +(at.x - clip.x).toFixed(1), y: +(at.y - clip.y).toFixed(1) })
    },
    async glide(to, steps, shoot = true) {
      const from = { ...at }
      for (let i = 1; i <= steps; i++) {
        const t = ease(i / steps)
        at = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }
        await p.mouse.move(at.x, at.y)
        if (shoot) await this.shot()
      }
    },
    place(pt) { at = pt },
  }
}
const centre = async (l) => { const r = await l.boundingBox(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, ...r } }
const meta = {}

/* Kanban, light: a card dragged from Backlog to In Progress, on the real dnd. */
{
  const p = await open("light", "c-kanban-1")
  const clip = { x: 190, y: 218, width: 900, height: 360 }
  const s = shooter(p, "kanban", clip)
  const card = await centre(p.getByText("Create API endpoints").first())
  const target = await centre(p.getByText("Implement dark mode").first())
  const rects = await p.evaluate(() => {
    const box = (t) => { let e = [...document.querySelectorAll("*")].find((n) => n.children.length === 0 && n.textContent.trim() === t); return e }
    const up = (e, f) => { while (e && !f(e)) e = e.parentElement; return e?.getBoundingClientRect() }
    const c = box("Add authentication")
    const r = up(c, (n) => n.getBoundingClientRect().width > 200 && n.getBoundingClientRect().height > 60)
    const col = up(c, (n) => n.getBoundingClientRect().height > 200)
    const col2 = up(box("Design system updates"), (n) => n.getBoundingClientRect().height > 150)
    const r2 = up(box("Create API endpoints"), (n) => n.getBoundingClientRect().width > 200 && n.getBoundingClientRect().height > 60)
    return { card: { x: r.x, y: r.y, w: r.width, h: r.height }, card2: { x: r2.x, y: r2.y, w: r2.width, h: r2.height }, col: { x: col.x, y: col.y, w: col.width, h: col.height }, col2: { x: col2.x, y: col2.y, w: col2.width, h: col2.height } }
  })
  s.place({ x: card.x - 60, y: card.y - 40 })
  await p.mouse.move(card.x - 60, card.y - 40)
  await s.glide({ x: card.x, y: card.y }, 5)
  await p.mouse.down()
  await s.shot()
  await s.glide({ x: target.x, y: target.y + 40 }, 16)
  await p.mouse.up()
  await p.waitForTimeout(90); await s.shot()
  await p.waitForTimeout(90); await s.shot()
  await p.waitForTimeout(220); await s.shot()
  await p.waitForTimeout(300); await s.shot()
  meta.kanban = { clip, frames: s.frames, rects: Object.fromEntries(Object.entries(rects).map(([k, v]) => [k, { x: +(v.x - clip.x).toFixed(1), y: +(v.y - clip.y).toFixed(1), w: +v.w.toFixed(1), h: +v.h.toFixed(1) }])) }
  await p.context().close()
}

/* Data Grid, dark: rows ticked one after another, then a real sort on a real column. */
{
  const p = await open("dark", "c-data-grid-22")
  const clip = JSON.parse(fs.readFileSync("public/cap/meta.json", "utf8")).dark["c-data-grid-22"]
  const s = shooter(p, "grid", clip)
  const boxes = p.locator('tbody tr [role="checkbox"]')
  const n = await boxes.count()
  const pts = []
  for (let i = 0; i < Math.min(n, 4); i++) pts.push(await centre(boxes.nth(i)))
  const rects = await p.evaluate(() => {
    const rows = [...document.querySelectorAll("tbody tr")].map((r) => r.getBoundingClientRect())
    const head = document.querySelector("thead tr")?.getBoundingClientRect()
    const table = document.querySelector("table")?.getBoundingClientRect()
    return { row: rows[0], row2: rows[1], head, table }
  })
  s.place({ x: pts[0].x + 40, y: pts[0].y - 60 })
  await p.mouse.move(pts[0].x + 40, pts[0].y - 60)
  for (const pt of pts) {
    await s.glide({ x: pt.x, y: pt.y }, 4)
    await p.mouse.down(); await p.mouse.up()
    await p.waitForTimeout(60); await s.shot()
  }
  const sort = await centre(p.locator('thead th', { hasText: "Joined" }).locator("button, [role=button]").first())
  await s.glide({ x: sort.x, y: sort.y }, 6)
  await p.mouse.down(); await p.mouse.up()
  await p.waitForTimeout(120); await s.shot()
  await p.waitForTimeout(240); await s.shot()
  const m = (r) => ({ x: +(r.x - clip.x).toFixed(1), y: +(r.y - clip.y).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) })
  meta.grid = { clip, frames: s.frames, rects: { row: m(rects.row), row2: m(rects.row2), head: m(rects.head), table: m(rects.table) } }
  await p.context().close()
}
await b.close()
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1))
console.log(JSON.stringify({ kanban: { n: meta.kanban.frames.length, rects: meta.kanban.rects }, grid: { n: meta.grid.frames.length, rects: meta.grid.rects } }))
