import { Monograma } from "@/components/Monograma";

/** Topo compacto: monograma dourado sobre chocolate (combinação principal da marca) e o nome. */
export function Cabecalho() {
  return (
    <header className="moldura pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="escuro flex flex-col items-center rounded-[2rem] bg-chocolate px-6 pt-8 pb-9 text-center text-creme md:flex-row md:gap-8 md:px-10 md:py-9 md:text-start">
        <Monograma cor="dourado" prioridade sizes="80px" className="h-auto w-14 shrink-0 md:w-16" />
        <div className="mt-4 md:mt-0">
          <h1>
            <span className="display block text-[clamp(1.75rem,1.2rem+2.4vw,2.75rem)] leading-none">Doce de Mãe</span>
            <span className="mt-2 block text-apoio font-semibold text-dourado">Cardápio</span>
          </h1>
          <p className="mt-2 max-w-[32ch] text-apoio text-creme/85">Docinhos gourmet e mais delícias, feitos por mãe.</p>
        </div>
      </div>
    </header>
  );
}
