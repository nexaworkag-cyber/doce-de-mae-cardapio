// Serve a pasta out/ (export estático) como o GitHub Pages faria, para testar localmente.
// Uso: node scripts/servir-estatico.mjs [porta] [subcaminho]   ex.: node scripts/servir-estatico.mjs 3200 /doce-de-mae-cardapio
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const porta = Number(process.argv[2] ?? 3200);
const base = (process.argv[3] ?? "").replace(/\/$/, "");
const raiz = join(process.cwd(), "out");
const tipos = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  let caminho = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (base) {
    if (!caminho.startsWith(base)) return void res.writeHead(404).end();
    caminho = caminho.slice(base.length) || "/";
  }
  let arquivo = normalize(join(raiz, caminho));
  if (!arquivo.startsWith(raiz)) return void res.writeHead(403).end();
  try {
    if ((await stat(arquivo)).isDirectory()) arquivo = join(arquivo, "index.html");
    res.writeHead(200, { "content-type": tipos[extname(arquivo)] ?? "application/octet-stream" });
    res.end(await readFile(arquivo));
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(await readFile(join(raiz, "404.html")).catch(() => "404"));
  }
}).listen(porta, () => console.log(`out/ em http://localhost:${porta}${base}/`));
