import { partesDoPreco } from "@/lib/preco";

/**
 * Preço claro, sem gritar: algarismos tabulares, símbolo menor, unidade ("o cento") quando existe.
 */
export function Preco({
  centavos,
  unidade,
  className = "",
}: {
  centavos: number;
  unidade?: "cento";
  className?: string;
}) {
  const { simbolo, valor } = partesDoPreco(centavos);
  return (
    <p className={`whitespace-nowrap font-semibold tabular-nums ${className}`}>
      <span className="me-[0.18em] text-[0.62em] font-semibold tracking-wide">{simbolo}</span>
      <span>{valor}</span>
      {unidade === "cento" && <span className="ms-[0.3em] text-[0.62em] font-medium">o cento</span>}
    </p>
  );
}
