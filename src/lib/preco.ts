const formatoBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

/** "R$ 150,00" (com espaço fixo entre o símbolo e o valor). */
export function formatarPreco(centavos: number): string {
  return formatoBRL.format(centavos / 100).replace(/\s/u, " ");
}

/** Separa o símbolo do valor para compor tipograficamente: { simbolo: "R$", valor: "150,00" }. */
export function partesDoPreco(centavos: number): { simbolo: string; valor: string } {
  const partes = formatoBRL.formatToParts(centavos / 100);
  const simbolo = partes.find((p) => p.type === "currency")?.value ?? "R$";
  const valor = partes
    .filter((p) => p.type !== "currency" && p.type !== "literal")
    .map((p) => p.value)
    .join("");
  return { simbolo, valor };
}
