import type { Categoria } from "@/data/cardapio";
import { produtosDaCategoria, valorComum } from "@/lib/cardapio";
import { CartaoMenu } from "./CartaoMenu";
import { NotaGrupo } from "./NotaGrupo";
import { QuadroSabores } from "./QuadroSabores";

/** Uma categoria do cardápio: título, informações da categoria e grade de cartões por grupo. */
export function SecaoCategoria({ categoria }: { categoria: Categoria }) {
  return (
    <section
      id={categoria.id}
      aria-labelledby={`titulo-${categoria.id}`}
      className="moldura scroll-mt-20 pt-10 [--texto-apoio:var(--color-cacau)] md:pt-14"
    >
      <h2
        id={`titulo-${categoria.id}`}
        tabIndex={-1}
        className="font-display text-secao font-extrabold tracking-[-0.02em] outline-none"
      >
        {categoria.nome}
      </h2>
      {categoria.recheios && (
        <p className="mt-1.5 text-apoio text-cacau">
          <span className="font-semibold text-espresso">Recheios: </span>
          {categoria.recheios.join(", ")}
        </p>
      )}

      {categoria.grupos.map((grupo) => {
        const medidaComum = valorComum(grupo.produtos.map((p) => p.medida));
        return (
          <div key={grupo.id} className="mt-5">
            {grupo.nome && <h3 className="text-corpo-lg font-bold">{grupo.nome}</h3>}
            <NotaGrupo medida={medidaComum} porcao={grupo.porcao} pedidoMinimo={grupo.pedidoMinimo} />
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {grupo.produtos.map((produto) => (
                <li key={produto.id}>
                  <CartaoMenu produto={produto} ocultarMedida={medidaComum !== undefined} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <QuadroSabores produtos={produtosDaCategoria(categoria)} />
    </section>
  );
}
