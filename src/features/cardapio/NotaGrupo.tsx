import { textoMinimo } from "@/lib/cardapio";
import { Medida } from "@/components/Medida";

/**
 * Regras que o cardápio dá para um GRUPO de produtos (medida comum, porção, mínimo).
 * Faixa clara logo abaixo do título: é regra de encomenda, precisa ser vista, mas não pode parecer botão.
 */
export function NotaGrupo({
  medida,
  porcao,
  pedidoMinimo,
  className = "",
}: {
  medida?: string;
  porcao?: string;
  pedidoMinimo?: number;
  className?: string;
}) {
  if (!medida && !porcao && !pedidoMinimo) return null;
  return (
    <p
      className={`flex w-fit flex-wrap items-center gap-x-4 gap-y-1 rounded-nota bg-realce px-3.5 ring-1 ring-divisor/70 ring-inset py-2 text-apoio font-semibold text-tinta ${className}`}
    >
      {medida && <Medida medida={medida} />}
      {porcao && <span>{porcao}</span>}
      {pedidoMinimo && <span>{textoMinimo(pedidoMinimo)}</span>}
    </p>
  );
}
