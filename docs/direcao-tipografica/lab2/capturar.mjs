// Capturas das direções em 390×844 (2x) e 1440×900, na dobra da tela e só o topo ampliado.
// Uso: node docs/direcao-tipografica/lab2/capturar.mjs  →  lab2/capturas/
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const base = new URL("./", import.meta.url);
const pasta = fileURLToPath(new URL("./capturas/", base));
mkdirSync(pasta, { recursive: true });
const PAGINAS = (process.argv[2] ? [process.argv[2]] : ["direcao-1-bico", "direcao-2-rotulo"]);
const b = await chromium.launch();
for (const [nome, w, h, s] of [["390", 390, 844, 2], ["1440", 1440, 900, 1]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: s });
  for (const pag of PAGINAS) {
    await p.goto(pathToFileURL(fileURLToPath(new URL(`./${pag}.html`, base))).href, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `${pasta}${pag}-${nome}.png` });
    await p.locator("header").screenshot({ path: `${pasta}${pag}-${nome}-topo.png` });
  }
  await p.close();
}
await b.close();
console.log("ok");
