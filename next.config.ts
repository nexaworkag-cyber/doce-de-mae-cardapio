import type { NextConfig } from "next";

/**
 * Site estático para o GitHub Pages (`next build` gera a pasta out/).
 * NEXT_PUBLIC_BASE_PATH: subcaminho quando o site é servido em usuario.github.io/<repositorio>.
 * Com domínio próprio, fica vazio.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // cacheComponents/partialPrefetching ficam desligados: o export estático não aceita pré-renderização parcial
  // (e a página é toda estática, sem dados dinâmicos).
  poweredByHeader: false,
  images: {
    // Sem servidor não há otimizador: as versões das fotos são pré-geradas (scripts/otimizar-imagens.mjs)
    // e o carregador escolhe a largura certa para cada tela.
    loader: "custom",
    loaderFile: "./src/lib/carregador-imagens.ts",
    // 85 para o banner do topo; 75 é o padrão das demais imagens.
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
