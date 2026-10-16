/**
 * Medida do cardápio ("5×5", "3×3") com um quadrado preenchido desenhado na proporção real
 * entre as medidas. A unidade não é informada no cardápio, por isso não é exibida.
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
      <span aria-hidden="true">{medida}</span>
      <span className="sr-only">{Number.isFinite(b) ? `${a} por ${b}` : medida}</span>
    </span>
  );
}
