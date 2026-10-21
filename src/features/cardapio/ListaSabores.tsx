import type { CSSProperties } from "react";

/**
 * Sabores como numa carta impressa: duas colunas, Figtree, um ponto (marcador) antes de cada um.
 * No cardápio, entram em sequência (40 ms por item) quando a lista aparece na tela.
 */
export function ListaSabores({
  sabores,
  revelar = true,
  className = "",
}: {
  sabores: readonly string[];
  revelar?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-legenda font-semibold text-tinta-suave">{sabores.length} sabores</p>
      <ul
        data-revelar={revelar ? "lista" : undefined}
        className="mt-3 columns-2 gap-x-6 text-corpo leading-snug font-medium sm:text-corpo-lg"
      >
        {sabores.map((sabor, i) => (
          <li
            key={sabor}
            className="flex break-inside-avoid items-baseline gap-2.5 pb-2"
            style={{ "--i": i } as CSSProperties}
          >
            <span aria-hidden="true" className="block size-1.5 shrink-0 -translate-y-0.5 rounded-full bg-marcador" />
            {sabor}
          </li>
        ))}
      </ul>
    </div>
  );
}
