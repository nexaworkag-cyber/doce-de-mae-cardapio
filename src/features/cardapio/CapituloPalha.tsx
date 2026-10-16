import { buscarCategoria, valorComum } from "@/lib/cardapio";
import { FotoProduto } from "@/components/FotoProduto";
import { Icone } from "@/components/Icone";
import { Preco } from "@/components/Preco";
import { TituloEditorial } from "@/components/TituloEditorial";
import { BotaoProduto } from "@/features/detalhe/BotaoProduto";
import { CartaoProduto } from "./CartaoProduto";
import { NotaGrupo } from "./NotaGrupo";

/**
 * Faixa verde figo. Grupos sem título viram cartões grandes alternados; grupos com título
 * (ex.: "Mini palha") viram uma lista de preços com pontilhado, como num cardápio impresso.
 * A medida comum e o mínimo do grupo aparecem uma vez, na NotaGrupo, logo acima dos itens.
 */
export function CapituloPalha() {
  const categoria = buscarCategoria("palha-italiana");

  return (
    <section
      id="palha-italiana"
      aria-labelledby="titulo-palha-italiana"
      className="escuro bg-figo pt-20 pb-24 text-creme [--texto-acao:var(--color-creme)] [--texto-apoio:var(--color-creme)] md:pt-32 md:pb-36"
    >
      <header className="moldura">
        <TituloEditorial id="titulo-palha-italiana" texto={categoria.nome} className="text-capitulo" />
      </header>

      {categoria.grupos.map((grupo) => {
        const medidaComum = valorComum(grupo.produtos.map((p) => p.medida));
        const nota = <NotaGrupo medida={medidaComum} porcao={grupo.porcao} pedidoMinimo={grupo.pedidoMinimo} />;

        return grupo.nome ? (
          <div key={grupo.id} className="moldura mt-20 md:mt-28 md:grid md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-4">
              <h3 className="display text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] leading-[0.92]">{grupo.nome}</h3>
              <div className="mt-3">{nota}</div>
            </div>
            <ul className="mt-6 border-t border-creme/30 md:col-span-7 md:col-start-6 md:mt-0">
              {grupo.produtos.map((produto) => (
                <li key={produto.id}>
                  <article
                    data-produto={produto.id}
                    className="toque relative flex items-center gap-4 border-b border-creme/30 py-4"
                  >
                    <FotoProduto
                      produto={produto}
                      proporcao="1 / 1"
                      compacto
                      sizes="96px"
                      className="w-16 shrink-0 [--raio:1rem] md:w-20"
                    />
                    <h4 className="min-w-0 text-[1.25rem] font-semibold tracking-[-0.01em] md:text-[1.5rem]">
                      <BotaoProduto id={produto.id}>{produto.nome}</BotaoProduto>
                    </h4>
                    <span aria-hidden="true" className="h-px min-w-4 flex-1 border-b-2 border-dotted border-creme/40" />
                    <Preco centavos={produto.precoCentavos} className="text-preco" />
                    <Icone nome="seta-direita" className="-ms-1 size-5 shrink-0 opacity-80" />
                  </article>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div key={grupo.id} className="mt-10 md:mt-14">
            <div className="moldura">{nota}</div>
            <div className="mt-8 grid gap-y-14 md:moldura md:mt-10 md:grid-cols-12 md:gap-x-6">
              {grupo.produtos.map((produto, i) => (
                <CartaoProduto
                  key={produto.id}
                  produto={produto}
                  proporcao="4 / 5"
                  ocultarMedida={medidaComum !== undefined}
                  className={
                    i % 2 === 0
                      ? "w-[calc(100%-var(--margem)*2.5)] md:col-span-5 md:w-auto"
                      : "ms-auto w-[calc(100%-var(--margem)*2.5)] md:col-span-5 md:col-start-8 md:ms-0 md:mt-40 md:w-auto"
                  }
                  classeFoto={i % 2 === 0 ? "rounded-s-none md:rounded-s-prancha" : "rounded-e-none md:rounded-e-prancha"}
                  classeInfo={i % 2 === 0 ? "ps-(--margem) md:ps-0" : "pe-(--margem) md:pe-0"}
                  sizes="(min-width: 768px) 40vw, 85vw"
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
