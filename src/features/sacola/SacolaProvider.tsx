"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { buscarProduto } from "@/lib/cardapio";
import type { ItemPedido } from "@/lib/pedido";

type ContextoSacola = {
  itens: readonly ItemPedido[];
  adicionar: (item: Omit<ItemPedido, "chave">) => void;
  alterarQuantidade: (chave: string, quantidade: number) => void;
  remover: (chave: string) => void;
  limpar: () => void;
  aberta: boolean;
  abrir: () => void;
  fechar: () => void;
};

const Contexto = createContext<ContextoSacola | null>(null);

export function useSacola(): ContextoSacola {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useSacola precisa estar dentro de <SacolaProvider>");
  return ctx;
}

const CHAVE_ARMAZENAMENTO = "doce-de-mae:sacola";

/** Lê a sacola salva neste navegador, descartando itens de produtos que não existem mais. */
function lerSalva(): ItemPedido[] {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO) ?? "[]");
    return Array.isArray(bruto) ? bruto.filter((i: ItemPedido) => buscarProduto(i.produtoId)) : [];
  } catch {
    return [];
  }
}

// Armazém da sacola fora do React: lido do navegador uma vez, avisa quem estiver ouvindo a cada mudança.
const VAZIA: ItemPedido[] = [];
let estado: ItemPedido[] | null = null;
const ouvintes = new Set<() => void>();

function ler(): ItemPedido[] {
  if (estado === null) estado = lerSalva();
  return estado;
}

function definir(mudar: (atuais: ItemPedido[]) => ItemPedido[]) {
  estado = mudar(ler());
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(estado));
  } catch {
    /* sem armazenamento: a sacola vale só para esta visita */
  }
  ouvintes.forEach((avisar) => avisar());
}

function ouvir(avisar: () => void) {
  ouvintes.add(avisar);
  return () => ouvintes.delete(avisar);
}

/**
 * Sacola do pedido: vários produtos, enviados juntos numa mensagem de WhatsApp.
 * Fica salva só neste navegador (conveniência; se o armazenamento falhar, a sacola funciona do mesmo jeito).
 */
export function SacolaProvider({ children }: { children: ReactNode }) {
  const itens = useSyncExternalStore(ouvir, ler, () => VAZIA);
  const [aberta, setAberta] = useState(false);

  const adicionar = useCallback((item: Omit<ItemPedido, "chave">) => {
    definir((atuais) => {
      // Mesmo produto com as mesmas escolhas: soma a quantidade em vez de duplicar a linha.
      const igual = atuais.find(
        (i) => i.produtoId === item.produtoId && i.escolhas.join("|") === item.escolhas.join("|"),
      );
      if (igual) return atuais.map((i) => (i === igual ? { ...i, quantidade: i.quantidade + item.quantidade } : i));
      return [...atuais, { ...item, chave: `${item.produtoId}-${Date.now().toString(36)}` }];
    });
  }, []);

  const alterarQuantidade = useCallback((chave: string, quantidade: number) => {
    definir((atuais) => atuais.map((i) => (i.chave === chave ? { ...i, quantidade } : i)));
  }, []);

  const remover = useCallback((chave: string) => {
    definir((atuais) => atuais.filter((i) => i.chave !== chave));
  }, []);

  const limpar = useCallback(() => definir(() => []), []);
  const abrir = useCallback(() => setAberta(true), []);
  const fechar = useCallback(() => setAberta(false), []);

  const valor = useMemo(
    () => ({ itens, adicionar, alterarQuantidade, remover, limpar, aberta, abrir, fechar }),
    [itens, adicionar, alterarQuantidade, remover, limpar, aberta, abrir, fechar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
