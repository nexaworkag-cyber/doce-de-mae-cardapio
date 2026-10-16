import { CARDAPIO } from "@/data/cardapio";
import { Monograma } from "@/components/Monograma";

/**
 * Respiro entre os docinhos e o resto. "Mais delícias" é o título do segundo bloco do cardápio
 * antigo — e a tarja rosa é herança direta dele (único lugar onde ela aparece).
 */
export function Interludio() {
  const bloco = CARDAPIO.filter((c) => c.bloco === "Mais delícias").map((c) => c.nome.toLowerCase());
  const lista = bloco.length > 1 ? `${bloco.slice(0, -1).join(", ")} e ${bloco.at(-1)}` : bloco[0];

  return (
    <div className="overflow-hidden bg-leite pt-20 md:pt-32">
      <div className="moldura grid items-end gap-8 border-b border-linha pb-16 md:grid-cols-12 md:pb-24">
        <p className="display text-interludio md:col-span-9">
          <span className="block">Mais</span>
          <span className="tarja">delícias</span>
        </p>
        <div className="flex items-end justify-between gap-6 md:col-span-3 md:flex-col md:items-end">
          <p className="max-w-[22ch] text-corpo-lg text-cacau md:text-end">
            {lista.charAt(0).toUpperCase() + lista.slice(1)}.
          </p>
          <Monograma cor="chocolate" sizes="64px" className="h-auto w-12 shrink-0 md:w-16" />
        </div>
      </div>
    </div>
  );
}
