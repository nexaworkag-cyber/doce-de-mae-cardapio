import { getImageProps } from "next/image";
import { LetteringCardapio } from "@/components/LetteringCardapio";
import { Monograma } from "@/components/Monograma";
// Import estático: a URL leva o hash do arquivo, então trocar a imagem nunca serve cache antigo.
import bannerDesktop from "../../../public/banner/topo-desktop.webp";
import bannerCelular from "../../../public/banner/topo-celular.webp";

/**
 * Banner do topo (versão de teste).
 * Imagem e texto separados: a foto é só a base; monograma e lettering são SVG por cima.
 * Art direction com <picture>: recorte 6:5 centrado no doce no celular, recorte horizontal no desktop
 * (matrizes geradas por scripts/gerar-banner.mjs; o Next entrega AVIF/WebP no tamanho de cada tela).
 * A imagem é decorativa (alt vazio): não representa um produto do cardápio. O texto acessível fica no h1.
 */
const comum = { alt: "", quality: 85, priority: true } as const;
const {
  props: { srcSet: srcDesktop, sizes: sizesDesktop },
} = getImageProps({
  ...comum,
  src: bannerDesktop,
  sizes: "(min-width: 1120px) 992px, 94vw",
});
const { props: celular } = getImageProps({
  ...comum,
  src: bannerCelular,
  sizes: "calc(100vw - 2.5rem)",
});

export function Cabecalho() {
  return (
    <header className="moldura pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="painel escuro relative isolate flex flex-col overflow-hidden md:block md:aspect-[2/1]">
        <div className="relative z-10 flex flex-col items-center px-6 pt-7 pb-3 md:absolute md:inset-y-0 md:left-0 md:w-[50%] md:items-start md:justify-center md:px-12 md:py-0">
          <Monograma cor="dourado" sizes="48px" className="h-auto w-9 md:w-10" />
          <h1 className="mt-3 w-full md:mt-4">
            <span className="sr-only">Doce de Mãe — Cardápio</span>
            <LetteringCardapio className="mx-auto block w-full max-w-[19rem] md:mx-0 md:max-w-[26rem]" />
          </h1>
        </div>
        <div className="relative aspect-[6/5] md:absolute md:inset-0 md:aspect-auto">
          <picture>
            <source media="(min-width: 768px)" srcSet={srcDesktop} sizes={sizesDesktop} />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt vazio vem de getImageProps (imagem decorativa) */}
            <img
              {...celular}
              className="absolute inset-0 h-full w-full object-cover object-[50%_45%] md:object-[center_center]"
            />
          </picture>
          {/* véu: funde a foto no chocolate (celular) e dá contraste ao lettering (desktop) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-painel via-painel/20 via-[14%] to-transparent to-[30%] md:bg-linear-to-r md:from-painel/90 md:via-painel/45 md:via-[38%] md:to-transparent md:to-[62%]"
          />
        </div>
      </div>
    </header>
  );
}
