"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { buscarProduto } from "@/lib/cardapio";
import { FolhaDetalhe } from "./FolhaDetalhe";

type ContextoDetalhe = {
  abrir: (id: string, origem: HTMLElement | null) => void;
};

const Contexto = createContext<ContextoDetalhe | null>(null);

export function useDetalhe(): ContextoDetalhe {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useDetalhe precisa estar dentro de <DetalheProvider>");
  return ctx;
}

const NOME_TRANSICAO = "foto-ativa";

function movimentoPermitido() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function podeTransicionar() {
  return typeof document.startViewTransition === "function" && movimentoPermitido();
}

function estaNaTela(el: Element | null): el is HTMLElement {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
}

function produtoDoHash(): string | null {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return id && buscarProduto(id) ? id : null;
}

function cartaoDoProduto(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-produto="${CSS.escape(id)}"]`);
}

/**
 * Detalhe do produto em <dialog> nativo (foco preso, Esc, fundo inerte).
 * - Abre com a foto "voando" do cartão para a folha (View Transitions); sem suporte → WAAPI.
 * - Cada abertura cria uma entrada no histórico (#id): o botão/gesto "voltar" fecha a folha
 *   e o link é compartilhável.
 */
export function DetalheProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [produtoId, setProdutoId] = useState<string | null>(null);
  const origemRef = useRef<HTMLElement | null>(null);
  const empurrouHistorico = useRef(false);
  const fechamentoPorGesto = useRef(false);

  const fotoDoDialog = () => dialogRef.current?.querySelector<HTMLElement>("[data-foto-produto]") ?? null;

  const mostrar = useCallback((id: string, origem: HTMLElement | null) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    origemRef.current = origem;
    const fotoOrigem = origem?.querySelector<HTMLElement>("[data-foto-produto]") ?? null;

    const abrirAgora = () => {
      flushSync(() => setProdutoId(id));
      dialog.showModal();
      dialog.scrollTop = 0;
      dialog.querySelector(".detalhe-info")?.scrollTo(0, 0);
    };

    if (podeTransicionar() && estaNaTela(fotoOrigem)) {
      fotoOrigem.style.viewTransitionName = NOME_TRANSICAO;
      const transicao = document.startViewTransition(() => {
        fotoOrigem.style.viewTransitionName = "";
        abrirAgora();
        const destino = fotoDoDialog();
        if (destino) destino.style.viewTransitionName = NOME_TRANSICAO;
      });
      transicao.finished.finally(() => {
        const destino = fotoDoDialog();
        if (destino) destino.style.viewTransitionName = "";
      });
      return;
    }

    abrirAgora();
    if (movimentoPermitido()) {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      dialog.animate(
        desktop
          ? [{ opacity: 0, transform: "translateY(24px) scale(0.98)" }, { opacity: 1, transform: "none" }]
          : [{ transform: "translateY(100%)" }, { transform: "none" }],
        { duration: 480, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      );
    }
  }, []);

  const esconder = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    const porGesto = fechamentoPorGesto.current;
    fechamentoPorGesto.current = false;
    const fotoOrigem = origemRef.current?.querySelector<HTMLElement>("[data-foto-produto]") ?? null;

    if (!porGesto && podeTransicionar() && estaNaTela(fotoOrigem)) {
      const atual = fotoDoDialog();
      if (atual) atual.style.viewTransitionName = NOME_TRANSICAO;
      const transicao = document.startViewTransition(() => {
        if (atual) atual.style.viewTransitionName = "";
        dialog.close();
        fotoOrigem.style.viewTransitionName = NOME_TRANSICAO;
      });
      transicao.finished.finally(() => {
        fotoOrigem.style.viewTransitionName = "";
      });
      return;
    }

    if (!porGesto && movimentoPermitido()) {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const saida = dialog.animate(
        desktop
          ? [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(16px) scale(0.98)" }]
          : [{ transform: "none" }, { transform: "translateY(100%)" }],
        { duration: 280, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" },
      );
      saida.finished.then(() => {
        dialog.close();
        saida.cancel();
      });
      return;
    }

    dialog.close();
  }, []);

  const abrir = useCallback(
    (id: string, origem: HTMLElement | null) => {
      if (dialogRef.current?.open) return;
      window.history.pushState({ dmProduto: id }, "", `#${encodeURIComponent(id)}`);
      empurrouHistorico.current = true;
      mostrar(id, origem);
    },
    [mostrar],
  );

  /** Intenção de fechar (botão, fundo, Esc, gesto): o histórico decide. */
  const fechar = useCallback(
    (porGesto = false) => {
      fechamentoPorGesto.current = porGesto;
      if (empurrouHistorico.current) {
        window.history.back(); // → popstate → esconder()
      } else {
        esconder();
      }
    },
    [esconder],
  );

  useEffect(() => {
    const aoNavegar = () => {
      const id = produtoDoHash();
      const dialog = dialogRef.current;
      if (!id && dialog?.open) {
        empurrouHistorico.current = false;
        esconder();
      } else if (id && !dialog?.open) {
        empurrouHistorico.current = true; // "avançar" de volta para um produto
        mostrar(id, cartaoDoProduto(id));
      }
    };
    window.addEventListener("popstate", aoNavegar);

    // Link direto (#id): abre sem criar entrada nova no histórico.
    const inicial = produtoDoHash();
    const quadro = inicial ? requestAnimationFrame(() => mostrar(inicial, null)) : 0;

    return () => {
      window.removeEventListener("popstate", aoNavegar);
      cancelAnimationFrame(quadro);
    };
  }, [esconder, mostrar]);

  /** Fechou por qualquer caminho: limpa o #id da URL se ainda estiver lá. */
  const aoFecharDialog = useCallback(() => {
    if (!produtoDoHash()) return;
    if (empurrouHistorico.current) {
      empurrouHistorico.current = false;
      window.history.back();
    } else {
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
    }
  }, []);

  const produto = produtoId ? buscarProduto(produtoId) : undefined;

  return (
    <Contexto.Provider value={{ abrir }}>
      {children}
      <FolhaDetalhe ref={dialogRef} produto={produto} onFechar={fechar} onFechado={aoFecharDialog} />
    </Contexto.Provider>
  );
}
