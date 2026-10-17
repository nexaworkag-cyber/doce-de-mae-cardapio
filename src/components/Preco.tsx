import { partesDoPreco } from "@/lib/preco";

/**
 * Preço claro: algarismos tabulares, símbolo menor e unidade ("o cento") quando existe.
 * O valor nunca quebra; a unidade pode ir para a linha de baixo em cartões estreitos.
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
    <p className={`font-semibold tabular-nums ${className}`}>
      <span className="whitespace-nowrap">
        <span className="me-[0.18em] text-[0.62em] font-semibold tracking-wide">{simbolo}</span>
        <span>{valor}</span>
      </span>
      {unidade === "cento" && (
        <span className="ms-[0.3em] inline-block whitespace-nowrap text-[0.62em] font-medium">o cento</span>
      )}
    </p>
  );
}
