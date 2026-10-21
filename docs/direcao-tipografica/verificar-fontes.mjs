// Verifica, nas fontes servidas pelo Google Fonts, o que cada candidata realmente suporta:
// acentos do português, recursos OpenType (liga, dlig, swsh, ssXX…) e eixos variáveis.
// Método: renderiza o mesmo texto com o recurso desligado e ligado e compara os pixels.
// Uso: node docs/direcao-tipografica/verificar-fontes.mjs [completa]
//   sem argumento: arquivos servidos pelo Google Fonts (como o next/font baixa)  →  fontes.json
//   completa: arquivos originais do repositório google/fonts (OFL), sem recorte  →  fontes-completas.json
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";

const FONTES = [
  { nome: "Fraunces", css: "Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1", italico: true, eixos: { SOFT: [0, 100], WONK: [0, 1], opsz: [9, 144], wght: [300, 900] } },
  { nome: "Caprasimo", css: "Caprasimo", italico: false },
  { nome: "Gloock", css: "Gloock", italico: false },
  { nome: "Instrument Serif", css: "Instrument+Serif:ital@0;1", italico: true },
  { nome: "Bodoni Moda", css: "Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900", italico: true, eixos: { opsz: [6, 96], wght: [400, 900] } },
  { nome: "Playfair Display", css: "Playfair+Display:ital,wght@0,400..900;1,400..900", italico: true, eixos: { wght: [400, 900] } },
  { nome: "DM Serif Display", css: "DM+Serif+Display:ital@0;1", italico: true },
  { nome: "Young Serif", css: "Young+Serif", italico: false },
  { nome: "Ballet", css: "Ballet:opsz@16..72", italico: false, eixos: { opsz: [16, 72] } },
  { nome: "Cormorant", css: "Cormorant:ital,wght@0,300..700;1,300..700", italico: true, eixos: { wght: [300, 700] } },
  { nome: "Shrikhand", css: "Shrikhand", italico: false },
];

const COMPLETA = process.argv[2] === "completa";
const REPO = "https://raw.githubusercontent.com/google/fonts/main/ofl/";
const ARQUIVOS = {"Fraunces":["fraunces/Fraunces%5BSOFT,WONK,opsz,wght%5D.ttf","fraunces/Fraunces-Italic%5BSOFT,WONK,opsz,wght%5D.ttf"],"Caprasimo":["caprasimo/Caprasimo-Regular.ttf"],"Gloock":["gloock/Gloock-Regular.ttf"],"Instrument Serif":["instrumentserif/InstrumentSerif-Regular.ttf","instrumentserif/InstrumentSerif-Italic.ttf"],"Bodoni Moda":["bodonimoda/BodoniModa%5Bopsz,wght%5D.ttf","bodonimoda/BodoniModa-Italic%5Bopsz,wght%5D.ttf"],"Playfair Display":["playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf","playfairdisplay/PlayfairDisplay-Italic%5Bwght%5D.ttf"],"DM Serif Display":["dmserifdisplay/DMSerifDisplay-Regular.ttf","dmserifdisplay/DMSerifDisplay-Italic.ttf"],"Young Serif":["youngserif/YoungSerif-Regular.ttf"],"Ballet":["ballet/Ballet%5Bopsz%5D.ttf"],"Cormorant":["cormorant/Cormorant%5Bwght%5D.ttf","cormorant/Cormorant-Italic%5Bwght%5D.ttf"],"Shrikhand":["shrikhand/Shrikhand-Regular.ttf"]};

const RECURSOS = ["liga", "dlig", "calt", "swsh", "salt", "ss01", "ss02", "ss03", "ss04", "ss05", "ss06", "ss07", "ss08", "onum", "smcp", "c2sc", "case", "titl", "frac", "ordn"];
const TEXTO = "Cardápio Doce de Mãe fi fl ff ffi Th ct st sp Qu & ? R K a g y J e 1/2 1º 0123456789 CARDÁPIO";
const ACENTOS = "áãâàçéêíóõôúÁÃÂÇÉÊÍÓÕÚ";

const url = "https://fonts.googleapis.com/css2?" + FONTES.map((f) => "family=" + f.css).join("&") + "&display=block";
const amostra = (familia, estilo, css) =>
  `<span style="font-family:'${familia}';font-style:${estilo};${css}">${TEXTO}</span>`;

let corpo = "";
let id = 0;
const casos = [];
for (const f of FONTES) {
  for (const estilo of f.italico ? ["normal", "italic"] : ["normal"]) {
    for (const r of RECURSOS) {
      const a = id++, b = id++;
      corpo += `<div id="c${a}">${amostra(f.nome, estilo, `font-feature-settings:'${r}' 0`)}</div>`;
      corpo += `<div id="c${b}">${amostra(f.nome, estilo, `font-feature-settings:'${r}' 1`)}</div>`;
      casos.push({ fonte: f.nome, estilo, tipo: "recurso", nome: r, a, b });
    }
    for (const [eixo, [min, max]] of Object.entries(f.eixos ?? {})) {
      const a = id++, b = id++;
      corpo += `<div id="c${a}">${amostra(f.nome, estilo, `font-variation-settings:'${eixo}' ${min}`)}</div>`;
      corpo += `<div id="c${b}">${amostra(f.nome, estilo, `font-variation-settings:'${eixo}' ${max}`)}</div>`;
      casos.push({ fonte: f.nome, estilo, tipo: "eixo", nome: eixo, a, b });
    }
  }
}

const faces = FONTES.flatMap((f) => (ARQUIVOS[f.nome] ?? []).map((p, i) =>
  `@font-face{font-family:"${f.nome}";src:url("${REPO}${p}");font-style:${i ? "italic" : "normal"};font-weight:100 900;font-display:block}`)).join("");
const cabeca = COMPLETA ? `<style>${faces}</style>` : `<link rel="stylesheet" href="${url}">`;
const html = `<!doctype html><html><head><meta charset="utf-8">${cabeca}
<style>body{margin:0;background:#fff;color:#000}div{font-size:40px;white-space:nowrap;padding:4px;width:max-content}</style></head>
<body>${corpo}</body></html>`;

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 2400, height: 900 } });
await pagina.setContent(html, { waitUntil: "networkidle" });
const acentos = await pagina.evaluate(async ({ fontes, texto, acentos }) => {
  for (const f of fontes) {
    for (const estilo of f.italico ? ["normal", "italic"] : ["normal"]) {
      await document.fonts.load(`${estilo} 400 40px "${f.nome}"`, texto + acentos);
    }
  }
  await document.fonts.ready;
  const ctx = document.createElement("canvas").getContext("2d");
  const faltando = {};
  for (const f of fontes) {
    faltando[f.nome] = [...acentos].filter((ch) => {
      ctx.font = `40px "${f.nome}", monospace`;
      const a = ctx.measureText(ch).width;
      ctx.font = `40px "${f.nome}", serif`;
      return Math.abs(a - ctx.measureText(ch).width) > 0.01;
    });
  }
  return faltando;
}, { fontes: FONTES, texto: TEXTO, acentos: ACENTOS });

const resultado = {};
for (const c of casos) {
  const [ia, ib] = await Promise.all([
    pagina.locator(`#c${c.a}`).screenshot(),
    pagina.locator(`#c${c.b}`).screenshot(),
  ]);
  const chave = `${c.fonte}${c.estilo === "italic" ? " Italic" : ""}`;
  resultado[chave] ??= { recursos: [], eixos: [] };
  if (!ia.equals(ib)) resultado[chave][c.tipo === "recurso" ? "recursos" : "eixos"].push(c.nome);
}
await navegador.close();

const saida = { data: new Date().toISOString(), fonte: COMPLETA ? "google/fonts (arquivos completos)" : "Google Fonts (css2)", acentosFaltando: acentos, suportado: resultado };
writeFileSync(new URL(COMPLETA ? "./fontes-completas.json" : "./fontes.json", import.meta.url), JSON.stringify(saida, null, 2));
for (const [nome, r] of Object.entries(resultado)) {
  const base = nome.replace(" Italic", "");
  console.log(`${nome.padEnd(24)} acentos: ${acentos[base].length ? "faltam " + acentos[base].join("") : "ok"} | recursos: ${r.recursos.join(", ") || "—"} | eixos: ${r.eixos.join(", ") || "—"}`);
}
