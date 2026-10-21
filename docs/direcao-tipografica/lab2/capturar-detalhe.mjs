// Recortes ampliados do lettering de referência (só consulta).
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
const pasta = fileURLToPath(new URL("./referencias/", import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
await p.goto("https://www.kinadesignstudio.com/green-matcha", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${pasta}gm-detalhe-cartao.png`, clip: { x: 1060, y: 560, width: 150, height: 110 } });
await p.screenshot({ path: `${pasta}gm-detalhe-vertical.png`, clip: { x: 800, y: 620, width: 110, height: 140 } });
await p.goto("https://www.kinadesignstudio.com/projects", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(800);
await p.screenshot({ path: `${pasta}projetos-1440.png` });
await b.close();
