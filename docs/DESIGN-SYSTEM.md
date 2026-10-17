# Design system — Cardápio Doce de Mãe (v0.2 · cartões)

> Tokens em `src/styles/tokens.css` (Tailwind v4 `@theme`). **A paleta padrão do Tailwind foi removida**:
> só as cores abaixo existem. Componentes usam tokens — nada de cores, fontes, sombras ou raios soltos.

## 1. Cores

Oficiais da logo (`cores.json` da marca) + tons de apoio já aprovados no design system da marca.

| Token | Hex | Papel |
|---|---|---|
| `creme` | `#FFF4C7` | Texto sobre escuros |
| `chocolate` | `#52352F` | Abertura, faixas escuras, fundo do monograma |
| `espresso` | `#49362F` | Texto principal, botão principal, barra de navegação |
| `rosa-argila` | `#B97874` | Destaque: tarja, pontos dos sabores, foco |
| `rosa-antigo` | `#AB898C` | Cor de prancha |
| `figo` | `#66705A` | Faixa da palha italiana, cor de prancha |
| `dourado` | `#DEC58D` | Acabamento: monograma, pílula ativa, selos sobre chocolate |
| `leite` | `#FFFAE6` | Fundo da página |
| `nata` | `#FFFDF6` | Superfície dos cartões e do quadro de sabores |
| `baunilha` | `#F7EBC9` | Fundo alternativo, chips, rodapé |
| `linha` | `#E6D7B4` | Divisores (decorativos) |
| `cacau` | `#75605A` | Texto secundário |
| `rosa-profundo` | `#8E4F4C` | Anel de foco, ícones de contato |

### Contrastes usados (WCAG 2.2, calculados)

| Texto / fundo | Razão | Uso |
|---|---|---|
| espresso / leite | 10,84 | Qualquer texto |
| espresso / baunilha | 9,55 | Qualquer texto |
| cacau / leite | 5,61 | Texto secundário |
| cacau / baunilha | 4,94 | Texto secundário |
| creme / chocolate | 9,96 | Qualquer texto |
| creme 82% / chocolate | 7,32 | Texto secundário em faixa chocolate (`--texto-apoio`) |
| creme / figo | 4,72 | Qualquer texto (sem transparência) |
| creme 90% / espresso | 8,67 | Navegação |
| dourado / chocolate | 6,54 | Chips e rótulos |
| espresso / dourado | 6,74 | Item ativo da navegação |
| espresso / rosa-argila | 3,24 | **Só título grande** (tarja "delícias") |

Texto secundário usa `--texto-apoio` e o link "Ver detalhes" usa `--texto-acao`, definidos por seção (clara → cacau / rosa-profundo; chocolate → creme 82% / dourado; figo → creme / creme).

## 2. Tipografia

| Token | Tamanho (375 → 1280+) | Família | Uso |
|---|---|---|---|
| `text-secao` | 26 → 40 px · 1,05 | Archivo 800 | Títulos de categoria, "Faça sua encomenda!" |
| (cartão) | 16–17 px | Figtree 700 | Nome do produto |
| (cartão) | 20 px | Figtree 600 tabular | Preço |
| `text-corpo-lg` | 18 px · 1,5 | Figtree | Abertura de texto |
| `text-corpo` | 16 px · 1,55 | Figtree | Leitura |
| `text-apoio` | 15 px · 1,45 | Figtree | Secundário, navegação |
| `text-legenda` | 13 px · 1,35 | Figtree | Selo, contagem de sabores, aviso |

- Utilitário `display` = Archivo 900, largura 125%, caixa alta (só visual).
- Máscara de linha (`.linha`) tem folga vertical para não cortar Ã, Í, Ç.
- Fontes servidas pelo próprio site via `next/font` (sem requisição ao Google no navegador).

## 3. Espaço, cantos, sombras

- Margem lateral `--margem`: 20 px (375) → 64 px; largura máxima 1280 px (`moldura`).
- Área de toque mínima: **44 × 44 px** (testada).
- Cantos: `rounded-prancha` 28 px (fotos), `rounded-folha` 32 px (folha do cardápio, detalhe), pílulas `rounded-full`.
  Fotos que sangram até a borda perdem o canto daquele lado.
- Sombras tingidas de espresso: `shadow-flutuante` (barra, botões), `shadow-folha` (folha sobre a abertura).

## 4. Componentes

| Componente | Arquivo | Notas |
|---|---|---|
| `Monograma` | `components/Monograma.tsx` | PNG oficial, 3 combinações (dourado, chocolate, creme). Decorativo por padrão |
| `FotoProduto` | `components/FotoProduto.tsx` | Área de foto com proporção fixa; foto real via `next/image` ou marcador "Foto em breve" (`seloCentral` nos cartões, `compacto` para miniaturas) |
| `Preco` | `components/Preco.tsx` | "R$" e "o cento" menores, tabular; a unidade pode quebrar linha, o valor não |
| `Medida` | `components/Medida.tsx` | Quadrado preenchido na proporção entre 5×5 e 3×3 |
| `Icone` | `components/Icone.tsx` | Traço estilo Lucide, inline (sem dependência) |
| `Cabecalho` | `features/cabecalho/` | Topo compacto em chocolate com monograma dourado |
| `AbasCategorias` | `features/navegacao/` | Abas presas ao topo, scroll-spy, aba ativa espresso |
| `SecaoCategoria` | `features/cardapio/` | Título + recheios + grupos (NotaGrupo + grade de cartões) + quadro de sabores |
| `CartaoMenu` | `features/cardapio/` | Cartão nata arredondado (28 px): foto quadrada, nome, informações, preço; o cartão inteiro abre o detalhe |
| `NotaGrupo` | `features/cardapio/` | Medida comum, porção e mínimo de um grupo, em texto |
| `QuadroSabores` | `features/cardapio/` | Sabores de cada linha de docinhos |
| `ListaSabores` | `features/cardapio/` | Sabores em 2 colunas na folha de detalhe |
| `DetalheProvider` / `FolhaDetalhe` | `features/detalhe/` | `<dialog>` + View Transitions + histórico |

## 5. Acessibilidade

- HTML semântico: `header` / `main` / `section[aria-labelledby]` / `footer`, títulos h1 → h4 em ordem.
- Link "Pular para o cardápio"; foco visível (anel rosa-profundo; dourado sobre escuros).
- Produto = `button[aria-haspopup=dialog]` com o nome; folha = `dialog[aria-labelledby]`; foco volta ao produto ao fechar.
- Barra flutuante fica `inert` enquanto escondida; item ativo com `aria-current`.
- Medidas lidas como "5 por 5"; marcadores de foto com `role=img` e rótulo explícito.

## 6. Movimento

Só CSS, Web Animations API e View Transitions; nada se mexe sozinho. Toque no cartão (encolhe 3%),
abas deslizando até a ativa, foto do cartão para a folha e folha subindo (saída ~60% da entrada).
`--motion-fast` 200 ms, `--ease-editorial` para entradas, `--ease-saida` para saídas.
**"Reduzir movimento" desliga tudo** (testado).
