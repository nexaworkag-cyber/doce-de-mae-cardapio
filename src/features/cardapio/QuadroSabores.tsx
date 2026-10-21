import type { Produto } from "@/data/cardapio";
import { valorComum } from "@/lib/cardapio";

/**
 * Os sabores de cada linha de docinhos, como no cardápio antigo. Cada linha abre e fecha (<details>),
 * para os 23 sabores não empurrarem o resto do cardápio para longe no celular.
 */
export function QuadroSabores({ produtos }: { produtos: readonly Produto[] }) {
  const comSabores = produtos.filter((p) => p.sabores?.length);
  if (comSabores.length === 0) return null;
  const porPedido = valorComum(comSabores.map((p) => p.saboresPorPedido));

  return (
    <section
      aria-labelledby="titulo-sabores"
      className="cartao mt-grupo p-5 md:p-8"
    >
      <h3 id="titulo-sabores" className="titulo-grupo">
        Sabores
      </h3>
      {porPedido && <p className="text-apoio text-tinta-suave">Escolha até {porPedido} sabores por cento.</p>}
      <div className="mt-4 grid gap-3 md:grid-cols-3 md:items-start md:gap-8">
        {comSabores.map((produto) => (
          <details key={produto.id} className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 border-b border-divisor pb-2 text-apoio font-bold text-destaque [&::-webkit-details-marker]:hidden">
              <span>
                {produto.nome}
                <span className="ms-2 font-medium text-tinta-suave">{produto.sabores?.length} sabores</span>
              </span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180">
                <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <ul className="mt-3 columns-2 gap-x-4 md:columns-1">
              {produto.sabores?.map((sabor) => (
                <li key={sabor} className="flex break-inside-avoid items-baseline gap-2 pb-2 text-apoio">
                  <span aria-hidden="true" className="block size-1.5 shrink-0 -translate-y-0.5 rounded-full bg-marcador" />
                  {sabor}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
