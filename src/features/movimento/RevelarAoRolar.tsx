"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __revelarPronto?: boolean;
  }
}

/**
 * Um único IntersectionObserver para todo o cardápio: adiciona `.revelado` aos elementos
 * `[data-revelar]` quando entram na tela (uma vez só). Os estilos ficam em styles/motion.css.
 *
 * Fotos começam recortadas por clip-path (área visível zero) e o observador as consideraria
 * fora da tela; por isso, para elas, observamos o elemento pai.
 */
export function RevelarAoRolar() {
  useEffect(() => {
    window.__revelarPronto = true;
    if (document.documentElement.dataset.motion !== "ok") return;

    const alvosPorObservado = new Map<Element, Element[]>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          alvosPorObservado.get(entrada.target)?.forEach((alvo) => alvo.classList.add("revelado"));
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    document.querySelectorAll<HTMLElement>("[data-revelar]").forEach((el) => {
      const observado = el.dataset.revelar === "foto" ? (el.parentElement ?? el) : el;
      alvosPorObservado.set(observado, [...(alvosPorObservado.get(observado) ?? []), el]);
    });
    alvosPorObservado.forEach((_, observado) => observador.observe(observado));

    return () => observador.disconnect();
  }, []);

  return null;
}
