import { CARDAPIO, type Categoria, type CategoriaId, type Grupo, type Produto } from "@/data/cardapio";

/** Produto com o contexto da categoria e do grupo já resolvido (mínimo, porção, recheios). */
export type ProdutoResolvido = Produto & {
  categoria: Pick<Categoria, "id" | "nome">;
  grupoNome?: string;
  pedidoMinimoEfetivo?: number;
  porcaoEfetiva?: string;
  recheios?: readonly string[];
};

function resolver(categoria: Categoria, grupo: Grupo, produto: Produto): ProdutoResolvido {
  return {
    ...produto,
    categoria: { id: categoria.id, nome: categoria.nome },
    grupoNome: grupo.nome,
    pedidoMinimoEfetivo: produto.pedidoMinimo ?? grupo.pedidoMinimo,
    porcaoEfetiva: produto.porcao ?? grupo.porcao,
    recheios: produto.semRecheio ? undefined : categoria.recheios,
  };
}

export const PRODUTOS: readonly ProdutoResolvido[] = CARDAPIO.flatMap((categoria) =>
  categoria.grupos.flatMap((grupo) => grupo.produtos.map((p) => resolver(categoria, grupo, p))),
);

const porId = new Map(PRODUTOS.map((p) => [p.id, p]));

export function buscarProduto(id: string): ProdutoResolvido | undefined {
  return porId.get(id);
}

export function buscarCategoria(id: CategoriaId): Categoria {
  const categoria = CARDAPIO.find((c) => c.id === id);
  if (!categoria) throw new Error(`Categoria inexistente: ${id}`);
  return categoria;
}

export function produtosDaCategoria(categoria: Categoria): Produto[] {
  return categoria.grupos.flatMap((g) => g.produtos);
}

/** Valor compartilhado por todos os itens (ex.: "até 4 sabores" em todos os centos), ou undefined. */
export function valorComum<T>(valores: readonly (T | undefined)[]): T | undefined {
  const [primeiro] = valores;
  return primeiro !== undefined && valores.every((v) => v === primeiro) ? primeiro : undefined;
}

/** Menor preço da categoria, calculado a partir dos dados (usado no sumário). */
export function menorPreco(categoria: Categoria): { centavos: number; unidade?: "cento" } {
  const maisBarato = produtosDaCategoria(categoria).reduce((a, b) =>
    b.precoCentavos < a.precoCentavos ? b : a,
  );
  return { centavos: maisBarato.precoCentavos, unidade: maisBarato.unidadePreco };
}

/** Mínimo por extenso ("Mínimo de 30 unidades"): o "un." do cardápio confunde quem não conhece a abreviação. */
export function textoMinimo(unidades: number): string {
  return `Mínimo de ${unidades} ${unidades === 1 ? "unidade" : "unidades"}`;
}

/** Medida do pedaço em centímetros (confirmado pela confeitaria em 21/10/2026): "5×5" → "5 × 5 cm". */
export function textoMedida(medida: string): string {
  return `${medida.replace("×", " × ")} cm`;
}
