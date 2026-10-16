import type { ReactNode } from "react";
import type { Produto } from "@/data/cardapio";
import { textoMinimo } from "@/lib/cardapio";
import { FotoProduto } from "@/components/FotoProduto";
import { Icone } from "@/components/Icone";
import { Medida } from "@/components/Medida";
import { Preco } from "@/components/Preco";
import { BotaoProduto } from "@/features/detalhe/BotaoProduto";

type Props = {
  produto: Produto;
  proporcao?: string;
  proporcaoDesktop?: string;
  className?: string;
  classeFoto?: string;
  classeInfo?: string;
  sizes?: string;
  /** Nível do título do produto (h3 por padrão; h4 dentro de um grupo com título). */
  nivel?: "h3" | "h4";
  /** A medida já aparece na nota do grupo (ex.: palhas 5×5). */
  ocultarMedida?: boolean;
  /** Conteúdo extra abaixo das informações, fora da área clicável (ex.: lista de sabores). */
  children?: ReactNode;
};

/**
 * Cartão editorial de produto. O cartão inteiro abre o detalhe (botão no nome com área estendida).
 * Mostra apenas o que o cardápio informa NO PRODUTO; dados do grupo ficam na NotaGrupo.
 * Cores de apoio e de ação vêm da seção: `--texto-apoio` e `--texto-acao`.
 */
export function CartaoProduto({
  produto,
  proporcao = "4 / 5",
  proporcaoDesktop,
  className = "",
  classeFoto = "",
  classeInfo = "",
  sizes,
  nivel: Titulo = "h3",
  ocultarMedida = false,
  children,
}: Props) {
  const medida = ocultarMedida ? undefined : produto.medida;
  const temDetalhes = medida || produto.saboresPorPedido || produto.peso || produto.pedidoMinimo;

  return (
    <article data-produto={produto.id} className={`toque relative ${className}`}>
      <FotoProduto
        produto={produto}
        proporcao={proporcao}
        proporcaoDesktop={proporcaoDesktop}
        revelar
        sizes={sizes}
        className={classeFoto}
      />
      <div className={`mt-4 ${classeInfo}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <Titulo className="text-produto font-semibold tracking-[-0.02em]">
            <BotaoProduto id={produto.id}>{produto.nome}</BotaoProduto>
          </Titulo>
          <Preco centavos={produto.precoCentavos} unidade={produto.unidadePreco} className="text-preco" />
        </div>
        {temDetalhes && (
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-apoio font-medium text-(--texto-apoio)">
            {medida && <Medida medida={medida} />}
            {produto.saboresPorPedido && <span>Até {produto.saboresPorPedido} sabores</span>}
            {produto.peso && <span>{produto.peso}</span>}
            {produto.pedidoMinimo && <span>{textoMinimo(produto.pedidoMinimo)}</span>}
          </p>
        )}
        {produto.descricao && (
          <p className="mt-3 max-w-[34ch] text-apoio text-(--texto-apoio)">{produto.descricao}</p>
        )}
        {produto.opcoes && <p className="mt-3 text-apoio text-(--texto-apoio)">{produto.opcoes.join(", ")}</p>}
        <p
          aria-hidden="true"
          className="mt-3 inline-flex items-center gap-1 text-apoio font-semibold text-(--texto-acao) underline decoration-1 underline-offset-4"
        >
          Ver detalhes
          <Icone nome="seta-direita" className="size-4" />
        </p>
        {children && <div className="relative z-[2]">{children}</div>}
      </div>
    </article>
  );
}
