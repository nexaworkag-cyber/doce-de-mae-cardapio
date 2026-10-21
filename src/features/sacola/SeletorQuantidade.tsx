"use client";

import { useId, useState } from "react";

/**
 * − [número] + para a quantidade. Botões de 44 px; o número pode ser digitado livremente:
 * - ao tocar ou focar, o número inteiro fica selecionado (digitar já substitui);
 * - vazio, mostra o mínimo translúcido como dica;
 * - enquanto digita, valores a partir do mínimo já atualizam o total; ao sair do campo (ou Enter),
 *   o valor é ajustado ao mínimo, se ficou abaixo.
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
  // Texto em edição; null = mostrando o valor confirmado.
  const [texto, setTexto] = useState<string | null>(null);
  const limitar = (n: number) => Math.min(9999, Math.max(minimo, Math.round(n) || minimo));
  const ajustar = (n: number) => {
    setTexto(null);
    onMudar(limitar(n));
  };
  const confirmar = () => {
    if (texto === null) return;
    ajustar(Number(texto));
  };

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
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          autoComplete="off"
          placeholder={String(minimo)}
          value={texto ?? String(valor)}
          onFocus={(e) => e.currentTarget.select()}
          onPointerUp={(e) => {
            // Campo curto: todo toque seleciona o número inteiro, mesmo com o campo já em foco.
            e.preventDefault();
            e.currentTarget.select();
          }}
          onChange={(e) => {
            const digitos = e.target.value.replace(/\D/g, "").slice(0, 4);
            setTexto(digitos);
            const n = Number(digitos);
            if (digitos && n >= minimo) onMudar(n);
          }}
          onBlur={confirmar}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              confirmar();
              e.currentTarget.blur();
            }
          }}
          aria-describedby={`${id}-sufixo`}
        />
        <span id={`${id}-sufixo`} className="seletor-sufixo">{sufixo}</span>
        <button type="button" onClick={() => ajustar(valor + 1)} aria-label={`Aumentar ${rotulo.toLowerCase()}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>
        </button>
      </div>
      {texto !== null && texto !== "" && Number(texto) < minimo && (
        <span className="text-legenda font-medium text-destaque" role="status">
          Mínimo {minimo}
        </span>
      )}
    </div>
  );
}
