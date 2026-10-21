import type { ImageLoaderProps } from "next/image";
import { LARGURAS_FOTOS } from "./larguras-fotos.mjs";

/**
 * Carregador de imagens para o site estático (GitHub Pages não roda o otimizador do Next).
 * - Fotos de produto (/fotos/x.webp): aponta para a versão pré-gerada mais próxima da largura pedida.
 * - Monograma (/brand/monograma-*.png): versão web leve da mesma arte.
 * - O resto (banner, importado com hash): o arquivo como está.
 * O prefixo do subcaminho (NEXT_PUBLIC_BASE_PATH) entra aqui, porque o next/image não o aplica a caminhos em texto.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function carregadorImagens({ src, width }: ImageLoaderProps): string {
  if (src.startsWith("/fotos/")) {
    const largura = LARGURAS_FOTOS.find((l) => l >= width) ?? LARGURAS_FOTOS[LARGURAS_FOTOS.length - 1];
    return `${BASE}${src.replace(/\.webp$/, `-${largura}.webp`)}`;
  }
  if (src.startsWith("/brand/monograma-")) return `${BASE}${src.replace("/brand/", "/brand/web/")}`;
  // Importação estática: o Next já inclui o basePath no caminho. O ?w= só registra a largura pedida.
  return `${src}?w=${width}`;
}
