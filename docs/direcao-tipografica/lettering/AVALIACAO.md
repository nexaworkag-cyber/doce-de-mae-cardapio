# Lettering CARDÁPIO: estudos e avaliação crítica (18/10/2026) · aguardando escolha

Todas as letras são **contornos vetoriais** (curvas Bézier cúbicas) gerados por `gerar.mjs`. Nenhuma fonte é usada nas letras e nenhum efeito de CSS.
- SVGs finais: `estudo-1-gota.svg`, `estudo-2-vitrine.svg`, `estudo-3-pena.svg`, `estudo-4-caramelo.svg`.
- Pranchas: `estudos.html` (os três lado a lado + vista de construção com nós e alças) e `estudo-4.html`.
- Capturas em `capturas/`. O cardápio não foi alterado.

**Processo:**
- Construção geométrica com grade própria por estudo.
- Espaçamento por perfil (a distância mínima entre as silhuetas, faixa a faixa de altura), mais ajuste óptico par a par.
- Revisão nas capturas e correção. Foram três rodadas: a primeira saiu apertada demais (Gota), com espaçamento quebrado pelas serifas (Vitrine) e ilegível (Pena).

## 4 · Caramelo (feito a partir da referência que você mandou)
- **Desenho:** "Cardápio" com C maiúsculo, alto contraste (hastes de 30, fios de 7 a 9) e terminais em bola.
- **C:** termina num caracol com bola, eco do caracol do D do monograma. É o gesto principal.
- **a:** de dois andares, com gancho e bola; o r tem bandeira com bola.
- **Acento:** gota inclinada, com a ponta afinando para baixo e à esquerda.
- **Hastes:** têm uma leve cintura (laterais côncavas), para não parecerem retângulos.
  - A ascendente do d tem o topo inclinado; a descendente do p, a base inclinada.
- **Assinatura:** "Doce de Mãe" em cursiva vetorial, curvada num arco e encaixada no vão entre o C e a ascendente do d (a palavra-mãe abraça a assinatura).
- **Funciona** em espresso sobre neutro e em creme sobre chocolate.
- **Pontos fortes:** é o mais memorável e o mais "marca". O caracol liga o lettering ao monograma, e o vão preenchido pela assinatura dá a composição em bloco.
- **A melhorar:**
  - a bola do gancho do á encosta na haste do d (contato intencional, mas pode abrir 2 ou 3 unidades);
  - a cursiva ainda é um esboço: o "D" e o "M" pedem mais refinamento de curva;
  - a assinatura fica pequena demais para leitura abaixo de uns 280 px de largura total.

## 1 · Gota
- **Desenho:** minúsculas pesadas e macias (haste de 34, contraste baixo), como calda.
- **Terminais:** bola no c e no r, pé curvo no a, gota no acento e bola no pingo do i (para não confundir com í).
- **Contraforma do o:** inclinada (−18°), dando um eixo caligráfico.
- **Pontos fortes:** é o mais legível em tamanho pequeno, e a mancha é escura e simpática.
- **Fraquezas:** é o mais próximo de uma "soft serif" comercial; falta um gesto único forte.
  - O pé do a e o esporão do r competem por atenção na mesma região.
  - A descendente do p ainda é reta demais.

## 2 · Vitrine
- **Desenho:** versais de alto contraste, estreitas e altas (versal 160, haste 30, fio 6).
- **Ligaduras próprias:**
  - o acento do Á nasce do prolongamento do fio esquerdo do A;
  - uma linha de base contínua une todas as letras (a "prateleira");
  - P e I se ligam pelo fio do alto.
- **Pontos fortes:** a ideia do acento como continuação do traço é a mais autoral dos quatro estudos, e o conjunto é elegante.
- **Fraquezas:**
  - o fio de 6 some em tela de celular, onde a palavra fica com cerca de 40 px de altura;
  - o bico do C ainda está duro;
  - "PIO" fica apertado: a bojo do P quase toca o I.
  - A linha de base contínua pode ser lida como sublinhado.

## 3 · Pena
- **Desenho:** cursiva de pena chata (ângulo de 35°), com ligações por fora dos bojos, laço na ascendente do d e arremate do o para a direita.
- **Acento:** feito com a pena girada (−48°) para ganhar peso.
- **Contorno:** em cada trecho é a varredura real da pena, isto é, a curva central deslocada ± meia pena.
- **Pontos fortes:** é o mais pessoal ("feito à mão, feito por mãe") e tem o ritmo mais vivo.
- **Fraquezas:**
  - a cursiva desenhada à mão em coordenadas ainda tem curvas irregulares (o r e o p);
  - é o menos legível dos quatro;
  - precisaria de refinamento num editor vetorial para virar marca.

## Recomendação

**4 · Caramelo.** É o que mais se aproxima da referência que você aprovou e o que tem um gesto memorável próprio (o caracol do monograma). Também resolve, ao mesmo tempo, "Cardápio" e "Doce de Mãe".
Uma mistura possível: o acento-continuação do estudo 2 aplicado ao Caramelo.

**Próximo passo, depois da escolha:**
- refinar as curvas (de preferência no Figma, com assento de edição) e acertar o kerning final;
- testar em 390 px e 1440 px;
- só então aplicar no topo do cardápio.
