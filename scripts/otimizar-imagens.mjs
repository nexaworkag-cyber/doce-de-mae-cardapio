// Gera as versões web das imagens servidas pelo site estático (GitHub Pages não tem otimizador de imagens).
// - Fotos dos produtos: fotos-originais/*.webp → public/fotos/<nome>-<largura>.webp, nas larguras de LARGURAS
//   (WebP q80). src/lib/carregador-imagens.ts escolhe a largura certa para cada tela.
// - Monograma: public/brand/monograma-*.png (arte oficial, intocada) → public/brand/web/ (192 px de largura, mesma arte).
// Uso: node scripts/otimizar-imagens.mjs
import { readdirSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { LARGURAS_FOTOS as LARGURAS } from "../src/lib/larguras-fotos.mjs";

mkdirSync("public/fotos", { recursive: true });
for (const arquivo of readdirSync("fotos-originais").filter((n) => n.endsWith(".webp"))) {
  const nome = arquivo.replace(/\.webp$/, "");
  for (const largura of LARGURAS) {
    const info = await sharp(`fotos-originais/${arquivo}`)
      .resize({ width: largura, height: largura, fit: "inside", withoutEnlargement: true, kernel: "lanczos3" })
      .webp({ quality: 80, effort: 6, smartSubsample: true })
      .toFile(`public/fotos/${nome}-${largura}.webp`);
    console.log("foto", `${nome}-${largura}`, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} KB`);
  }
}

mkdirSync("public/brand/web", { recursive: true });
for (const cor of ["dourado", "chocolate", "creme"]) {
  const info = await sharp(`public/brand/monograma-${cor}.png`)
    .resize({ width: 192, kernel: "lanczos3" })
    .png({ compressionLevel: 9, palette: true, quality: 95 })
    .toFile(`public/brand/web/monograma-${cor}.png`);
  console.log("monograma", cor, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} KB`);
}
