// Captura as páginas de referência (só consulta) em docs/direcao-tipografica/lab2/referencias/.
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
const pasta = fileURLToPath(new URL("./referencias/", import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("https://www.kinadesignstudio.com/green-matcha", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
const altura = await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 250)); }
  window.scrollTo(0, 0); return document.body.scrollHeight;
});
await p.waitForTimeout(1000);
for (let i = 0, y = 0; y < altura && i < 14; i++, y += 900) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${pasta}green-matcha-${String(i).padStart(2, "0")}.png` });
}
const imgs = await p.evaluate(() => [...document.images].map((i) => ({ src: i.currentSrc, w: i.naturalWidth, alt: i.alt })).filter((i) => i.w > 400));
console.log(altura, JSON.stringify(imgs.slice(0, 30)));
await b.close();
