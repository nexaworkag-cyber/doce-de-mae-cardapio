// Gera as versões do banner do topo a partir da imagem original, com recorte por formato (art direction).
// Usa o sharp que já vem com o Next (nenhuma dependência nova). Rode de novo quando trocar a imagem:
//   node scripts/gerar-banner.mjs [public/banner/original/arquivo.webp]
// Saída: public/banner/topo-celular.webp (6:5, foco no doce) e public/banner/topo-desktop.webp (horizontal).
// O Next gera AVIF/WebP em várias larguras a partir dessas matrizes (next.config.ts → images).
import sharp from "sharp";

const ORIGEM = process.argv[2] ?? "public/banner/original/topo-bolo.webp";
const meta = await sharp(ORIGEM).metadata();
const W = meta.width, H = meta.height;

// Recortes em frações da imagem original (ajuste aqui se trocar a foto).
const CORTES = {
  // celular: 6:5 centrado no bolo (o bolo ocupa ~46%–85% da largura)
  celular: { esquerda: 0.36, topo: 0.0, largura: 0.6, proporcao: 6 / 5, saida: 1080 },
  // desktop: imagem inteira (2:1), mesma proporção do cartão no desktop, mantendo os morangos do topo
  desktop: { esquerda: 0.0, topo: 0.0, largura: 1.0, proporcao: 2, saida: W },
};

for (const [nome, c] of Object.entries(CORTES)) {
  const largura = Math.round(W * c.largura);
  const altura = Math.min(H, Math.round(largura / c.proporcao));
  const left = Math.min(W - largura, Math.round(W * c.esquerda));
  const top = Math.min(H - altura, Math.round(H * c.topo));
  const info = await sharp(ORIGEM)
    .extract({ left, top, width: largura, height: altura })
    .resize({ width: Math.min(c.saida, largura), withoutEnlargement: true, kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.6, m2: 1.4 })
    .webp({ quality: 90, effort: 6, smartSubsample: true })
    .toFile(`public/banner/topo-${nome}.webp`);
  console.log(nome, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} KB`);
}
