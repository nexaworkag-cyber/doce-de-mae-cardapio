// Lettering autoral para CARDÁPIO: três estudos desenhados como contornos vetoriais (curvas Bézier cúbicas).
// Nenhuma fonte é usada para as letras. Este script constrói os contornos, faz o espaçamento par a par
// e grava os SVGs finais + a prancha de comparação + a vista de construção (nós e alças).
// Uso: node docs/direcao-tipografica/lettering/gerar.mjs
import { writeFileSync } from "node:fs";

const rad = (d) => (d * Math.PI) / 180;
const r2 = (n) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------------ geometria */
class Forma {
  constructor() { this.subs = []; }
  M(x, y, op = {}) { this.cur = { start: [x, y], segs: [], ...op }; this.subs.push(this.cur); return this; }
  L(x, y) { this.cur.segs.push({ t: "L", p: [x, y] }); return this; }
  C(a, b, c, d, x, y) { this.cur.segs.push({ t: "C", c1: [a, b], c2: [c, d], p: [x, y] }); return this; }
  // arco elíptico (aproximação cúbica por trechos de até 90°), a partir do ponto atual em a0
  A(cx, cy, rx, ry, a0, a1, rot = 0) {
    const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / 90));
    const da = (a1 - a0) / n;
    const tr = ([u, v]) => {
      const x = u * rx, y = v * ry, c = Math.cos(rad(rot)), s = Math.sin(rad(rot));
      return [cx + x * c - y * s, cy + x * s + y * c];
    };
    for (let i = 0; i < n; i++) {
      const t0 = rad(a0 + i * da), t1 = rad(a0 + (i + 1) * da), k = (4 / 3) * Math.tan((t1 - t0) / 4);
      const p0 = [Math.cos(t0), Math.sin(t0)], p1 = [Math.cos(t1), Math.sin(t1)];
      const c1 = tr([p0[0] - k * p0[1], p0[1] + k * p0[0]]), c2 = tr([p1[0] + k * p1[1], p1[1] - k * p1[0]]), p = tr(p1);
      this.C(...c1, ...c2, ...p);
    }
    return this;
  }
  juntar(outra, dx = 0, dy = 0) { for (const s of outra.subs) this.subs.push(mover(s, dx, dy)); return this; }
}
const ponto = (cx, cy, rx, ry, a, rot = 0) => {
  const u = Math.cos(rad(a)) * rx, v = Math.sin(rad(a)) * ry, c = Math.cos(rad(rot)), s = Math.sin(rad(rot));
  return [cx + u * c - v * s, cy + u * s + v * c];
};
const mover = (s, dx, dy) => ({
  ...s,
  start: [s.start[0] + dx, s.start[1] + dy],
  segs: s.segs.map((g) => (g.t === "L" ? { t: "L", p: [g.p[0] + dx, g.p[1] + dy] } : { t: "C", c1: [g.c1[0] + dx, g.c1[1] + dy], c2: [g.c2[0] + dx, g.c2[1] + dy], p: [g.p[0] + dx, g.p[1] + dy] })),
});
function amostrar(s, n = 24) {
  const pts = [s.start];
  let a = s.start;
  for (const g of s.segs) {
    if (g.t === "L") { for (let i = 1; i <= 8; i++) pts.push([a[0] + ((g.p[0] - a[0]) * i) / 8, a[1] + ((g.p[1] - a[1]) * i) / 8]); }
    else for (let i = 1; i <= n; i++) {
      const t = i / n, u = 1 - t;
      pts.push([u * u * u * a[0] + 3 * u * u * t * g.c1[0] + 3 * u * t * t * g.c2[0] + t * t * t * g.p[0], u * u * u * a[1] + 3 * u * u * t * g.c1[1] + 3 * u * t * t * g.c2[1] + t * t * t * g.p[1]]);
    }
    a = g.p;
  }
  return pts;
}
const area = (pts) => pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
function inverter(s) {
  const pontos = [s.start, ...s.segs.map((g) => g.p)];
  const segs = [];
  for (let i = s.segs.length - 1; i >= 0; i--) {
    const g = s.segs[i], de = pontos[i];
    segs.push(g.t === "L" ? { t: "L", p: de } : { t: "C", c1: g.c2, c2: g.c1, p: de });
  }
  return { ...s, start: pontos[pontos.length - 1], segs };
}
// preenchimentos no sentido horário (área > 0 com y para baixo), contraformas no anti-horário: regra nonzero = união + furos
const normalizar = (s) => ((s.furo ? area(amostrar(s)) > 0 : area(amostrar(s)) < 0) ? inverter(s) : s);
const d = (subs) => subs.map((s) => `M${r2(s.start[0])} ${r2(s.start[1])}` + s.segs.map((g) => g.t === "L" ? `L${r2(g.p[0])} ${r2(g.p[1])}` : `C${r2(g.c1[0])} ${r2(g.c1[1])} ${r2(g.c2[0])} ${r2(g.c2[1])} ${r2(g.p[0])} ${r2(g.p[1])}`).join("") + "Z").join("");

/* ---------------------------------------------------------- primitivas de desenho */
const elipse = (f, cx, cy, rx, ry, op = {}, rot = 0) => { f.M(...ponto(cx, cy, rx, ry, 0, rot), op).A(cx, cy, rx, ry, 0, 360, rot); };
const poli = (f, pts, op = {}) => { f.M(...pts[0], op); pts.slice(1).forEach((p) => f.L(...p)); };
const ret = (f, x0, y0, x1, y1, op = {}) => poli(f, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], op);
// faixa entre duas elipses (bojo aberto ou meio bojo), de a0 a a1 por fora e de volta por dentro
function faixa(f, ext, int, a0, a1, op = {}) {
  f.M(...ponto(ext[0], ext[1], ext[2], ext[3], a0), op).A(ext[0], ext[1], ext[2], ext[3], a0, a1);
  f.L(...ponto(int[0], int[1], int[2], int[3], a1)).A(int[0], int[1], int[2], int[3], a1, a0);
}
// gota: ponta redonda em (cx,cy), cauda afinando na direção 'ang' (graus, y para baixo)
function gota(f, cx, cy, r, comp, ang, op = {}) {
  const k = 0.5523, rot = rad(ang + 90), c = Math.cos(rot), s = Math.sin(rot);
  const t = ([x, y]) => [cx + x * c - y * s, cy + x * s + y * c];
  const P = (pts) => pts.map(t).flat();
  f.M(...t([0, -comp]), op)
    .C(...P([[r * 0.14, -comp * 0.55], [r, -r * 1.15], [r, 0]]))
    .C(...P([[r, k * r], [k * r, r], [0, r]]))
    .C(...P([[-k * r, r], [-r, k * r], [-r, 0]]))
    .C(...P([[-r, -r * 1.15], [-r * 0.14, -comp * 0.55], [0, -comp]]));
}

/* -------------------------------------------------- espaçamento por perfil + ajuste óptico */
function perfil(subs) {
  const min = new Map(), max = new Map();
  for (const s of subs) {
    if (s.furo || s.semPerfil) continue;
    for (const [x, y] of amostrar(s, 60)) {
      const b = Math.round(y / 2);
      min.set(b, Math.min(min.get(b) ?? Infinity, x));
      max.set(b, Math.max(max.get(b) ?? -Infinity, x));
    }
  }
  return { min, max };
}
function compor(glifos, folgas) {
  const palavra = [];
  let x = 0, ant = null;
  glifos.forEach((g, i) => {
    const pf = perfil(g.subs);
    if (ant) {
      let req = -Infinity;
      for (const [b, mx] of ant.pf.max) if (pf.min.has(b)) req = Math.max(req, ant.x + mx - pf.min.get(b));
      x = req + folgas[i - 1];
    }
    palavra.push(...g.subs.map((s) => normalizar(mover(s, x, 0))));
    ant = { pf, x };
    (palavra.posicoes ??= []).push(x);
  });
  return palavra;
}
const caixa = (subs) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const s of subs) for (const [x, y] of amostrar(s, 30)) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return { x0, y0, x1, y1 };
};

/* =================================================================================
   ESTUDO 1 · GOTA — minúsculas pesadas e macias, encaixadas por contato.
   Grade: altura-x 100 (linha de base y=0), ascendente 180, descendente 64, haste 34.
   Terminais em gota/bola (a calda que escorre), acento = gota inclinada, pingo do i = bola (não confundir com í).
   ================================================================================= */
function g1(letra) {
  const f = new Forma();
  const bojoA = () => { elipse(f, 50, -49, 49, 53); elipse(f, 45, -47, 20, 35, { furo: true }); };
  const esporao = () => poli(f, [[-14, -91], [2, -104], [2, -82]]);
  switch (letra) {
    case "c":
      faixa(f, [54, -50, 53, 55], [61, -50, 23, 38], -40, -322);
      elipse(f, 90, -82, 17.5, 17.5);
      break;
    case "a": case "á":
      bojoA();
      f.M(68, -101).L(102, -105).L(102, -30).C(102, -14, 108, -8, 121, -10).L(123, -3).C(110, 4, 86, 6, 75, -5).C(70, -10, 68, -19, 68, -32);
      if (letra === "á") gota(f, 74, -152, 13.5, 42, 122);
      break;
    case "r":
      esporao();
      poli(f, [[0, -97], [34, -104], [34, 0], [0, 0]]);
      f.M(30, -60).C(36, -92, 56, -107, 82, -101).L(82, -81).C(62, -88, 46, -80, 34, -48).L(30, -48);
      elipse(f, 84, -88, 17, 17);
      break;
    case "d":
      bojoA();
      poli(f, [[68, 0], [68, -158], [53, -161], [61, -171], [102, -181], [102, 0]]);
      break;
    case "p":
      esporao();
      poli(f, [[0, -97], [34, -104], [34, 66], [0, 58]]);
      elipse(f, 53, -49, 50, 53);
      elipse(f, 59, -47, 20, 35, { furo: true });
      break;
    case "i":
      esporao();
      poli(f, [[0, -97], [34, -104], [34, 0], [0, 0]]);
      elipse(f, 19, -142, 18.5, 18.5);
      break;
    case "o":
      elipse(f, 54, -50, 54, 55);
      elipse(f, 54, -50, 22, 38, { furo: true }, -18);
      break;
  }
  return f;
}

/* =================================================================================
   ESTUDO 2 · VITRINE — versais de alto contraste, estreitas e altas, com ligaduras próprias.
   Grade: versal 160, haste 30, fio 5. O acento do Á nasce do prolongamento do fio esquerdo do A;
   serifa longa liga C→A na linha de base; A e R dividem a serifa; P e I se ligam pelo fio do alto.
   ================================================================================= */
const FIO = 6;
function g2(letra, op = {}) {
  const f = new Forma();
  const serifa = (x0, x1, topo = false, extra = {}) => ret(f, x0, topo ? -160 : -FIO, x1, topo ? -160 + FIO : 0, { semPerfil: true, ...extra });
  switch (letra) {
    case "C":
      faixa(f, [56, -81.5, 56, 81.5], [61, -81.5, 31, 76.5], -40, -270);
      poli(f, [[94, -142], [102, -142], [102, -104], [99.5, -104]]);
      break;
    case "A": case "Á": {
      poli(f, [[55, -166], [61, -166], [6, 0], [0, 0]]);
      poli(f, [[55, -166], [67, -166], [120, 0], [86, 0]]);
      ret(f, 22, -58, 79, -58 + FIO);
      serifa(op.serifaLonga ? -50 : -12, 22, false, op.serifaLonga ? { semPerfil: true } : {});
      serifa(70, op.serifaCompartilhada ? 150 : 134, false, op.serifaCompartilhada ? { semPerfil: true } : {});
      if (letra === "Á") {
        const dx = 0.33, dy = -0.944, px = 0.944, py = 0.33;
        const S = [58 + dx * 22, -166 + dy * 22], E = [S[0] + dx * 42, S[1] + dy * 42];
        poli(f, [[S[0] + px * 1.5, S[1] + py * 1.5], [E[0] + px * 8.5, E[1] + py * 8.5], [E[0] - px * 8.5, E[1] - py * 8.5], [S[0] - px * 1.5, S[1] - py * 1.5]]);
        elipse(f, E[0], E[1], 8.5, 8.5);
      }
      break;
    }
    case "R":
      ret(f, 0, -160, 30, 0); serifa(-12, 30, true); serifa(-12, 46);
      f.M(20, -160).L(30, -160).A(30, -118, 58, 42, -90, 90).L(20, -76).L(20, -81).L(30, -81).A(30, -118, 32, 37, 90, -90).L(20, -155);
      poli(f, [[40, -82], [70, -82], [119, 0], [86, 0]]); serifa(80, 132);
      break;
    case "D":
      ret(f, 0, -160, 30, 0); serifa(-12, 30, true); serifa(-12, 30);
      f.M(20, -160).L(30, -160).A(30, -80, 80, 80, -90, 90).L(20, 0).L(20, -FIO).L(30, -FIO).A(30, -80, 52, 75, 90, -90).L(20, -155);
      break;
    case "P":
      ret(f, 0, -160, 30, 0); serifa(-12, 30, true); serifa(-12, 46);
      f.M(20, -160).L(30, -160).A(30, -114, 60, 46, -90, 90).L(20, -68).L(20, -73).L(30, -73).A(30, -114, 33, 41, 90, -90).L(20, -155);
      break;
    case "I":
      ret(f, 0, -160, 30, 0);
      serifa(op.ligaTopo ? -46 : -14, 44, true, op.ligaTopo ? { semPerfil: true } : {}); serifa(-14, 44);
      break;
    case "O":
      elipse(f, 60, -80, 60, 83);
      elipse(f, 60, -80, 34, 78, { furo: true });
      break;
  }
  return f;
}

/* =================================================================================
   ESTUDO 3 · PENA — cursiva de pena chata, uma linha contínua do c ao o.
   O contraste vem do ângulo da pena (35°): descendentes grossas, subidas finas.
   Cada trecho é a varredura real da pena: o contorno é a curva central deslocada ±meia pena.
   O acento é feito com a pena girada (−45°) para ganhar peso; o pingo do i é um toque curto.
   ================================================================================= */
function varredura(tracos, larg, ang, sx = 1) {
  const formas = [];
  const X = (q) => [q[0] * sx, q[1]];
  for (const t of tracos) {
    const pena = t.pena, inicio = X(t.inicio), segs = t.segs.map((g) => g.map(X));
    const a = rad(pena ?? ang), hx = (larg / 2) * Math.cos(a), hy = -(larg / 2) * Math.sin(a);
    let p0 = inicio;
    for (const [c1, c2, p3] of segs) {
      const f = new Forma();
      const m = (q, s) => [q[0] + s * hx, q[1] + s * hy];
      f.M(...m(p0, 1)).C(...m(c1, 1), ...m(c2, 1), ...m(p3, 1)).L(...m(p3, -1)).C(...m(c2, -1), ...m(c1, -1), ...m(p0, -1));
      formas.push({ subs: f.subs, centro: [p0, c1, c2, p3] });
      p0 = p3;
    }
  }
  return formas;
}
const TRACOS_PENA = [
  // c: gancho no alto, bojo, saída
  { inicio: [52, -82], segs: [[[58, -96], [44, -104], [30, -102]], [[10, -99], [0, -76], [0, -50]], [[0, -18], [16, 2], [38, 1]], [[52, 0], [62, -10], [70, -26]]] },
  // ligação c→a (sobe por fora do bojo)
  { inicio: [70, -26], segs: [[[76, -42], [80, -72], [100, -95]]] },
  // a: laço do bojo + haste com saída
  { inicio: [112, -100], segs: [[[92, -100], [82, -76], [82, -50]], [[82, -20], [96, 2], [114, 1]], [[132, 0], [144, -24], [146, -52]], [[148, -80], [136, -100], [112, -100]]] },
  { inicio: [146, -100], segs: [[[146, -70], [145, -30], [148, -10]], [[150, 0], [160, -2], [172, -18]]] },
  // r: haste subindo, ombro com bandeira, ligação no alto para o d
  { inicio: [172, -18], segs: [[[175, -44], [178, -76], [180, -100]]] },
  { inicio: [181, -68], segs: [[[188, -92], [204, -102], [216, -94]], [[224, -89], [232, -97], [246, -99]]] },
  // d: laço do bojo + ascendente em laço
  { inicio: [268, -100], segs: [[[248, -100], [238, -76], [238, -50]], [[238, -20], [252, 2], [270, 1]], [[288, 0], [300, -24], [302, -52]], [[304, -80], [292, -100], [268, -100]]] },
  { inicio: [302, -60], segs: [[[304, -110], [308, -150], [318, -176]], [[322, -189], [305, -191], [303, -172]], [[299, -130], [301, -40], [303, -12]], [[305, 0], [315, -2], [327, -18]]] },
  // á: ligação, laço, haste, acento (pena girada para dar peso ao acento)
  { inicio: [327, -18], segs: [[[333, -36], [338, -68], [356, -95]]] },
  { inicio: [374, -100], segs: [[[354, -100], [346, -76], [346, -50]], [[346, -20], [360, 2], [378, 1]], [[396, 0], [408, -24], [410, -52]], [[412, -80], [400, -100], [374, -100]]] },
  { inicio: [410, -100], segs: [[[410, -70], [409, -30], [412, -10]], [[414, 0], [424, -2], [436, -18]]] },
  { inicio: [378, -124], pena: -48, segs: [[[384, -134], [392, -144], [400, -154]]] },
  // p: subida, descendente, bojo fechando na haste, ligação para o i
  { inicio: [436, -18], segs: [[[440, -44], [444, -78], [448, -100]], [[448, -60], [446, 20], [444, 62]]] },
  { inicio: [448, -74], segs: [[[458, -96], [486, -104], [496, -74]], [[504, -44], [488, 0], [464, -2]], [[456, -3], [450, -8], [448, -14]]] },
  { inicio: [464, -2], segs: [[[482, 0], [500, -14], [510, -40]], [[514, -60], [517, -82], [521, -100]]] },
  // i: haste, saída, pingo
  { inicio: [521, -100], segs: [[[521, -70], [520, -30], [523, -10]], [[525, 0], [535, -2], [547, -20]]] },
  { inicio: [524, -136], segs: [[[526, -134], [528, -132], [530, -130]]] },
  // o: ligação, laço, arremate para a direita
  { inicio: [547, -20], segs: [[[553, -38], [560, -72], [578, -96]]] },
  { inicio: [590, -100], segs: [[[570, -100], [562, -76], [562, -50]], [[562, -20], [576, 2], [594, 1]], [[612, 0], [624, -24], [624, -52]], [[626, -80], [612, -100], [590, -100]], [[604, -104], [626, -104], [646, -96]]] },
];

/* ------------------------------------------------------------------ montagem */
const estudo1 = compor(["c", "a", "r", "d", "á", "p", "i", "o"].map(g1), [5, 3, 7, 6, 3, 8, 6]);
const estudo2 = compor([
  g2("C"), g2("A", { serifaLonga: true, serifaCompartilhada: true }), g2("R"), g2("D"), g2("Á"), g2("P"), g2("I", { ligaTopo: true }), g2("O"),
], [16, 8, 16, 10, 12, 14, 16]);
{ const p = estudo2.posicoes; const f = new Forma(); ret(f, p[0] + 56, -FIO, p[7] + 60, 0); estudo2.push(normalizar(f.subs[0])); }
const estudo3 = varredura(TRACOS_PENA, 15, 35);

const COR = "#3f2c26", FUNDO = "#eceae5";
function svgDe(subsOuFormas, nome, rotulo, pena = false) {
  const todos = pena ? subsOuFormas.flatMap((f) => f.subs) : subsOuFormas;
  const cx = caixa(todos), m = 14;
  const vb = `${r2(cx.x0 - m)} ${r2(cx.y0 - m)} ${r2(cx.x1 - cx.x0 + 2 * m)} ${r2(cx.y1 - cx.y0 + 2 * m)}`;
  const corpo = pena
    ? subsOuFormas.map((f) => `<path d="${d(f.subs)}"/>`).join("\n  ")
    : `<path fill-rule="nonzero" d="${d(subsOuFormas)}"/>`;
  const extra = pena ? ` stroke="${COR}" stroke-width=".7" stroke-linejoin="round"` : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${rotulo}">\n<title>${rotulo}</title>\n<g fill="${COR}"${extra}>\n  ${corpo}\n</g>\n</svg>\n`;
  writeFileSync(new URL(`./${nome}.svg`, import.meta.url), svg);
  return { svg, vb, cx };
}
const s1 = svgDe(estudo1, "estudo-1-gota", "cardápio — estudo 1, Gota");
const s2 = svgDe(estudo2, "estudo-2-vitrine", "CARDÁPIO — estudo 2, Vitrine");
const s3 = svgDe(estudo3, "estudo-3-pena", "cardápio — estudo 3, Pena", true);

// vista de construção: contorno + nós (quadrados) + alças (círculos)
function construcao(subs, vb, centros = []) {
  let nos = "", alcas = "";
  for (const s of subs) {
    let a = s.start;
    nos += `<rect x="${r2(a[0] - 1.6)}" y="${r2(a[1] - 1.6)}" width="3.2" height="3.2"/>`;
    for (const g of s.segs) {
      if (g.t === "C") {
        alcas += `<path d="M${r2(a[0])} ${r2(a[1])}L${r2(g.c1[0])} ${r2(g.c1[1])}M${r2(g.p[0])} ${r2(g.p[1])}L${r2(g.c2[0])} ${r2(g.c2[1])}"/>`;
        alcas += `<circle cx="${r2(g.c1[0])}" cy="${r2(g.c1[1])}" r="1.3"/><circle cx="${r2(g.c2[0])}" cy="${r2(g.c2[1])}" r="1.3"/>`;
      }
      nos += `<rect x="${r2(g.p[0] - 1.6)}" y="${r2(g.p[1] - 1.6)}" width="3.2" height="3.2"/>`;
      a = g.p;
    }
  }
  const eixo = centros.map(([p0, c1, c2, p3]) => `M${r2(p0[0])} ${r2(p0[1])}C${r2(c1[0])} ${r2(c1[1])} ${r2(c2[0])} ${r2(c2[1])} ${r2(p3[0])} ${r2(p3[1])}`).join("");
  return `<svg viewBox="${vb}"><path d="${d(subs)}" fill="#3f2c2614" stroke="#3f2c26" stroke-width=".6"/>${eixo ? `<path d="${eixo}" fill="none" stroke="#b97874" stroke-width=".8" stroke-dasharray="3 2"/>` : ""}<g fill="none" stroke="#2f7dd1" stroke-width=".45">${alcas}</g><g fill="#2f7dd1">${nos}</g></svg>`;
}

const pranchaHTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Lettering CARDÁPIO: estudos</title>
<style>
  html,body{margin:0;background:${FUNDO};color:#6d655f;font:500 13px/1.4 system-ui,sans-serif}
  .lado{display:grid;grid-template-columns:repeat(3,1fr);gap:72px;align-items:center;padding:110px 90px}
  .lado figure,.grande figure{margin:0} .lado img{width:100%;display:block}
  figcaption{margin-top:28px;letter-spacing:.02em}
  .grande{padding:40px 90px 90px;display:grid;gap:110px}
  .grande img{width:100%;max-height:420px;object-fit:contain;display:block}
  .par{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
  .par svg{width:100%;height:auto;display:block}
</style></head><body>
<section class="lado" id="lado-a-lado">
  <figure><img src="estudo-1-gota.svg" alt="cardápio, estudo 1"><figcaption>1 · Gota</figcaption></figure>
  <figure><img src="estudo-2-vitrine.svg" alt="CARDÁPIO, estudo 2"><figcaption>2 · Vitrine</figcaption></figure>
  <figure><img src="estudo-3-pena.svg" alt="cardápio, estudo 3"><figcaption>3 · Pena</figcaption></figure>
</section>
<section class="grande">
  <div class="par" id="e1"><img src="estudo-1-gota.svg" alt="">${construcao(estudo1, s1.vb)}</div>
  <div class="par" id="e2"><img src="estudo-2-vitrine.svg" alt="">${construcao(estudo2, s2.vb)}</div>
  <div class="par" id="e3"><img src="estudo-3-pena.svg" alt="">${construcao(estudo3.flatMap((f) => f.subs), s3.vb, estudo3.map((f) => f.centro))}</div>
</section>
</body></html>`;
writeFileSync(new URL("./estudos.html", import.meta.url), pranchaHTML);
console.log("ok", { e1: s1.vb, e2: s2.vb, e3: s3.vb });

/* =================================================================================
   ESTUDO 4 · CARAMELO — pedido a partir da referência enviada (alto contraste + terminais em bola).
   "Cardápio" com C maiúsculo. Hastes 30, fios 7–9, bolas r 13–15.
   O C termina num caracol com bola (eco do caracol do D do monograma).
   "Doce de Mãe" em cursiva vetorial (varredura de pena fina), curvada num arco e encaixada
   no vão entre o C e a ascendente do d. Nada de fonte: tudo é contorno.
   ================================================================================= */
// haste com cintura: laterais côncavas (c = recuo no meio); dt/db = desnível do topo/base (esquerda mais baixa)
function haste(f, x0, y0, x1, y1, c = 1.6, dt = 0, db = 0) {
  const ym = (y0 + y1) / 2;
  f.M(x0, y0 + dt).L(x1, y0).C(x1 - c, y0 + (ym - y0) * 0.6, x1 - c, y1 - (y1 - ym) * 0.6, x1, y1 + db).L(x0, y1).C(x0 + c, y1 - (y1 - ym) * 0.6, x0 + c, y0 + (ym - y0) * 0.6, x0, y0 + dt);
}
function g4(letra) {
  const f = new Forma();
  const aDuplo = () => {
    faixa(f, [50, -66, 42, 36], [48, -66, 22, 29], 0, -150);
    elipse(f, 21, -81, 13.5, 13.5);
    haste(f, 62, -66, 92, 0, 1.2);
    elipse(f, 38, -32, 38, 33);
    elipse(f, 40, -31, 17, 24.5, { furo: true });
  };
  switch (letra) {
    case "C":
      faixa(f, [64, -75, 64, 78], [70, -75, 38, 71], -60, -310);
      f.M(96, -142.5).C(110, -138, 119, -128, 117, -114).L(107, -114).C(107, -125, 101, -132, 89, -136.5);
      elipse(f, 104, -112, 14, 14);
      break;
    case "a": aDuplo(); break;
    case "á": aDuplo(); gota(f, 58, -134, 11.5, 38, 122); break;
    case "r":
      haste(f, 0, -100, 30, 0);
      f.M(26, -76).C(36, -97, 52, -105, 68, -100).L(68, -91).C(54, -95, 42, -89, 30, -68).L(26, -68);
      elipse(f, 69, -88, 14, 14);
      break;
    case "d":
      elipse(f, 44, -50, 44, 52);
      elipse(f, 42, -50, 20, 44, { furo: true });
      haste(f, 62, -168, 92, 0, 2, 9);
      break;
    case "p":
      haste(f, 0, -100, 30, 54, 2, 0, 6);
      elipse(f, 58, -50, 44, 52);
      elipse(f, 60, -50, 20, 44, { furo: true });
      break;
    case "i":
      haste(f, 0, -100, 30, 0);
      elipse(f, 15, -133, 15, 15);
      break;
    case "o":
      elipse(f, 48, -50, 48, 52);
      elipse(f, 48, -50, 22, 44, { furo: true });
      break;
  }
  return f;
}
const estudo4 = compor(["C", "a", "r", "d", "á", "p", "i", "o"].map(g4), [3, 5, 6, 6, 5, 12, 6]);

// cursiva da assinatura (esqueletos em unidades de altura-x 100; maiúsculas 150)
const laco = (ox) => [[ox + 28, -100], [[[ox + 8, -100], [ox, -76], [ox, -50]], [[ox, -20], [ox + 14, 2], [ox + 32, 1]], [[ox + 50, 0], [ox + 62, -24], [ox + 62, -52]], [[ox + 64, -80], [ox + 50, -100], [ox + 28, -100]]]];
const CURSIVA = {
  D: (ox) => [[[ox + 22, -148], [[[ox + 22, -100], [ox + 20, -40], [ox + 16, 0]]]], [[ox + 16, 0], [[[ox + 86, 6], [ox + 112, -44], [ox + 104, -92]], [[ox + 96, -142], [ox + 48, -158], [ox - 2, -144]], [[ox - 18, -140], [ox - 16, -122], [ox, -124]]]]],
  o: (ox) => [laco(ox), [[ox + 28, -100], [[[ox + 42, -104], [ox + 60, -104], [ox + 76, -96]]]]],
  c: (ox) => [[[ox + 48, -82], [[[ox + 54, -96], [ox + 42, -104], [ox + 28, -102]], [[ox + 8, -99], [ox, -76], [ox, -50]], [[ox, -18], [ox + 16, 2], [ox + 36, 1]], [[ox + 50, 0], [ox + 60, -10], [ox + 68, -24]]]]],
  e: (ox) => [[[ox + 4, -36], [[[ox + 30, -40], [ox + 52, -56], [ox + 50, -80]], [[ox + 48, -102], [ox + 20, -104], [ox + 8, -80]], [[ox - 4, -56], [ox + 2, -10], [ox + 28, 0]], [[ox + 44, 4], [ox + 58, -6], [ox + 68, -22]]]]],
  d: (ox) => [laco(ox), [[ox + 62, -60], [[[ox + 64, -110], [ox + 66, -150], [ox + 70, -176]], [[ox + 66, -150], [ox + 64, -60], [ox + 66, -12]], [[ox + 68, 0], [ox + 78, -2], [ox + 90, -18]]]]],
  M: (ox) => [[[ox, 0], [[[ox + 6, -50], [ox + 12, -110], [ox + 22, -148]], [[ox + 30, -100], [ox + 40, -50], [ox + 48, -20]], [[ox + 56, -60], [ox + 66, -110], [ox + 78, -148]], [[ox + 80, -100], [ox + 80, -40], [ox + 84, -10]], [[ox + 86, 0], [ox + 96, -2], [ox + 108, -18]]]]],
  ã: (ox) => [laco(ox), [[ox + 62, -100], [[[ox + 62, -70], [ox + 61, -30], [ox + 64, -10]], [[ox + 66, 0], [ox + 76, -2], [ox + 88, -18]]]], [[ox + 10, -128], [[[ox + 18, -146], [ox + 34, -118], [ox + 48, -136]]]]],
};
const ASSINATURA = [["D", 0], ["o", 120], ["c", 196], ["e", 258], ["d", 352], ["e", 440], ["M", 540], ["ã", 650], ["e", 740]];
function assinaturaEmArco(cx, base, largura, raio) {
  const comp = 808, k = largura / comp;
  const tracos = ASSINATURA.flatMap(([l, ox]) => CURSIVA[l](ox)).map(([ini, segs]) => ({ inicio: ini, segs }));
  const arco = ([x, y]) => {
    const X = (x - comp / 2) * k, Y = y * k, t = X / raio;
    return [cx + (raio - Y) * Math.sin(t), base + raio - (raio - Y) * Math.cos(t)];
  };
  return varredura(tracos.map((t) => ({ inicio: arco(t.inicio), segs: t.segs.map((g) => g.map(arco)) })), 16 * k, 35);
}
const p4 = estudo4.posicoes;
const vaoIni = p4[0] + 132, vaoFim = p4[3] + 54;
const assinatura = assinaturaEmArco((vaoIni + vaoFim) / 2, -122, (vaoFim - vaoIni) * 0.9, 260);
const todos4 = [...estudo4, ...assinatura.flatMap((a) => a.subs)];
{
  const cx = caixa(todos4), m = 16;
  const vb = `${r2(cx.x0 - m)} ${r2(cx.y0 - m)} ${r2(cx.x1 - cx.x0 + 2 * m)} ${r2(cx.y1 - cx.y0 + 2 * m)}`;
  const corpo = (cor) => `<path fill="${cor}" d="${d(estudo4)}"/><g fill="${cor}" stroke="${cor}" stroke-width=".35" stroke-linejoin="round">${assinatura.map((a) => `<path d="${d(a.subs)}"/>`).join("")}</g>`;
  writeFileSync(new URL("./estudo-4-caramelo.svg", import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="Cardápio — Doce de Mãe, estudo 4, Caramelo"><title>Cardápio — Doce de Mãe</title>${corpo(COR)}</svg>\n`);
  writeFileSync(new URL("./estudo-4.html", import.meta.url), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Estudo 4 · Caramelo</title><style>
html,body{margin:0;font:500 13px system-ui,sans-serif;color:#6d655f}
section{padding:90px 110px;display:grid;place-items:center} svg{width:100%;max-width:1500px;height:auto;display:block}
#neutro{background:${FUNDO}} #marrom{background:#52352f} .rot{justify-self:start;margin-top:26px}
#construcao{background:${FUNDO}}
</style></head><body>
<section id="neutro"><svg viewBox="${vb}">${corpo(COR)}</svg><p class="rot">4 · Caramelo</p></section>
<section id="marrom"><svg viewBox="${vb}">${corpo("#fff4c7")}</svg></section>
<section id="construcao">${construcao(todos4, vb, assinatura.map((a) => a.centro))}</section>
</body></html>`);
  console.log("estudo 4", vb);
}
