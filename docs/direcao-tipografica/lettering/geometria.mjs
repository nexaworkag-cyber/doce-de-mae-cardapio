// Geometria compartilhada pelos estudos de lettering (contornos Bézier, normalização, espaçamento por perfil).
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


export { rad, r2, Forma, ponto, mover, amostrar, area, inverter, normalizar, d, elipse, poli, ret, faixa, gota, perfil, compor, caixa };
