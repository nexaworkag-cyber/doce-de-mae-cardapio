// Capturas do estudo 4 (neutro, sobre chocolate, construção). Uso: node docs/direcao-tipografica/lettering/capturar-4.mjs
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
const pasta = fileURLToPath(new URL("./capturas/", import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1720, height: 900 } });
await p.goto(pathToFileURL(fileURLToPath(new URL("./estudo-4.html", import.meta.url))).href, { waitUntil: "load" });
for (const id of ["neutro", "marrom", "construcao"]) await p.locator(`#${id}`).screenshot({ path: `${pasta}e4-${id}.png` });
await b.close(); console.log("ok");
