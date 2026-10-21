// Capturas das propostas do topo em 375 px (2x) e 1280 px.
// Uso: node docs/direcao-tipografica/capturar.mjs  →  docs/direcao-tipografica/capturas/
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const pasta = fileURLToPath(new URL("./capturas/", import.meta.url));
mkdirSync(pasta, { recursive: true });
const pagina = pathToFileURL(fileURLToPath(new URL("./propostas.html", import.meta.url))).href;
const PRANCHETAS = ["atual", "proposta-a", "proposta-b", "proposta-c"];

const navegador = await chromium.launch();
for (const [nome, largura, escala] of [["375", 375, 2], ["1280", 1280, 1]]) {
  const p = await navegador.newPage({ viewport: { width: largura, height: 900 }, deviceScaleFactor: escala });
  await p.goto(pagina, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  for (const id of PRANCHETAS) {
    await p.locator(`#${id}`).screenshot({ path: `${pasta}${id}-${nome}.png` });
  }
  await p.close();
}
await navegador.close();
console.log("ok", pasta);
