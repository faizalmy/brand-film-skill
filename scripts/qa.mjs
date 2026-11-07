// QA stills only: renders chosen frames at a reduced scale from a prebuilt bundle, never a final video.
// resolved from the project folder (the cwd), since this script lives in the skill
import { createRequire } from "node:module"
const { renderStill, selectComposition, openBrowser } = createRequire(process.cwd() + "/")("@remotion/renderer")
const [bundle, out, scale, ...frames] = process.argv.slice(2)
const ID = process.env.COMP ?? "Refreshed"
const browser = await openBrowser("chrome")
const comp = await selectComposition({ serveUrl: bundle, id: ID, puppeteerInstance: browser })
for (const f of frames.map(Number)) {
  await renderStill({ serveUrl: bundle, composition: comp, frame: f, output: `${out}/f${String(f).padStart(4, "0")}.jpg`, imageFormat: "jpeg", jpegQuality: 80, scale: Number(scale), puppeteerInstance: browser })
}
await browser.close({ silent: true })
