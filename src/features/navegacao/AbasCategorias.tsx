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
      className="sticky top-0 z-30 border-b border-linha/70 bg-leite/90 backdrop-blur-md"
    >
      <div ref={listaRef} className="moldura flex gap-1.5 overflow-x-auto py-3 [scrollbar-width:none] md:justify-center">
        {itens.map((item) => {
          const atual = ativo === item.id;
          return (
            <a
              key={item.id}
              data-aba={item.id}
              href={`#${item.id}`}
              onClick={(e) => irPara(e, item.id)}
              aria-current={atual ? "true" : undefined}
              className={`inline-flex h-11 shrink-0 items-center rounded-full px-3.5 text-apoio font-semibold transition-colors duration-200 md:px-5 ${
                atual ? "bg-espresso text-creme" : "bg-nata text-espresso ring-1 ring-linha hover:bg-baunilha"
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
