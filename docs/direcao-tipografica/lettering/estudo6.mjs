// ESTUDO 6 · "Cardápio" no estilo da referência Bakaré (lettering próprio, desenhado com as regras medidas nela).
// Medidas da silhueta do toldo (altura-x = 100): haste ≈ 26 · fio ≈ 7 · versal ≈ 155 · ascendente ≈ 158.
// Traços da família: bandeira (serifa em cunha) no alto das hastes, saindo para a esquerda; pé levemente alargado;
// terminais em gota alongada (a, r, acento); a versal termina em caracol para dentro (como o bojo de baixo do B);
// assinatura fina em arco ao redor do fim da palavra (como "The art of baking").
// Uso: node estudo6.mjs [referencia.png]  →  estudo-6-bakare.svg, estudo-6.html
import { writeFileSync, readFileSync } from "node:fs";
import { Forma, elipse, faixa, gota, compor, caixa, d, r2 } from "./geometria.mjs";

// haste com laterais levemente côncavas e pé alargado
function haste(f, x0, x1, yT, yB, alarga = 3.5, cintura = 1.4) {
  const ym = (yT + yB) / 2;
  f.M(x0, yT).L(x1, yT)
    .C(x1 - cintura, yT + (ym - yT) * 0.7, x1 - cintura, ym + (yB - ym) * 0.4, x1 + alarga, yB)
    .L(x0 - alarga, yB)
    .C(x0 + cintura, ym + (yB - ym) * 0.4, x0 + cintura, yT + (ym - yT) * 0.7, x0, yT);
}
// bandeira: cunha no alto da haste, ponta à esquerda, topo subindo para a direita
function bandeira(f, x0, yT, larg = 26) {
  f.M(x0 + 2, yT + 30).C(x0 - 2, yT + 18, x0 - 9, yT + 10, x0 - 18, yT + 7).L(x0 + larg, yT - 3).L(x0 + larg, yT + 14).L(x0 + 2, yT + 14);
}

function glifo(letra) {
  const f = new Forma();
  const aDuplo = () => {
    // ombro: faixa do alto da haste curvando para a esquerda, terminando em gota pendurada
    faixa(f, [50, -60, 40, 42], [47, -57, 16, 31], 0, -158);
    gota(f, 16, -71, 16.5, 34, -62);
    haste(f, 61, 90, -60, 0, 4);
    elipse(f, 39, -31, 38, 33.5);
    elipse(f, 41, -28.5, 15, 21.5, { furo: true });
  };
  switch (letra) {
    case "C": {
      // bojo do C até embaixo; em cima, gota pendurada (como o a); embaixo, cauda afilada subindo (como o é)
      faixa(f, [66, -77.5, 66, 80], [74, -77.5, 38, 72.5], -52, -270);
      gota(f, 101, -121, 15.5, 36, -95);
      f.M(66, 2.5).C(92, 2.5, 112, -10, 124, -34).C(108, -16, 92, -5, 74, -5);
      break;
    }
    case "a": aDuplo(); break;
    case "á": aDuplo(); gota(f, 66, -138, 13, 44, 124); break;
    case "r":
      haste(f, 0, 29, -100, 0, 4);
      bandeira(f, 0, -100, 29);
      f.M(27, -70).C(37, -95, 55, -104, 73, -101).L(73, -88).C(57, -91, 44, -85, 29, -59);
      gota(f, 80, -94, 16.5, 38, 186);
      break;
    case "d":
      elipse(f, 42, -50, 42, 52);
      elipse(f, 39, -50, 17, 43, { furo: true });
      haste(f, 59, 88, -158, 0, 4);
      bandeira(f, 59, -158, 29);
      break;
    case "p":
      haste(f, 0, 29, -100, 46, 4);
      bandeira(f, 0, -100, 29);
      elipse(f, 59, -50, 42, 52);
      elipse(f, 61, -50, 17, 43, { furo: true });
      break;
    case "i":
      haste(f, 0, 29, -100, 0, 4);
      bandeira(f, 0, -100, 29);
      elipse(f, 15.5, -132, 15, 15);
      break;
    case "o":
      elipse(f, 46, -50, 46, 52);
      elipse(f, 46, -50, 19, 43, { furo: true });
      break;
  }
  return f;
}

const FOLGAS = [7, 5, 7, 6, 5, 8, 6];
const palavra = compor(["C", "a", "r", "d", "á", "p", "i", "o"].map(glifo), FOLGAS);
const pos = palavra.posicoes;

// assinatura em arco ao redor do "o" final (comandos da Fraunces Regular, deformados ao longo do arco)
const ass = JSON.parse(readFileSync(new URL("./assinatura-arco.json", import.meta.url)));
const oc = [pos[7] + 46, -50], R = 116, esc = 0.34, a0 = -110; // graus: começa acima do "i", desce à direita do "o"
const arco = (x, y) => {
  const t = ((a0 * Math.PI) / 180) + (x * esc) / R, raio = R - y * esc;
  return [oc[0] + raio * Math.cos(t), oc[1] + raio * Math.sin(t)];
};
let assD = "";
for (const c of ass.comandos) {
  if (c.type === "M" || c.type === "L") assD += c.type + arco(c.x, c.y).map(r2).join(" ");
  else if (c.type === "Q") assD += "Q" + [...arco(c.x1, c.y1), ...arco(c.x, c.y)].map(r2).join(" ");
  else if (c.type === "C") assD += "C" + [...arco(c.x1, c.y1), ...arco(c.x2, c.y2), ...arco(c.x, c.y)].map(r2).join(" ");
  else if (c.type === "Z") assD += "Z";
}

const cx = caixa(palavra), m = 22;
const x1 = Math.max(cx.x1, oc[0] + R + 22), y0 = Math.min(cx.y0, oc[1] - R - 22);
const vb = `${r2(cx.x0 - m)} ${r2(y0 - m)} ${r2(x1 - cx.x0 + 2 * m)} ${r2(cx.y1 - y0 + 2 * m)}`;
const arte = (cor) => `<path fill="${cor}" d="${d(palavra)}"/><path fill="${cor}" d="${assD}"/>`;
writeFileSync(new URL("./estudo-6-bakare.svg", import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="Cardápio — Doce de Mãe"><title>Cardápio — Doce de Mãe</title>${arte("#52352f")}</svg>\n`);

const ref = process.argv[2];
const refImg = ref ? `data:image/png;base64,${readFileSync(ref).toString("base64")}` : "";
writeFileSync(new URL("./estudo-6.html", import.meta.url), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Estudo 6</title><style>
html,body{margin:0;font:500 13px system-ui,sans-serif;background:#eceae5}
#comparacao{display:grid;grid-template-columns:1fr;gap:30px;padding:40px 60px}#comparacao img,#comparacao svg{width:100%;max-width:1400px;height:auto;display:block}
#cores{display:grid;grid-template-columns:1fr 1fr;gap:0}#cores div{padding:70px 60px}#cores svg{width:100%;height:auto;display:block}
</style></head><body>
<section id="comparacao">${refImg ? `<img src="${refImg}" alt="referência">` : ""}<svg viewBox="${vb}">${arte("#000")}</svg></section>
<section id="cores"><div style="background:#7a1f22"><svg viewBox="${vb}">${arte("#fff8ef")}</svg></div><div style="background:#52352f"><svg viewBox="${vb}">${arte("#fff4c7")}</svg></div></section>
</body></html>`);
console.log("ok", vb);
