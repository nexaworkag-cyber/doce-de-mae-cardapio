import { CONTATO } from "@/data/contato";
import { buscarProduto, type ProdutoResolvido } from "@/lib/cardapio";
import { formatarPreco } from "@/lib/preco";

/**
 * Regras do pedido montado no cardápio. Usa só o que o cardápio informa:
 * - Centos: até `saboresPorPedido` sabores, quantidade em centos inteiros (não há meio cento no cardápio).
 * - Demais: quantidade em unidades a partir do mínimo do produto; escolha entre recheios/opções quando existem.
 * O total é preço × quantidade. Para brownies, palhas e copos o preço por unidade é uma presunção
 * (pendência "preco-unitario"), por isso o total vai como "estimado" e a confirmação fica com a confeitaria.
 */

export type TipoEscolha = "sabores" | "recheios" | "opcoes";

export type RegrasPedido = {
  unidade: "cento" | "un.";
  minimo: number;
  escolha?: { tipo: TipoEscolha; titulo: string; itens: readonly string[]; maximo?: number };
};

export function regrasDoProduto(p: ProdutoResolvido): RegrasPedido {
  const unidade = p.unidadePreco === "cento" ? "cento" : "un.";
  const minimo = unidade === "cento" ? 1 : (p.pedidoMinimoEfetivo ?? 1);
  if (p.sabores?.length) {
    return { unidade, minimo, escolha: { tipo: "sabores", titulo: "Escolha seus sabores", itens: p.sabores, maximo: p.saboresPorPedido } };
  }
  if (p.opcoes?.length) {
    return { unidade, minimo, escolha: { tipo: "opcoes", titulo: "Escolha o sabor", itens: p.opcoes, maximo: 1 } };
  }
  if (p.recheios?.length) {
    return { unidade, minimo, escolha: { tipo: "recheios", titulo: "Escolha o recheio", itens: p.recheios, maximo: 1 } };
  }
  return { unidade, minimo };
}

export type ItemPedido = {
  /** Identificador do item na sacola (o mesmo produto pode entrar mais de uma vez com escolhas diferentes). */
  chave: string;
  produtoId: string;
  quantidade: number;
  escolhas: string[];
};

/** Por que o item ainda não pode ir para a sacola (ou null quando pode). */
export function pendenciaDoItem(regras: RegrasPedido, quantidade: number, escolhas: readonly string[]): string | null {
  if (regras.escolha && escolhas.length === 0) {
    return regras.escolha.tipo === "sabores" ? "Escolha pelo menos 1 sabor" : regras.escolha.tipo === "recheios" ? "Escolha o recheio" : "Escolha o sabor";
  }
  if (quantidade < regras.minimo) return regras.unidade === "cento" ? "Escolha a quantidade" : `Mínimo de ${regras.minimo} un.`;
  return null;
}

export function subtotal(p: ProdutoResolvido, quantidade: number): number {
  return p.precoCentavos * quantidade;
}

export function textoQuantidade(quantidade: number, unidade: RegrasPedido["unidade"]): string {
  return unidade === "cento" ? `${quantidade} ${quantidade === 1 ? "cento" : "centos"}` : `${quantidade} un.`;
}

const ROTULO_ESCOLHA: Record<TipoEscolha, string> = { sabores: "Sabores", recheios: "Recheio", opcoes: "Sabor" };

export function totalDoPedido(itens: readonly ItemPedido[]): number {
  return itens.reduce((soma, item) => {
    const p = buscarProduto(item.produtoId);
    return p ? soma + subtotal(p, item.quantidade) : soma;
  }, 0);
}

/** Mensagem que chega no WhatsApp da confeitaria. */
export function mensagemDoPedido(itens: readonly ItemPedido[]): string {
  const linhas = itens.flatMap((item) => {
    const p = buscarProduto(item.produtoId);
    if (!p) return [];
    const regras = regrasDoProduto(p);
    const escolhas = regras.escolha && item.escolhas.length ? `\n   ${ROTULO_ESCOLHA[regras.escolha.tipo]}: ${item.escolhas.join(", ")}` : "";
    const nome = [p.categoria.nome, p.grupoNome, p.nome].filter(Boolean).join(" · ");
    return [`• ${nome} — ${textoQuantidade(item.quantidade, regras.unidade)} (${formatarPreco(subtotal(p, item.quantidade))})${escolhas}`];
  });
  return [
    "Olá! Montei este pedido no cardápio da Doce de Mãe:",
    "",
    ...linhas,
    "",
    `Total estimado: ${formatarPreco(totalDoPedido(itens))}`,
    "Podemos combinar a data e a entrega?",
  ].join("\n");
}

export function linkPedidoWhatsApp(itens: readonly ItemPedido[]): string {
  return `https://wa.me/${CONTATO.whatsappE164}?text=${encodeURIComponent(mensagemDoPedido(itens))}`;
}
