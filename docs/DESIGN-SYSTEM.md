# Design system: Cardápio Doce de Mãe (v0.3)

> Fonte única: `src/styles/tokens.css` (Tailwind v4). A paleta padrão do Tailwind foi removida.
> Capturas de antes e depois da v0.3 ficam em `docs/design-system/`.

## 0. Como está organizado

Os tokens ficam em três camadas. Cada camada só conversa com a de cima.

```
Primitivas   creme, chocolate, espresso, cacau, linha…   valores crus, usados só em tokens.css
     ↓
Semânticas   fundo, superficie, tinta, divisor, destaque…   o papel da cor: é o que os componentes usam
     ↓
Receitas     titulo-secao, cartao, painel, botao-acao…   peças prontas para títulos, categorias e cartões
```

**Regra de ouro:**
- Um componente nunca escreve `text-espresso` ou `bg-nata`. Ele usa o papel: `text-tinta`, `bg-superficie`.
- Também não escreve tamanhos soltos (`text-[1.25rem]`). Ele usa a escala: `text-preco`.
- **Exceção 1:** os tons do marcador de foto (`data-tom`, em `prancha.css`). Ali a cor da marca é o próprio dado.
- **Exceção 2:** as proporções relativas dentro do `Preco` (`0.62em`).

## 1. Cor

### Primitivas (oficiais da logo e apoio)

| Primitiva | Hex | Primitiva | Hex |
|---|---|---|---|
| `creme` | `#FFF4C7` | `leite` | `#FFFAE6` |
| `chocolate` | `#52352F` | `nata` | `#FFFDF6` |
| `espresso` | `#49362F` | `baunilha` | `#F7EBC9` |
| `rosa-argila` | `#B97874` | `linha` | `#E6D7B4` |
| `rosa-antigo` | `#AB898C` | `cacau` | `#75605A` |
| `figo` | `#66705A` | `rosa-profundo` | `#8E4F4C` |
| `dourado` | `#DEC58D` | `verde-whatsapp` / `-escuro` | `#25D366` / `#1FBF5B` |

### Semânticas: o que usar

| Papel | No claro | Dentro de `.escuro` | Para quê |
|---|---|---|---|
| `fundo` | leite | (não muda) | Página, folha de detalhe, selo "Foto em breve" |
| `superficie` | nata | (não muda) | Cartões e quadro de sabores |
| `realce` | baunilha | (não muda) | Faixa de regras do grupo, marcador sem foto |
| `painel` | chocolate | (não muda) | Topo e rodapé |
| `tinta` | espresso | creme | Texto principal e todos os títulos |
| `tinta-suave` | cacau | creme 82% | Informações, descrições, contagens, avisos |
| `divisor` | linha | creme 22% | Fio sob o título, contorno do cartão, linhas |
| `destaque` | rosa-profundo | dourado | Texto interativo (sabores) e anel de foco |
| `marcador` | rosa-argila | (não muda) | Pontos dos sabores, seleção de texto |
| `acabamento` | dourado | (não muda) | Monograma e ícones sobre o painel |
| `acao` / `acao-pressionada` | verde | (não muda) | **Só** o botão de encomendar |
| `sobre-acao` / `sobre-painel` | espresso / creme | (não muda) | Texto dos botões |

**Contexto escuro:**
- A classe `.escuro` redefine os papéis e a cor do texto.
- O que fica dentro dela (topo, abas de vidro, rodapé) usa as mesmas classes e se ajusta sozinho, inclusive o anel de foco.
- Não há regras "se for escuro, use X" espalhadas pelos componentes.

### Proporção de uso (60 · 30 · 10)

| Parte | Cores | Onde |
|---|---|---|
| ~60% | `fundo` e `superficie` | Respiro e leitura |
| ~30% | `tinta`, `painel` e `realce` | Estrutura: textos, topo, rodapé, faixas |
| ≤10% | `destaque`, `marcador`, `acabamento` | Pontuação |
| ~1 elemento | `acao` | Uma só ação forte por tela: encomendar |

### Contrastes (WCAG 2.2, calculados)

| Texto / fundo | Razão | Uso |
|---|---|---|
| tinta / superficie · fundo · realce | 11,14 · 10,84 · 9,55 | Qualquer texto |
| tinta-suave / superficie · fundo · realce | 5,77 · 5,61 · 4,94 | Texto secundário (AA) |
| destaque / superficie | 6,12 | Sabores (linhas que abrem) |
| tinta / painel (creme / chocolate) | 9,96 | Qualquer texto |
| tinta-suave / painel (creme 82%) | 7,30 | Secundário no escuro |
| acabamento / painel | 6,54 | Ícones e monograma |
| sobre-acao / acao | 5,72 | Botão do WhatsApp |
| sobre-painel / tinta (botão escuro) | 10,27 | Botão "Ligar" |
| marcador / superficie | 3,44 | **Só elemento não textual** (pontos); nunca texto |

## 2. Tipografia

Duas famílias, servidas pelo próprio site (`next/font`):
- **Archivo 800:** títulos que organizam a página.
- **Figtree:** todo o resto.
- O lettering "Cardápio" do topo é desenho vetorial (`LetteringCardapio`), não fonte.

### Escala

| Token | Tamanho (375 → 1280 px) | Altura de linha |
|---|---|---|
| `text-secao` | 26 → 40 | 1,05 |
| `text-produto` | 28 → 40 | 1,05 |
| `text-preco-lg` | 30 | 1 |
| `text-preco` | 20 (mínimo testado) | 1 |
| `text-corpo-lg` | 18 | 1,5 |
| `text-cartao` | 16 → 17 | 1,2 |
| `text-corpo` | 16 | 1,55 |
| `text-apoio` | 15 | 1,45 |
| `text-legenda` | 13 | 1,35 |

### Hierarquia de títulos: uma receita por nível

| Nível | Receita | Visual | Onde |
|---|---|---|---|
| h1 | `LetteringCardapio` | Lettering vetorial | Topo (texto acessível em `sr-only`) |
| h2 | `titulo-secao` | Archivo 800, largura 105%, `text-secao`, −0,025em | Nome da categoria; "Faça sua encomenda!" |
| h2 (folha) | `titulo-produto` | Archivo 800, largura 105%, `text-produto`, −0,025em | Nome do produto aberto |
| h3 | `titulo-grupo` | Figtree 700, `text-corpo-lg`, −0,01em | Subgrupo ("Mini palha"), "Sabores" |
| h3 (cartão) | `titulo-cartao` | Figtree 700, `text-cartao`, −0,01em | Nome do produto no cartão |

**Regras dos títulos:**
- As receitas não levam cor; a cor vem do contexto (`tinta`). Por isso o mesmo `titulo-secao` serve na página e no rodapé escuro.
- Archivo só em h2, levemente expandido (105%, eixo `wdth`): ganha presença de letreiro sem quebrar linha em 375 px.
  O espaçamento entre letras fecha junto (−0,025em). Abaixo de h2, o peso (700) separa o título do corpo, sem trocar de família.
- Não destaque uma palavra só, nem use caixa alta em rótulos.
- Títulos com `text-wrap: balance`; parágrafos com `pretty`.

## 3. Espaço, cantos e elevação

### Ritmo vertical (proximidade: quanto mais relacionado, mais perto)

| Token | Valor | Entre |
|---|---|---|
| `respiro` | 8 px | Borda do cartão e a foto |
| (escala) `mt-1` · `mt-2` · `mt-3` | 4 · 8 · 12 px | Linhas do cartão · título do grupo e faixa · faixa e grade |
| `titulo` | 20 px | Título da categoria e o primeiro grupo |
| `grupo` | 32 px | Grupos da mesma categoria; grade e quadro de sabores |
| `secao` | 48 → 64 px | Categorias |

As classes são `mt-titulo`, `mt-grupo`, `pt-secao` e `p-respiro`.

**Outras medidas:**
- Margem lateral `--margem`: de 20 a 64 px.
- Largura útil: 62rem (`moldura`).
- Área de toque mínima: 44 × 44 px (testada).

### Cantos: quanto maior a peça, maior o raio

| Token | Raio | Peças |
|---|---|---|
| `rounded-nota` | 12 px | Faixa de regras do grupo |
| `rounded-foto` | 20 px | Foto dentro do cartão: **concêntrica**, igual ao canto do cartão menos o respiro |
| `rounded-cartao` | 28 px | Cartões e quadro de sabores |
| `rounded-painel` | 32 px | Topo, rodapé, folha de detalhe |
| `rounded-full` | – | Abas, botões, selo |

### Elevação: três níveis, nada além disso

Cada sombra tem camadas: contato (curta e nítida), meio-tom e ambiente (longa e suave), tingidas de espresso.

| Nível | Sombra | Peças |
|---|---|---|
| 1 · no papel | `shadow-cartao` | Cartões, quadro de sabores, painéis |
| 2 · flutua | `shadow-flutuante` | Abas (vidro), botões, cartão com o cursor em cima, botão fechar |
| 3 · por cima de tudo | `shadow-folha` | Folha de detalhe |

## 3b. Assinatura: o pontilhado

O detalhe autoral do cardápio é o **ponto**: o pontilhado das cartas impressas (pontos de 1,8 px a cada 6 px, cor `ponto`).

| Onde | Como |
|---|---|
| Sob o título da categoria | `fio-pontilhado` (substitui a borda e ocupa o mesmo 1 px) |
| Acima do preço no cartão | Fileira curta (36 px), centralizada; à esquerda no cartão horizontal |
| Aba ativa | Um ponto dourado de 4 px na base |
| Sabores | Os pontos `marcador` que já existiam |

- **Regra:** decorativo, nunca carrega informação. Sempre em pseudo-elemento ou fundo, para não mexer no layout.
- **Limite:** não usar em outros lugares sem motivo; o ponto vale porque aparece pouco.

## 4. Receitas de componentes

### Categoria (`SecaoCategoria`): sempre nesta ordem

```
pt-secao
h2.titulo-secao  ── fio border-divisor, pb-3
Recheios: …       text-apoio · rótulo em tinta, lista em tinta-suave   (mt-3, se houver)
┌ grupo ───────────────────────────────────────── mt-titulo (1º) / mt-grupo (demais)
│ h3.titulo-grupo                                  (se o grupo tiver nome)
│ NotaGrupo  rounded-nota bg-realce               (medida comum · porção · mínimo, mt-2)
│ grade      2 colunas → 3 em ≥768 px, gap 12 → 20 px (mt-3)
└───────────────────────────────────────────────
QuadroSabores  .cartao, mt-grupo                   (se a categoria tiver sabores)
```

- O título da categoria é neutro (tinta). A cor fica para as fotos e para a ação de encomendar.
- Dados que valem para o grupo inteiro (medida, porção, mínimo) aparecem uma vez, na `NotaGrupo`. Não se repetem em cada cartão.
- Em grupo com número ímpar de itens, o último vira cartão horizontal de linha inteira no celular. Assim a grade não fica com buraco.

### Cartão de produto (`CartaoMenu`)

```
.cartao  p-respiro (8 px) · pb-4 · centralizado
┌──────────────────────┐
│ foto  rounded-foto   │  1:1 com foto real · 4:3 com o marcador "Foto em breve"
│                      │
├──────────────────────┤
│ Nome        titulo-cartao · tinta              mt-3
│ 5×5 · 15 g  text-legenda medium · tinta-suave  mt-1  (só o que o cardápio informa)
│ Descrição   text-legenda · tinta-suave · até 3 linhas  mt-1
│                                                (espaço flexível)
│ R$ 7,00     text-preco · tabular · tinta       preso à base
└──────────────────────┘
```

- **Ordem:** foto → nome → informações → descrição → preço, sempre. O preço fica preso à base, para alinhar na grade.
- **Alinhamento interno:** todo o texto com `px-2`, na mesma margem.
- **Interação:** o cartão inteiro abre o detalhe. O botão é o nome, e a área de toque se estende ao cartão.
- **Estados:**

| Estado | Celular | Desktop |
|---|---|---|
| Repouso | nível 1 | nível 1 |
| Cursor em cima | – | sobe 2 px, nível 2 |
| Toque | foto encolhe 3% | foto encolhe 3% |
| Foco | anel `destaque` 3 px, afastado 4 px | anel `destaque` 3 px, afastado 4 px |

- **Horizontal (`largo`):** foto com 44% da largura, texto alinhado à esquerda. Só no celular.
- **Acabamento:** a foto tem um fio interno de 1 px (espresso 7%), para a borda não sumir no creme do cartão.
  Acima do preço vai o pontilhado curto (§3b).

### Outras receitas

| Receita | Composição | Usada em |
|---|---|---|
| `cartao` | `superficie` · `rounded-cartao` · nível 1 · contorno `divisor` 60% | `CartaoMenu`, `QuadroSabores` |
| `painel` + `.escuro` | `painel` · `rounded-painel` · nível 1 | `Cabecalho`, `Rodape` |
| `botao-acao` | 56 px, pílula, `acao` / `sobre-acao`, nível 2, escurece ao tocar | Encomendar (rodapé e folha) |
| `botao-escuro` | 56 px, pílula, `tinta` / `sobre-painel` | Ligar (folha) |
| `vidro` / `vidro-ativo` | Chocolate translúcido com desfoque e sombra em duas camadas / pílula mais funda com fio dourado na base e ponto dourado | Abas de categoria (inativa: creme 80%; com o cursor em cima: véu creme 10%) |

### Peças

| Componente | Arquivo | Notas |
|---|---|---|
| `Monograma` | `components/Monograma.tsx` | PNG oficial (dourado, chocolate, creme). Não alterar |
| `LetteringCardapio` | `components/LetteringCardapio.tsx` | Vetorial, `currentColor`; assinatura reta no celular, em arco no desktop |
| `FotoProduto` | `components/FotoProduto.tsx` | Proporção fixa (sem deslocamento de layout); foto real ou marcador "Foto em breve" |
| `Preco` | `components/Preco.tsx` | "R$" e "o cento" a 62%; algarismos tabulares; o valor não quebra |
| `Medida` | `components/Medida.tsx` | Quadrado preenchido na proporção real (5×5 / 3×3) |
| `Icone` | `components/Icone.tsx` | Traço estilo Lucide, sem dependência |
| `Cabecalho` | `features/cabecalho/` | Painel com foto (art direction via `<picture>`) + lettering |
| `AbasCategorias` | `features/navegacao/` | Vidro preso ao topo, acompanha a rolagem |
| `NotaGrupo` | `features/cardapio/` | Faixa `realce` com as regras do grupo |
| `QuadroSabores` / `ListaSabores` | `features/cardapio/` | Linhas que abrem (`<details>`) / 2 colunas na folha |
| `DetalheProvider` / `FolhaDetalhe` | `features/detalhe/` | `<dialog>`, View Transitions, histórico |

## 5. Acessibilidade

- HTML semântico (`header`, `main`, `section[aria-labelledby]`, `footer`), títulos de h1 a h3 em ordem.
- Link "Pular para o cardápio". Foco visível pelo papel `destaque`, que vira dourado no escuro.
- Cada produto é um botão com `aria-haspopup=dialog`. Ao fechar a folha, o foco volta ao produto.
- Medidas são lidas como "5 por 5". O marcador de foto tem `role=img` e rótulo explícito.
- O banner é decorativo (`alt` vazio).

## 6. Movimento

- **Ferramentas:** só CSS, Web Animations API e View Transitions. Nada se mexe sozinho.
- **Movimentos:**
  - toque no cartão (encolhe 3%);
  - abas deslizando até a ativa;
  - foto do cartão indo para a folha;
  - folha subindo (a saída dura cerca de 60% da entrada).
- **Tokens:** `--motion-fast` 200 ms, `--ease-editorial` nas entradas, `--ease-saida` nas saídas.
- **"Reduzir movimento" desliga tudo** (testado).

## 7. Checklist para peças novas

- [ ] Cores só por papel semântico; nada de primitiva nem hex no componente.
- [ ] Título usa uma das quatro receitas; não cria um quinto estilo.
- [ ] Espaços vêm do ritmo (`respiro`, `titulo`, `grupo`, `secao`) ou da escala.
- [ ] Canto vem da escala de raios; peça dentro de peça usa canto concêntrico.
- [ ] Sombra é um dos três níveis.
- [ ] Contraste ≥ 4,5:1 para texto (ver a tabela) e toque ≥ 44 px.
- [ ] No máximo uma ação `acao` por tela.
- [ ] Funciona dentro de `.escuro` sem regra extra.
