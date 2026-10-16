/**
 * Quebra um título em linhas curtas para os títulos editoriais (cada linha é revelada por máscara).
 * Junta palavras enquanto a linha couber em `maximo` caracteres.
 * Ex.: "Copo da felicidade" → ["Copo da", "felicidade"].
 */
export function quebrarEmLinhas(texto: string, maximo = 8): string[] {
  const linhas: string[] = [];
  for (const palavra of texto.split(/\s+/u).filter(Boolean)) {
    const atual = linhas.at(-1);
    if (atual !== undefined && `${atual} ${palavra}`.length <= maximo) {
      linhas[linhas.length - 1] = `${atual} ${palavra}`;
    } else {
      linhas.push(palavra);
    }
  }
  return linhas;
}
