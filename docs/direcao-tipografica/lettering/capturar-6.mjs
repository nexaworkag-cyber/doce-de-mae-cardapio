// Capturas do estudo 6 (comparação com a referência e testes de cor). Uso: node capturar-5.mjs
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
const pasta = fileURLToPath(new URL("./capturas/", import.meta.url));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1800, height: 900 } });
await p.goto(pathToFileURL(fileURLToPath(new URL("./estudo-6.html", import.meta.url))).href, { waitUntil: "load" });
await p.locator("#comparacao").screenshot({ path: `${pasta}e6-comparacao.png` });
await p.locator("#cores").screenshot({ path: `${pasta}e6-cores.png` });
await b.close(); console.log("ok");
