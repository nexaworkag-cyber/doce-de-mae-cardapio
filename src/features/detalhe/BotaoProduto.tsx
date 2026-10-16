"use client";

import type { ReactNode } from "react";
import { useDetalhe } from "./DetalheProvider";

/**
 * Nome do produto como botão. Seu ::after cobre o cartão inteiro (que precisa de `relative`
 * e `data-produto`), então tocar na foto, no nome ou no preço abre o detalhe.
 */
export function BotaoProduto({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  const { abrir } = useDetalhe();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={`botao-cartao ${className}`}
      onClick={(e) => abrir(id, e.currentTarget.closest<HTMLElement>("[data-produto]"))}
    >
      {children}
    </button>
  );
}
