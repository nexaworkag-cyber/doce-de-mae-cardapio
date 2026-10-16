import { buscarCategoria, produtosDaCategoria } from "@/lib/cardapio";
import { TituloEditorial } from "@/components/TituloEditorial";
import { CartaoProduto } from "./CartaoProduto";

/** Par assimétrico: um destaque grande e um item menor deslocado (alternando). */
export function CapituloBrownies() {
  const categoria = buscarCategoria("brownies");
  const produtos = produtosDaCategoria(categoria);

  return (
    <section
      id="brownies"
      aria-labelledby="titulo-brownies"
      className="bg-leite pt-16 pb-24 [--texto-acao:var(--color-rosa-profundo)] [--texto-apoio:var(--color-cacau)] md:pt-24 md:pb-36"
    >
      <header className="moldura">
        <TituloEditorial id="titulo-brownies" texto={categoria.nome} className="text-capitulo" />
        {categoria.recheios && (
          <p className="mt-5 max-w-[40ch] text-corpo-lg">
            <span className="font-semibold">Recheios: </span>
            <span className="text-cacau">{categoria.recheios.join(", ")}</span>
          </p>
        )}
      </header>

      <div className="moldura mt-10 grid grid-cols-12 gap-x-3 gap-y-14 md:mt-16 md:gap-x-6">
        {produtos.map((produto, i) =>
          i % 2 === 0 ? (
            <CartaoProduto
              key={produto.id}
              produto={produto}
              proporcao="4 / 5"
              proporcaoDesktop="1 / 1"
              className="col-span-12 md:col-span-6"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          ) : (
            <CartaoProduto
              key={produto.id}
              produto={produto}
              proporcao="1 / 1"
              className="col-span-9 col-start-4 md:col-span-4 md:col-start-9 md:mt-48"
              sizes="(min-width: 768px) 30vw, 75vw"
            />
          ),
        )}
      </div>
    </section>
  );
}
