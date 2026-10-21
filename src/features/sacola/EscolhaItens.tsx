"use client";

/**
 * Lista de sabores/recheios para tocar e escolher. Cada item é um botão com aria-pressed:
 * vazio mostra "+", escolhido mostra o número da ordem da escolha (1, 2, 3…).
 * Ao atingir o máximo, os demais ficam indisponíveis até a pessoa desmarcar algum.
 * Com máximo 1 (recheio, sabor do copo) é escolha única: tocar em outro troca, e a marca vira ✓.
 */
export function EscolhaItens({
  titulo,
  itens,
  maximo,
  escolhidos,
  onMudar,
}: {
  titulo: string;
  itens: readonly string[];
  maximo?: number;
  escolhidos: readonly string[];
  onMudar: (escolhidos: string[]) => void;
}) {
  const unica = maximo === 1;
  const cheio = !unica && maximo !== undefined && escolhidos.length >= maximo;
  const alternar = (item: string) => {
    if (escolhidos.includes(item)) return onMudar(escolhidos.filter((e) => e !== item));
    if (unica) return onMudar([item]);
    onMudar(cheio ? [...escolhidos] : [...escolhidos, item]);
  };

  return (
    <fieldset className="escolha">
      <legend className="flex w-full items-baseline justify-between gap-3">
        <span className="titulo-grupo">{titulo}</span>
        <span className="text-apoio font-medium text-tinta-suave" aria-live="polite">
          {maximo && !unica ? `${escolhidos.length} de ${maximo}` : ""}
        </span>
      </legend>
      {maximo && !unica && <p className="mt-0.5 text-apoio text-tinta-suave">Até {maximo} sabores por cento.</p>}
      <ul className="mt-3 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
        {itens.map((item) => {
          const ordem = escolhidos.indexOf(item) + 1;
          const indisponivel = cheio && ordem === 0;
          return (
            <li key={item}>
              <button
                type="button"
                className="escolha-item"
                aria-pressed={ordem > 0}
                aria-disabled={indisponivel || undefined}
                onClick={() => !indisponivel && alternar(item)}
              >
                <span className="escolha-marca" aria-hidden="true">
                  {ordem > 0 && unica ? (
                    <svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  ) : ordem > 0 ? (
                    ordem
                  ) : (
                    <svg viewBox="0 0 24 24"><path d="M12 6v12M6 12h12" /></svg>
                  )}
                </span>
                <span className="text-left">{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
