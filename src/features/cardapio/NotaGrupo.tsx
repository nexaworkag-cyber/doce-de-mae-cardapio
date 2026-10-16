import { textoMinimo } from "@/lib/cardapio";
import { Medida } from "@/components/Medida";

/**
 * Informações que o cardápio dá para um GRUPO de produtos (medida comum, porção, mínimo).
 * Sempre no mesmo estilo e logo abaixo do título do grupo, para não parecer botão nem ficar solto.
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
    <p className={`flex flex-wrap gap-x-5 gap-y-1 text-apoio font-semibold text-(--texto-apoio) ${className}`}>
      {medida && <Medida medida={medida} />}
      {porcao && <span>{porcao}</span>}
      {pedidoMinimo && <span>{textoMinimo(pedidoMinimo)}</span>}
    </p>
  );
}
