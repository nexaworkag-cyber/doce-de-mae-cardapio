"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { CategoriaId } from "@/data/cardapio";

type Item = { id: CategoriaId; nome: string; rotuloCurto: string };

/**
 * Abas de categoria presas ao topo. Acompanham a rolagem (IntersectionObserver) e, ao tocar,
 * levam até a categoria. No celular usam o rótulo curto para caber as quatro sem rolar.
 */
export function AbasCategorias({ itens }: { itens: readonly Item[] }) {
  const [ativo, setAtivo] = useState<CategoriaId>(itens[0].id);
  const listaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const secoes = itens
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setAtivo(entrada.target.id as CategoriaId);
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    secoes.forEach((s) => observador.observe(s));
    return () => observador.disconnect();
  }, [itens]);

  // Mantém a aba ativa visível quando a lista rola na horizontal.
  useEffect(() => {
    const lista = listaRef.current;
    const aba = lista?.querySelector<HTMLElement>(`[data-aba="${ativo}"]`);
    if (!lista || !aba || lista.scrollWidth <= lista.clientWidth) return;
    lista.scrollTo({ left: aba.offsetLeft - (lista.clientWidth - aba.offsetWidth) / 2, behavior: "smooth" });
  }, [ativo]);

  const irPara = (e: MouseEvent<HTMLAnchorElement>, id: CategoriaId) => {
    const alvo = document.getElementById(id);
    if (!alvo) return;
    e.preventDefault();
    setAtivo(id);
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    alvo.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
    alvo.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  };

  return (
    <nav
      aria-label="Categorias do cardápio"
      className="sticky top-0 z-30 moldura mt-10 py-2.5 md:mt-12"
    >
      <div
        ref={listaRef}
        className="escuro vidro mx-auto flex w-fit max-w-full gap-0.5 overflow-x-auto rounded-full p-1 sm:gap-1 sm:p-1.5 [scrollbar-width:none]"
      >
        {itens.map((item) => {
          const atual = ativo === item.id;
          return (
            <a
              key={item.id}
              data-aba={item.id}
              href={`#${item.id}`}
              onClick={(e) => irPara(e, item.id)}
              aria-current={atual ? "true" : undefined}
              className={`aba inline-flex h-12 shrink-0 items-center rounded-full px-3 text-corpo font-semibold transition-[color,background-color] duration-200 sm:px-4 md:px-5 ${
                atual ? "vidro-ativo text-tinta" : "text-tinta/80 hover:bg-tinta/10 hover:text-tinta"
              }`}
            >
              <span className="md:hidden">{item.rotuloCurto}</span>
              <span className="hidden md:inline">{item.nome}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
