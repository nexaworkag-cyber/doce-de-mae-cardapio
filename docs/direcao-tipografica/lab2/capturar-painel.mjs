// Gera o painel de referências como imagem: lab2/capturas/painel-referencias.png
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(pathToFileURL(fileURLToPath(new URL("./painel-referencias.html", import.meta.url))).href, { waitUntil: "networkidle" });
await p.screenshot({ path: fileURLToPath(new URL("./capturas/painel-referencias.png", import.meta.url)), fullPage: true });
await b.close();
