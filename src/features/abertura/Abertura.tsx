import type { CSSProperties } from "react";
import { Monograma } from "@/components/Monograma";
import { Icone } from "@/components/Icone";

/**
 * Abertura: monograma dourado sobre chocolate (combinação principal da marca) e o nome por extenso.
 * Fica presa ao topo; a folha creme do cardápio sobe por cima dela ao rolar.
 * Quando houver uma foto macro real, ela entra aqui (ver docs/DIRECAO-VISUAL.md §Fotografia).
 */
export function Abertura() {
  return (
    <header className="escuro sticky top-0 z-0 h-svh min-h-[36rem] overflow-hidden bg-chocolate text-creme">
      {/* luz quente vinda do alto, como nas pranchas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_60%_at_78%_8%,rgb(222_197_141/0.16),transparent_70%)]"
      />
      <div className="abertura-palco moldura relative grid h-full grid-rows-[1fr_auto] pt-[max(1.5rem,env(safe-area-inset-top))] pb-[calc(2rem+max(1.5rem,env(safe-area-inset-bottom)))] md:grid-cols-12 md:grid-rows-1">
        <div className="flex items-center justify-center py-4 md:col-span-5 md:col-start-8 md:row-start-1 md:justify-end md:py-0">
          <Monograma
            cor="dourado"
            prioridade
            sizes="(min-width: 768px) 30vw, 45vw"
            className="abertura-monograma h-auto w-[min(44vw,32svh,13rem)] md:w-[min(26vw,52svh,22rem)]"
          />
        </div>

        <div className="flex flex-col justify-end md:col-span-7 md:row-start-1 md:pb-4">
          <p aria-hidden="true" className="abertura-apoio mb-4 text-apoio font-medium text-dourado md:mb-6">
            Cardápio
          </p>
          <h1 className="display text-mega">
            <span className="sr-only">Cardápio </span>
            {["Doce", "de Mãe"].map((linha, i) => (
              <span key={linha} className="abertura-linha linha" style={{ "--i": i } as CSSProperties}>
                <span>{linha}</span>
              </span>
            ))}
          </h1>
          <p className="abertura-apoio mt-6 max-w-[24ch] text-corpo-lg text-creme md:mt-8 md:text-[1.375rem] md:leading-snug">
            Docinhos gourmet e mais delícias, feitos por mãe.
          </p>
          <a
            href="#cardapio"
            className="abertura-convite mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-dourado ps-5 pe-4 text-apoio font-semibold text-espresso shadow-flutuante transition-transform duration-200 active:scale-[0.97] md:mt-10"
          >
            Ver o cardápio
            <Icone nome="seta-baixo" className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
