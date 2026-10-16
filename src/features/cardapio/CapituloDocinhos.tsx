import { buscarCategoria, produtosDaCategoria } from "@/lib/cardapio";
import { TituloEditorial } from "@/components/TituloEditorial";
import { CartaoProduto } from "./CartaoProduto";
import { ListaSabores } from "./ListaSabores";

/**
 * Ritmo das linhas de docinhos: claro com foto sangrando à esquerda → faixa chocolate com foto
 * sangrando à direita → baunilha com foto quadrada recuada. Repete se houver mais linhas.
 * A partir de 1024 px, foto e texto ficam lado a lado (no tablet, empilhados).
 */
const RITMO = [
  {
    faixa: "bg-leite [--texto-apoio:var(--color-cacau)] [--texto-acao:var(--color-rosa-profundo)]",
    foto: "w-[calc(100%-var(--margem))] rounded-s-none lg:col-span-6 lg:w-auto lg:-ms-[var(--margem)]",
    info: "px-(--margem) lg:col-span-5 lg:col-start-8 lg:px-0",
    ponto: "bg-rosa-argila",
    proporcao: "4 / 5",
    proporcaoDesktop: "6 / 5",
  },
  {
    faixa:
      "escuro bg-chocolate text-creme [--texto-apoio:rgb(255_244_199/0.82)] [--texto-acao:var(--color-dourado)]",
    foto: "ms-auto w-[calc(100%-var(--margem))] rounded-e-none lg:order-2 lg:col-span-6 lg:col-start-7 lg:ms-0 lg:w-auto lg:-me-[var(--margem)]",
    info: "px-(--margem) lg:order-1 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:px-0",
    ponto: "bg-dourado",
    proporcao: "4 / 5",
    proporcaoDesktop: "6 / 5",
  },
  {
    faixa: "bg-baunilha [--texto-apoio:var(--color-cacau)] [--texto-acao:var(--color-rosa-profundo)]",
    foto: "mx-(--margem) lg:col-span-5 lg:col-start-2 lg:mx-0",
    info: "px-(--margem) lg:col-span-5 lg:col-start-8 lg:px-0",
    ponto: "bg-rosa-argila",
    proporcao: "1 / 1",
    proporcaoDesktop: "1 / 1",
  },
] as const;

export function CapituloDocinhos() {
  const categoria = buscarCategoria("docinhos");
  const centos = produtosDaCategoria(categoria);

  return (
    <section id="docinhos" aria-labelledby="titulo-docinhos">
      <header className="moldura pt-16 pb-10 lg:pt-28 lg:pb-16">
        <TituloEditorial id="titulo-docinhos" texto={categoria.nome} className="text-capitulo" />
        <p className="mt-5 max-w-[30ch] text-corpo-lg text-cacau lg:mt-6">
          Vendidos pelo cento. Escolha a linha e os sabores.
        </p>
      </header>

      {centos.map((cento, i) => {
        const ritmo = RITMO[i % RITMO.length];
        return (
          <div key={cento.id} className={`${ritmo.faixa} py-14 lg:py-24`}>
            <CartaoProduto
              produto={cento}
              proporcao={ritmo.proporcao}
              proporcaoDesktop={ritmo.proporcaoDesktop}
              className="lg:moldura lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6"
              classeFoto={ritmo.foto}
              classeInfo={`${ritmo.info} lg:mt-0`}
              sizes="(min-width: 1024px) 50vw, 100vw"
            >
              {cento.sabores && <ListaSabores sabores={cento.sabores} corPonto={ritmo.ponto} className="mt-8" />}
            </CartaoProduto>
          </div>
        );
      })}
    </section>
  );
}
