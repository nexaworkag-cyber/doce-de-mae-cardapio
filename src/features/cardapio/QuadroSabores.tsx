import type { Produto } from "@/data/cardapio";
import { valorComum } from "@/lib/cardapio";

/** Os sabores de cada linha de docinhos, lado a lado como no cardápio antigo. */
export function QuadroSabores({ produtos }: { produtos: readonly Produto[] }) {
  const comSabores = produtos.filter((p) => p.sabores?.length);
  if (comSabores.length === 0) return null;
  const porPedido = valorComum(comSabores.map((p) => p.saboresPorPedido));

  return (
    <section
      aria-labelledby="titulo-sabores"
      className="mt-4 rounded-[1.75rem] bg-nata p-5 shadow-cartao ring-1 ring-linha/60 md:mt-5 md:p-8"
    >
      <h3 id="titulo-sabores" className="text-corpo-lg font-bold">
        Sabores
      </h3>
      {porPedido && <p className="text-apoio text-cacau">Escolha até {porPedido} sabores por cento.</p>}
      <div className="mt-5 grid gap-6 md:grid-cols-3 md:gap-8">
        {comSabores.map((produto) => (
          <div key={produto.id}>
            <p className="border-b border-linha pb-2 text-apoio font-bold">{produto.nome}</p>
            <ul className="mt-3 columns-2 gap-x-4 md:columns-1">
              {produto.sabores?.map((sabor) => (
                <li key={sabor} className="flex break-inside-avoid items-baseline gap-2 pb-2 text-apoio">
                  <span aria-hidden="true" className="block size-1.5 shrink-0 -translate-y-0.5 rounded-full bg-rosa-argila" />
                  {sabor}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
