// Converte "Doce de Mãe" em contornos usando a Fraunces (SIL OFL) na instância SemiBold, Soft 100, opsz 72,
// a mesma família da linha de apoio da referência. Saída: assinatura.json (path em unidades de corpo 100, linha de base y=0).
// A fonte não é embutida: só os contornos do texto. Uso: node docs/direcao-tipografica/lettering/assinatura-fraunces.mjs
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
const TEXTO = "Doce de Mãe";
const EIXOS = process.argv[2] ?? "opsz,wght,SOFT@72,600,100";
const SAIDA = process.argv[3] ?? "assinatura.json";
const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Fraunces:${EIXOS}&text=${encodeURIComponent(TEXTO)}`)).text();
const url = css.match(/url\(([^)]+)\)/)[1];
const b = await chromium.launch(); const p = await b.newPage();
await p.setContent(`<script src="https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js"></script>`, { waitUntil: "networkidle" });
const r = await p.evaluate(async ({ url, TEXTO }) => {
  const buf = await (await fetch(url)).arrayBuffer();
  const f = opentype.parse(buf);
  const caminho = f.getPath(TEXTO, 0, 0, 100, { kerning: true });
  return { comandos: caminho.commands, d: caminho.toPathData(2), largura: f.getAdvanceWidth(TEXTO, 100, { kerning: true }), caixa: caminho.getBoundingBox(), nome: f.names.fullName?.en };
}, { url, TEXTO });
await b.close();
writeFileSync(new URL("./" + SAIDA, import.meta.url), JSON.stringify(r, null, 1));
console.log(r.nome, r.largura, r.caixa);
