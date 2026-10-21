// ESTUDO 5 · "cardápio" no estilo da referência YUMM (lettering próprio, desenhado com as regras medidas nela).
// Medidas tiradas da silhueta da referência, em unidades de altura-x 100:
//   haste ≈ 27 · contraforma ≈ 15 (fenda estreita) · topo de arco/bojo ≈ 15 · fundo de bojo ≈ 38 (peso embaixo)
//   topos das hastes cortados levemente inclinados · pés retos · fundo das letras estufa e encosta na vizinha
//   o rabo do y desce, faz a curva e varre para a direita sob as letras seguintes → aplicado ao p.
// Uso: node docs/direcao-tipografica/lettering/estudo5.mjs  (grava estudo-5-yumm.svg e estudo-5.html)
import { writeFileSync, readFileSync } from "node:fs";
import { Forma, elipse, poli, compor, caixa, d, r2, amostrar } from "./geometria.mjs";


// Cada letra é UM contorno explícito (curvas Bézier), modelado nas proporções medidas no u e no m da referência:
// laterais retas, fundos redondos e largos que estufam para a direita, topos de arco finos (≈15), contraformas em fenda (15)
// com cunha ("ink trap") onde o arco encontra a haste, topos das hastes cortados levemente inclinados.
function glifo(letra) {
  const f = new Forma();
  // fenda fechada (contraforma) de x0 a x0+15, com cunha opcional subindo junto da haste
  const contra = (x0, cunha) => {
    const x1 = x0 + 15, cx = x0 + 7.5;
    f.M(x1, -42, { furo: true }).C(x1, -37, x1 - 3, -34, cx, -34).C(x0 + 3, -34, x0, -37, x0, -42);
    if (cunha === "esq") f.L(x0, -94).C(x0 + 2, -89, x0 + 4, -86.5, cx, -86).C(x1 - 3, -86, x1, -84, x1, -78);
    else if (cunha === "dir") f.L(x0, -78).C(x0, -84, x0 + 3, -86, cx, -86).C(x1 - 4, -86.5, x1 - 2, -89, x1, -94);
    else f.L(x0, -78).C(x0, -84, x0 + 3, -86, cx, -86).C(x1 - 3, -86, x1, -84, x1, -78);
    f.L(x1, -42);
  };
  // fenda do a: topo mais baixo (bojo baixo), cunha subindo junto da haste
  const contraA = () => {
    f.M(45, -42, { furo: true }).C(45, -37, 42, -34, 37.5, -34).C(33, -34, 30, -37, 30, -42).L(30, -68)
     .C(30, -74, 33, -76.5, 37.5, -76.5).C(41, -77, 43, -79, 45, -84).L(45, -42);
  };
  // corpo de a/á/d: bojo à esquerda, haste à direita (x 45–72) e fundo que estufa até x≈77
  const corpoA = (topoHaste) => {
    f.M(45, topoHaste).L(72, topoHaste + 3).L(72, -62).C(72, -48, 78, -42, 77, -29).C(76, -9, 59, 2.5, 37, 2.5)
     .C(14, 2.5, 0, -14, 0, -40).L(0, -56).C(0, -77, 14, -91, 32, -91).C(38, -91, 42, -89, 45, -85);
    contraA();
  };
  switch (letra) {
    case "c":
      f.M(62, -91).C(55, -99, 47, -102, 37, -102).C(15, -102, 0, -86, 0, -62).L(0, -40).C(0, -14, 16, 2.5, 39, 2.5)
       .C(59, 2.5, 73, -10, 76, -29).L(57, -33).C(51, -34, 46, -34, 37.5, -34).C(33, -34, 30, -37, 30, -42).L(30, -78)
       .C(30, -84, 33, -86, 37.5, -86).C(44, -86, 48, -85.5, 52, -81);
      break;
    case "a": corpoA(-100); break;
    case "á": corpoA(-100); poli(f, [[30, -117], [46, -117], [63, -147], [47, -147]]); break;
    case "d": corpoA(-152); break;
    case "r":
      f.M(0, -100).L(27, -97).C(33, -101.5, 41, -103.5, 49, -103).C(56, -102.5, 61, -99, 63, -94).L(61, -74).C(51, -80, 41, -79, 35, -73).C(31, -69, 29, -65, 27, -60).L(27, 0).L(0, 0);
      break;
    case "p":
      // haste + bojo (espelho do a, sem o estufado), descendo até o rabo
      f.M(0, -100).L(27, -97).C(29.5, -100, 33.5, -101.5, 39, -101.5).C(57, -101.5, 72, -86, 72, -62).L(72, -40)
       .C(72, -14, 58, 2.5, 35, 2.5).C(31, 2.5, 29, 2, 27, 1).L(27, 10).L(0, 10);
      contra(27, "esq");
      // rabo à moda do y: desce, faz a curva larga e varre para a direita afinando até a ponta voltada para cima
      f.M(0, 6, { semPerfil: true }).C(0, 48, -26, 96, 12, 110).C(66, 126, 140, 84, 174, 22).C(136, 72, 82, 92, 36, 87).C(12, 84, 26, 50, 27, 6);
      break;
    case "i":
      f.M(0, -100).L(27, -97).L(27, 0).L(0, 0);
      elipse(f, 13.5, -129, 14, 14);
      break;
    case "o":
      f.M(37, -102).C(59, -102, 74, -86, 74, -62).L(74, -40).C(74, -14, 60, 2.5, 37, 2.5).C(14, 2.5, 0, -14, 0, -40).L(0, -62).C(0, -86, 15, -102, 37, -102);
      contra(29.5);
      break;
  }
  return f;
}

// encostos: a→r, d→á e á→p se tocam pelo fundo estufado (folga negativa); o resto fica justo
const FOLGAS = [-2, -3, 3, -3, 5, 4, 2];
const palavra = compor(["c", "a", "r", "d", "á", "p", "i", "o"].map(glifo), FOLGAS);

// assinatura "Doce de Mãe" (Fraunces SemiBold Soft, OFL) sob "card", alinhada à esquerda
const ass = JSON.parse(readFileSync(new URL("./assinatura.json", import.meta.url)));
const escalaAss = 0.36, assX = 2, assY = 62;

const cx = caixa(palavra), m = 18;
const x0 = Math.min(cx.x0, assX) - m, y0 = cx.y0 - m, x1 = cx.x1 + m, y1 = Math.max(cx.y1, assY + 2) + m;
const vb = `${r2(x0)} ${r2(y0)} ${r2(x1 - x0)} ${r2(y1 - y0)}`;
const arte = (cor) => `<path fill="${cor}" fill-rule="nonzero" d="${d(palavra)}"/><path fill="${cor}" transform="translate(${assX} ${assY}) scale(${escalaAss})" d="${ass.d}"/>`;
writeFileSync(new URL("./estudo-5-yumm.svg", import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="cardápio — Doce de Mãe"><title>cardápio — Doce de Mãe</title>${arte("#52352f")}</svg>\n`);

// prancha de comparação com a referência (só para avaliação; a referência fica fora do repositório)
const ref = process.argv[2];
const refImg = ref ? `data:image/png;base64,${readFileSync(ref).toString("base64")}` : "";
writeFileSync(new URL("./estudo-5.html", import.meta.url), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Estudo 5</title><style>
html,body{margin:0;font:500 13px system-ui,sans-serif;color:#6d655f;background:#eceae5}
.par{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;padding:50px 60px}
.par img,.par svg{width:100%;height:auto;display:block} .cores{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0}
.cores div{padding:60px 50px} .cores svg{width:100%;height:auto;display:block}
</style></head><body>
<section class="par" id="comparacao">${refImg ? `<img src="${refImg}" alt="referência">` : "<div></div>"}<svg viewBox="${vb}">${arte("#000")}</svg></section>
<section class="cores" id="cores">
 <div style="background:#e9b52a"><svg viewBox="${vb}">${arte("#5b1f24")}</svg></div>
 <div style="background:#52352f"><svg viewBox="${vb}">${arte("#fff4c7")}</svg></div>
 <div style="background:#fff4c7"><svg viewBox="${vb}">${arte("#52352f")}</svg></div>
</section></body></html>`);
console.log("ok", vb, amostrar(palavra[0]).length > 0);
