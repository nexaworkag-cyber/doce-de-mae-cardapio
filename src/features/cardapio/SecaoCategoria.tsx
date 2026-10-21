import type { Categoria } from "@/data/cardapio";
import { produtosDaCategoria, valorComum } from "@/lib/cardapio";
import { CartaoMenu } from "./CartaoMenu";
import { NotaGrupo } from "./NotaGrupo";
import { QuadroSabores } from "./QuadroSabores";

/**
 * Uma categoria do cardápio, sempre na mesma ordem (docs/DESIGN-SYSTEM.md §4):
 * título com fio → recheios → grupos (título do grupo → regras do grupo → grade) → quadro de sabores.
 * Título neutro: a cor fica para as fotos e para a ação de encomendar. No celular, se o grupo tem
 * número ímpar de itens, o último ocupa a linha inteira em formato horizontal, para não sobrar um buraco.
 */
export function SecaoCategoria({ categoria }: { categoria: Categoria }) {
  return (
    <section
      id={categoria.id}
      aria-labelledby={`titulo-${categoria.id}`}
      className="moldura scroll-mt-20 pt-secao"
    >
      <h2
        id={`titulo-${categoria.id}`}
        tabIndex={-1}
        className="titulo-secao fio-pontilhado outline-none"
      >
        {categoria.nome}
      </h2>
      {categoria.recheios && (
        <p className="mt-3 text-apoio text-tinta-suave">
          <span className="font-semibold text-tinta">Recheios: </span>
          {categoria.recheios.join(", ")}
        </p>
      )}

      {categoria.grupos.map((grupo, g) => {
        const medidaComum = valorComum(grupo.produtos.map((p) => p.medida));
        const impar = grupo.produtos.length % 2 === 1;
        return (
          <div key={grupo.id} className={g === 0 ? "mt-titulo" : "mt-grupo"}>
            {grupo.nome && <h3 className="titulo-grupo">{grupo.nome}</h3>}
            <NotaGrupo medida={medidaComum} porcao={grupo.porcao} pedidoMinimo={grupo.pedidoMinimo} className="mt-2" />
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5">
              {grupo.produtos.map((produto, i) => {
                const largo = impar && i === grupo.produtos.length - 1;
                return (
                  <li key={produto.id} className={largo ? "col-span-2 md:col-span-1" : undefined}>
                    <CartaoMenu produto={produto} ocultarMedida={medidaComum !== undefined} largo={largo} />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <QuadroSabores produtos={produtosDaCategoria(categoria)} />
    </section>
  );
}
