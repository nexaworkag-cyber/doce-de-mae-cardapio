import type { Produto } from "@/data/cardapio";
import { textoMinimo } from "@/lib/cardapio";
import { FotoProduto } from "@/components/FotoProduto";
import { Preco } from "@/components/Preco";
import { BotaoProduto } from "@/features/detalhe/BotaoProduto";

/**
 * Cartão do cardápio: foto, nome, uma linha de informações, descrição curta e preço.
 * O cartão inteiro abre o detalhe. Mostra só o que o cardápio informa no próprio produto;
 * dados do grupo (mínimo, porção, medida comum) ficam na NotaGrupo acima da grade.
 */
export function CartaoMenu({ produto, ocultarMedida = false }: { produto: Produto; ocultarMedida?: boolean }) {
  const informacoes = [
    ocultarMedida ? undefined : produto.medida,
    produto.saboresPorPedido ? `Até ${produto.saboresPorPedido} sabores` : undefined,
    produto.peso,
    produto.pedidoMinimo ? textoMinimo(produto.pedidoMinimo) : undefined,
  ].filter(Boolean);

  const texto =
    produto.descricao ??
    produto.opcoes?.join(", ") ??
    (produto.sabores ? `${produto.sabores.length} sabores` : undefined);

  return (
    <article
      data-produto={produto.id}
      className="toque relative flex h-full flex-col rounded-[1.75rem] bg-nata p-2 pb-4 text-center shadow-cartao ring-1 ring-linha/60 transition-[translate,box-shadow] duration-200 md:hover:-translate-y-0.5 md:hover:shadow-flutuante"
    >
      {/* Marcador no tom suave da categoria: quando as fotos chegarem, o doce é a cor. */}
      <FotoProduto
        produto={{ ...produto, tom: "baunilha" }}
        proporcao="1 / 1"
        seloCentral
        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"
        className="prancha-categoria [--raio:1.375rem]"
      />
      <h3 className="mt-3 px-2 text-[1rem] leading-tight font-bold tracking-[-0.01em] md:text-[1.0625rem]">
        <BotaoProduto id={produto.id}>{produto.nome}</BotaoProduto>
      </h3>
      {informacoes.length > 0 && (
        <p className="mt-1 px-2 text-legenda font-medium text-cacau">{informacoes.join(" · ")}</p>
      )}
      {texto && <p className="mt-1 line-clamp-3 px-2 text-legenda text-cacau">{texto}</p>}
      <Preco centavos={produto.precoCentavos} unidade={produto.unidadePreco} className="mt-auto px-1 pt-3 text-[1.25rem]" />
    </article>
  );
}
