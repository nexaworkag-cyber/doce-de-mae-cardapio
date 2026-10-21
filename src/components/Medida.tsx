import { textoMedida } from "@/lib/cardapio";

/**
 * Medida do pedaço ("Pedaço de 5 × 5 cm") com um quadrado preenchido desenhado na proporção real
 * entre as medidas (5 cm maior que 3 cm), para dar noção de tamanho de relance.
 */
export function Medida({ medida, className = "" }: { medida: string; className?: string }) {
  const [a, b] = medida.split("×").map((n) => Number.parseFloat(n));
  const lado = Number.isFinite(a) ? a * 0.17 : 0.85; // em em: 5 → 0,85 em; 3 → 0,51 em

  return (
    <span className={`inline-flex items-center gap-[0.45em] tabular-nums ${className}`}>
      <span
        aria-hidden="true"
        className="block shrink-0 rounded-[2px] bg-current opacity-45"
        style={{ width: `${lado}em`, height: `${lado}em` }}
      />
      <span aria-hidden="true">Pedaço de {textoMedida(medida)}</span>
      <span className="sr-only">{Number.isFinite(b) ? `Pedaço de ${a} por ${b} centímetros` : `Pedaço de ${textoMedida(medida)}`}</span>
    </span>
  );
}
