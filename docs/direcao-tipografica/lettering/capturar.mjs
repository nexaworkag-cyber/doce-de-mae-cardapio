// Capturas da prancha de lettering: lado a lado (2400 px de largura) e cada estudo grande com a construção.
// Uso: node docs/direcao-tipografica/lettering/capturar.mjs  →  lettering/capturas/
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const pasta = fileURLToPath(new URL("./capturas/", import.meta.url));
mkdirSync(pasta, { recursive: true });
const url = pathToFileURL(fileURLToPath(new URL("./estudos.html", import.meta.url))).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2400, height: 900 } });
await p.goto(url, { waitUntil: "load" });
await p.locator("#lado-a-lado").screenshot({ path: `${pasta}lado-a-lado.png` });
for (const id of ["e1", "e2", "e3"]) await p.locator(`#${id}`).screenshot({ path: `${pasta}${id}-construcao.png` });
await b.close();
console.log("ok");
