import { buscarCategoria, valorComum } from "@/lib/cardapio";
import { TituloEditorial } from "@/components/TituloEditorial";
import { CartaoProduto } from "./CartaoProduto";
import { NotaGrupo } from "./NotaGrupo";

/**
 * Faixa chocolate, como a caixa do copo no cardápio antigo. Porção e mínimo são do grupo
 * (NotaGrupo logo abaixo do título). No celular, os copos ficam lado a lado com o segundo deslocado;
 * no desktop, viram um par alinhado — composição diferente do zigue-zague da palha italiana.
 */
export function CapituloCopo() {
  const categoria = buscarCategoria("copo-da-felicidade");

  return (
    <section
      id="copo-da-felicidade"
      aria-labelledby="titulo-copo-da-felicidade"
      className="escuro bg-chocolate pt-20 pb-24 text-creme [--texto-acao:var(--color-dourado)] [--texto-apoio:rgb(255_244_199/0.82)] lg:pt-32 lg:pb-36"
    >
      {categoria.grupos.map((grupo, indiceGrupo) => (
        <div key={grupo.id} className="moldura">
          <header>
            {indiceGrupo === 0 && (
              <TituloEditorial
                id="titulo-copo-da-felicidade"
                texto={categoria.nome}
                className="text-capitulo"
              />
            )}
            <NotaGrupo
              medida={valorComum(grupo.produtos.map((p) => p.medida))}
              porcao={grupo.porcao}
              pedidoMinimo={grupo.pedidoMinimo}
              className="mt-5"
            />
          </header>

          <div className="mt-10 grid grid-cols-2 gap-x-3 lg:mt-16 lg:grid-cols-12 lg:gap-x-6">
            {grupo.produtos.map((produto, i) => (
              <CartaoProduto
                key={produto.id}
                produto={produto}
                proporcao="3 / 4"
                proporcaoDesktop="4 / 5"
                className={i % 2 === 0 ? "lg:col-span-5 lg:col-start-2" : "mt-16 lg:col-span-5 lg:col-start-7 lg:mt-0"}
                sizes="(min-width: 1024px) 40vw, 50vw"
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
