"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import type { CategoriaId } from "@/data/cardapio";

type Item = { id: CategoriaId; nome: string; rotuloCurto: string };

/**
 * Navegação por categorias, flutuando na base da tela (alcance do polegar).
 * - Aparece depois da abertura; acompanha a rolagem (scroll-spy com IntersectionObserver).
 * - O item ativo é marcado por uma pílula dourada que desliza: uma cópia da lista, em outra cor,
 *   recortada por clip-path no item ativo — o texto troca de cor exatamente dentro da pílula.
 */
export function NavegacaoCategorias({ itens }: { itens: readonly Item[] }) {
  const [ativo, setAtivo] = useState<CategoriaId | null>(null);
  const [visivel, setVisivel] = useState(false);
  const listaRef = useRef<HTMLUListElement>(null);
  const indicadorRef = useRef<HTMLUListElement>(null);

  // Visível quando a folha do cardápio passa de 60% da altura da tela.
  useEffect(() => {
    const folha = document.getElementById("cardapio");
    if (!folha) return;
    const observador = new IntersectionObserver(
      () => setVisivel(folha.getBoundingClientRect().top < window.innerHeight * 0.6),
      { threshold: [0, 0.01], rootMargin: "0px 0px -40% 0px" },
    );
    observador.observe(folha);
    return () => observador.disconnect();
  }, []);

  // Categoria ativa = capítulo que cruza a faixa entre 40% e 50% da altura da tela.
  // Acima do primeiro capítulo ou no rodapé, nenhuma fica ativa.
  useEffect(() => {
    const capitulos = itens
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const rodape = document.querySelector("footer");
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.target === rodape) {
            if (entrada.isIntersecting) setAtivo(null);
          } else if (entrada.isIntersecting) {
            setAtivo(entrada.target.id as CategoriaId);
          } else if (entrada.target.id === itens[0]?.id && entrada.boundingClientRect.top > 0) {
            setAtivo(null);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    capitulos.forEach((c) => observador.observe(c));
    if (rodape) observador.observe(rodape);
    return () => observador.disconnect();
  }, [itens]);

  // Posiciona a pílula escrevendo direto no estilo (sem re-render a cada medida).
  const posicionarPilula = useCallback(() => {
    const lista = listaRef.current;
    const indicador = indicadorRef.current;
    if (!lista || !indicador) return;
    const alvo = ativo ? lista.querySelector<HTMLElement>(`[data-item="${ativo}"]`) : null;
    if (!alvo) {
      indicador.style.opacity = "0";
      return;
    }
    const direita = lista.offsetWidth - alvo.offsetLeft - alvo.offsetWidth;
    indicador.style.opacity = "1";
    indicador.style.clipPath = `inset(0 ${direita}px 0 ${alvo.offsetLeft}px round 999px)`;
  }, [ativo]);

  useLayoutEffect(posicionarPilula, [posicionarPilula]);

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    const observador = new ResizeObserver(posicionarPilula);
    observador.observe(lista);
    return () => observador.disconnect();
  }, [posicionarPilula]);

  const irPara = (e: MouseEvent<HTMLAnchorElement>, id: CategoriaId) => {
    const alvo = document.getElementById(id);
    if (!alvo) return;
    e.preventDefault();
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    alvo.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
    alvo.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  };

  const rotulos = (item: Item) => (
    <>
      <span className="md:hidden">{item.rotuloCurto}</span>
      <span className="hidden md:inline">{item.nome}</span>
    </>
  );

  return (
    <nav
      aria-label="Categorias do cardápio"
      className="navegacao pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      data-visivel={visivel}
      inert={!visivel}
    >
      <div className="escuro pointer-events-auto relative rounded-full bg-espresso/95 p-1.5 shadow-flutuante ring-1 ring-dourado/45 backdrop-blur-md">
        <ul ref={listaRef} className="relative flex">
          {itens.map((item) => (
            <li key={item.id} data-item={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => irPara(e, item.id)}
                aria-current={ativo === item.id ? "true" : undefined}
                className="flex h-11 items-center whitespace-nowrap rounded-full px-[1.05rem] text-apoio font-semibold text-creme/90 md:px-5"
              >
                {rotulos(item)}
              </a>
            </li>
          ))}
        </ul>
        <ul
          ref={indicadorRef}
          aria-hidden="true"
          className="navegacao-indicador pointer-events-none absolute inset-1.5 flex rounded-full bg-dourado opacity-0"
        >
          {itens.map((item) => (
            <li
              key={item.id}
              className="flex h-11 items-center whitespace-nowrap px-[1.05rem] text-apoio font-semibold text-espresso md:px-5"
            >
              {rotulos(item)}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
