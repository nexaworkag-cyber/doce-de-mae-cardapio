import type { Produto } from "@/data/cardapio";
import { textoMedida, textoMinimo } from "@/lib/cardapio";
import { FotoProduto } from "@/components/FotoProduto";
import { Preco } from "@/components/Preco";
import { BotaoProduto } from "@/features/detalhe/BotaoProduto";

/**
 * Cartão do cardápio, sempre na mesma ordem: foto → nome → informações → descrição (até 3 linhas) → preço,
 * com o preço preso à base para alinhar na grade. Receita em docs/DESIGN-SYSTEM.md §4.
 * O cartão inteiro abre o detalhe. Mostra só o que o cardápio informa no próprio produto;
 * dados do grupo (mínimo, porção, medida comum) ficam na NotaGrupo acima da grade.
 * Área de foto sempre 4:3, com ou sem foto real, para nome e preço alinharem na grade enquanto as fotos chegam aos poucos.
 * Sem foto, o marcador mostra só o ícone, para não dominar a página.
 * `largo`: no celular vira cartão horizontal de linha inteira (último item de grupo ímpar).
 */
export function CartaoMenu({
  produto,
  ocultarMedida = false,
  largo = false,
}: {
  produto: Produto;
  ocultarMedida?: boolean;
  largo?: boolean;
}) {
  const temFoto = produto.foto !== null;
  const informacoes = [
    ocultarMedida || !produto.medida ? undefined : `Pedaço de ${textoMedida(produto.medida)}`,
    produto.saboresPorPedido ? `Até ${produto.saboresPorPedido} sabores por cento` : undefined,
    produto.peso && `${produto.peso} cada unidade`,
    produto.pedidoMinimo ? textoMinimo(produto.pedidoMinimo) : undefined,
  ].filter(Boolean);

  const texto =
    produto.descricao ??
    produto.opcoes?.join(", ") ??
    (produto.sabores ? `${produto.sabores.length} sabores` : undefined);

  return (
    <article
      data-produto={produto.id}
      className={`cartao toque relative flex h-full p-respiro transition-[translate,box-shadow] duration-200 md:flex-col md:pb-4 md:text-center md:hover:-translate-y-0.5 md:hover:shadow-flutuante ${
        largo ? "flex-row items-center gap-1 text-left md:gap-0" : "flex-col pb-4 text-center"
      }`}
    >
      {/* Marcador neutro (baunilha): quando as fotos chegarem, o doce é a cor. */}
      <FotoProduto
        produto={{ ...produto, tom: "baunilha" }}
        proporcao="4 / 3"
        compacto={!temFoto}
        seloCentral
        sizes="(min-width: 768px) 30vw, 46vw"
        className={`[--raio:var(--radius-foto)] ${largo ? "w-[44%] shrink-0 md:w-full" : ""}`}
      />
      <div className={`flex flex-1 flex-col ${largo ? "py-2 pr-2 md:p-0" : ""}`}>
        <h3 className="titulo-cartao mt-3 px-2">
          <BotaoProduto id={produto.id}>{produto.nome}</BotaoProduto>
        </h3>
        {informacoes.length > 0 && (
          <p className="mt-1 px-2 text-legenda font-medium text-tinta-suave">{informacoes.join(" · ")}</p>
        )}
        {texto && <p className="mt-1 line-clamp-3 px-2 text-legenda text-tinta-suave">{texto}</p>}
        <Preco centavos={produto.precoCentavos} unidade={produto.unidadePreco} className={`preco-cartao mt-auto px-2 pt-3 text-preco ${largo ? "preco-cartao-inicio" : ""}`} />
      </div>
    </article>
  );
}
