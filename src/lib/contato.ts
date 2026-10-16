import { CONTATO } from "@/data/contato";
import { formatarPreco } from "@/lib/preco";
import type { ProdutoResolvido } from "@/lib/cardapio";

export function linkWhatsApp(produto?: Pick<ProdutoResolvido, "nomeCompleto" | "precoCentavos" | "unidadePreco">) {
  const base = `https://wa.me/${CONTATO.telefoneE164}`;
  const mensagem = produto
    ? `Olá! Vi o cardápio da Doce de Mãe e gostaria de encomendar: ${produto.nomeCompleto} (${formatarPreco(produto.precoCentavos)}${produto.unidadePreco === "cento" ? " o cento" : ""}).`
    : "Olá! Vi o cardápio da Doce de Mãe e gostaria de fazer uma encomenda.";
  return `${base}?text=${encodeURIComponent(mensagem)}`;
}

export const linkTelefone = `tel:+${CONTATO.telefoneE164}`;
export const linkInstagram = `https://www.instagram.com/${CONTATO.instagram}/`;
