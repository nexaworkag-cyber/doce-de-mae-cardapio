# Laboratório 2: lettering original para CARDÁPIO (18/10/2026) · aguardando aprovação

Isolado em `docs/direcao-tipografica/lab2/`. O site não foi alterado.
Arquivos: `direcao-1-bico.html`, `direcao-2-rotulo.html`, `painel-referencias.html`.
Capturas em `capturas/` (390×844 a 2x e 1440×900; `-topo` = recorte do topo).
Para refazer: `node docs/direcao-tipografica/lab2/capturar.mjs`.

## Ferramentas

| Ferramenta | Estado |
|---|---|
| Navegador embutido | conectado (usado para estudar o site da Kina) |
| Playwright | instalado no projeto (capturas das referências e das propostas) |
| Figma, conector do claude.ai | conectado como "Nexa Agencia", **assento View, plano Starter**: não edita arquivos de equipe e tem cota mensal de chamadas muito baixa |
| Figma, plugin `figma@claude-plugins-official` | instalado, mas o servidor do plugin pede autorização em `/mcp`; as skills (`figma-use`, `figma-generate-design`…) já aparecem |
| frontend-design | carregada |
| ui-ux-pro-max | carregada; a busca local precisa de Python, ausente neste PC |
| Lettering e tipografia | nenhuma ferramenta específica; o lettering foi desenhado à mão em SVG |

## Direção 1 · Bico de confeitar

- **Lettering:** desenho próprio, monolinear, como um traço contínuo de saco de confeitar.
  - Grade: maiúsculas de 100 unidades, traço 16, cantos e junções redondos.
  - **Detalhe próprio:** onde o bico para, fica uma gota (terminal em bola).
  - Um fio creme no centro de cada traço dá o brilho de cobertura.
  - O **acento do Á é uma pincelada que termina em gota**, a assinatura do desenho.
  - O O começa e termina no alto, com a gota marcando o ponto de partida.
- **Espaçamento:** ajustado par a par.
  - O A entra na abertura do C (−6), o Á aproxima do D (−4).
  - As gotas da base têm 5 unidades de folga entre si.
- **Composição:** aberta, sem cartão; a palavra pousa direto no creme.
  - Embaixo, uma borda de bolo (festonê) em rosa-argila com gotas nas pontas.
  - O monograma original fica no centro, interrompendo a borda, como o enfeite do bolo.
- **Cores:** chocolate e rosa-argila sobre creme.
- **Telas:** no celular a palavra ocupa a largura toda; no desktop fica limitada a 860 px e centralizada.

## Direção 2 · Rótulo empilhado

- **Lettering:** desenho próprio, pesado e condensado.
  - Traço 22 com cortes retos; as curvas são "estádios" (retas que fecham em meio-círculo), como letreiro de caixa de doces.
  - **Detalhe próprio:** o A virou um arco de vitrine, sem ponta.
  - O acento é uma cunha arredondada em dourado.
- **Composição:** a palavra é quebrada na sílaba, **CAR / DÁPIO**, num bloco justificado.
  - O monograma dourado ocupa o fim da primeira linha, na mesma altura das letras (símbolo no ritmo, não marca-d'água).
  - O acento fica entre as linhas, encaixado sob o A de cima.
  - Letras quase se tocando (espaço de 4 unidades).
- **Superfície:** cartão chocolate com fio dourado interno; é a combinação principal da marca.
  - No desktop, "DOCE DE MÃE" aparece na vertical ao lado do bloco, como texto de embalagem.
- **Cores:** creme e dourado sobre chocolate; contraste do creme 9,96:1.

## O que mudou depois da primeira revisão das capturas

- **D1:** o monograma batia nas gotas da base. Desci a borda e reduzi o monograma.
- **D1:** o brilho deslocado parecia impressão fora de registro; agora fica centralizado no traço.
- **D1:** o monograma passava do limite do topo; ganhou espaço embaixo.
- **D2:** o corte reto da perna do R passava da linha de base; agora é recortado nela.
- **D2:** no desktop, o texto vertical estava solto na borda; agora fica junto do bloco.

## Princípios das referências (sem copiar)

1. **Um detalhe próprio por marca:** a gota (D1) e o arco do A com o acento dourado (D2).
2. **Bloco em vez de linha:** CAR / DÁPIO (D2).
3. **Símbolo no ritmo da palavra:** o monograma na altura das letras (D2) ou como enfeite da borda (D1).
4. **Espaçamento óptico par a par** nas duas.
5. **Paleta curta, sem degradê decorativo.**

## Pendências antes de aplicar

- **Desenho:** as letras foram desenhadas só para esta palavra. Se a escolhida virar logotipo, vale refinar as curvas no Figma ou num editor vetorial com acesso de edição.
- **Implementação:** no site, a palavra entra como SVG inline com texto acessível (`sr-only`), sem fonte nova, portanto sem custo de licença.
