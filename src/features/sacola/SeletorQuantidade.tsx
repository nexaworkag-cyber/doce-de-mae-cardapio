"use client";

import { useId } from "react";

/**
 * − [número] + para a quantidade. Botões de 44 px; o número também pode ser digitado.
 * Nunca deixa ficar abaixo do mínimo do produto.
 */
export function SeletorQuantidade({
  valor,
  minimo,
  rotulo,
  sufixo,
  onMudar,
  compacto = false,
}: {
  valor: number;
  minimo: number;
  rotulo: string;
  sufixo: string;
  onMudar: (n: number) => void;
  compacto?: boolean;
}) {
  const id = useId();
  const ajustar = (n: number) => onMudar(Math.min(9999, Math.max(minimo, Math.round(n) || minimo)));

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className={compacto ? "sr-only" : "text-apoio font-semibold"}>
        {rotulo}
      </label>
      <div className="seletor-quantidade">
        <button type="button" onClick={() => ajustar(valor - 1)} disabled={valor <= minimo} aria-label={`Diminuir ${rotulo.toLowerCase()}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" /></svg>
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={minimo}
          value={valor}
          onChange={(e) => ajustar(Number(e.target.value))}
          aria-describedby={`${id}-sufixo`}
        />
        <span id={`${id}-sufixo`} className="seletor-sufixo">{sufixo}</span>
        <button type="button" onClick={() => ajustar(valor + 1)} aria-label={`Aumentar ${rotulo.toLowerCase()}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>
        </button>
      </div>
    </div>
  );
}
