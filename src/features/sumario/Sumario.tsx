import { CARDAPIO } from "@/data/cardapio";
import { menorPreco } from "@/lib/cardapio";
import { formatarPreco } from "@/lib/preco";
import { Icone } from "@/components/Icone";

/**
 * Sumário no topo da folha: as categorias reais do cardápio, cada uma com o menor preço
 * calculado a partir dos dados (nada escrito à mão aqui). Mesmo padrão de preço em todas.
 */
export function Sumario() {
  return (
    <section aria-labelledby="sumario-titulo" className="moldura pt-10 pb-4 md:pt-16">
      <h2 id="sumario-titulo" className="text-apoio font-semibold text-cacau">
        Neste cardápio
      </h2>
      <ol className="mt-3 border-t border-linha md:grid md:grid-cols-2 md:gap-x-8 md:border-t-0 lg:grid-cols-4 lg:gap-x-6">
        {CARDAPIO.map((categoria) => {
          const preco = menorPreco(categoria);
          return (
            <li key={categoria.id} className="border-b border-linha md:border-b-0 md:border-t-2 md:border-espresso">
              <a
                href={`#${categoria.id}`}
                className="group flex min-h-[4.5rem] items-center justify-between gap-4 py-3 md:h-full md:flex-col md:items-start md:justify-between md:gap-4 md:pt-4 md:pb-6"
              >
                <span className="display text-[clamp(1.375rem,1rem+1.5vw,2rem)] leading-[0.95] transition-colors duration-200 group-hover:text-rosa-profundo">
                  {categoria.nome}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-end text-legenda text-cacau tabular-nums md:text-start md:text-apoio">
                  <span>
                    a partir de{" "}
                    <span className="block text-apoio font-semibold text-espresso md:inline">
                      {formatarPreco(preco.centavos)}
                      {preco.unidade === "cento" && <span className="font-medium text-cacau"> o cento</span>}
                    </span>
                  </span>
                  <Icone
                    nome="seta-direita"
                    className="hidden size-4 text-rosa-profundo transition-transform duration-200 group-hover:translate-x-0.5 md:block"
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
