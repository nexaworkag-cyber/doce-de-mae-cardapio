# Design system — Cardápio Doce de Mãe (v0.1)

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
| `leite` | `#FFFAE6` | Fundo da folha |
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
| `text-mega` | 60 → 184 px · entrelinha 0,9 | Archivo 900/125 | Wordmark da abertura |
| `text-interludio` | 52 → 168 px · 0,98 | Archivo | "Mais delícias" |
| `text-capitulo` | 40 → 104 px · 0,88 | Archivo | Títulos de categoria |
| `text-produto` | 26 → 38 px · 1,02 | Figtree 600 | Nome do produto |
| `text-preco` | 22 → 28 px | Figtree 600 tabular | Preço |
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
| `FotoProduto` | `components/FotoProduto.tsx` | Prancha com proporção fixa (`proporcao`, `proporcaoDesktop`); foto real via `next/image` ou marcador "Foto em breve" (set vazio: cor + luz + selo); modo `compacto` para miniaturas |
| `Preco` | `components/Preco.tsx` | "R$" e "o cento" menores, tabular |
| `Medida` | `components/Medida.tsx` | Quadrado preenchido na proporção entre 5×5 e 3×3 (não parece caixa de seleção) |
| `TituloEditorial` | `components/TituloEditorial.tsx` | Quebra em linhas curtas; cada linha revelada por máscara |
| `Icone` | `components/Icone.tsx` | Traço estilo Lucide, inline (sem dependência) |
| `CartaoProduto` | `features/cardapio/CartaoProduto.tsx` | Cartão inteiro clicável (botão no nome com área estendida) + pista "Ver detalhes" |
| `ListaSabores` | `features/cardapio/ListaSabores.tsx` | Sabores em 2 colunas (Figtree), no cartão e na folha |
| `NotaGrupo` | `features/cardapio/NotaGrupo.tsx` | Medida comum, porção e mínimo de um grupo — sempre logo abaixo do título do grupo, em texto (não parece botão) |
| `NavegacaoCategorias` | `features/navegacao/` | Barra flutuante com contorno dourado (visível sobre faixas escuras) + scroll-spy; sem item ativo no rodapé |
| `DetalheProvider` / `FolhaDetalhe` | `features/detalhe/` | `<dialog>` + View Transitions + histórico |

## 5. Acessibilidade

- HTML semântico: `header` / `main` / `section[aria-labelledby]` / `footer`, títulos h1 → h4 em ordem.
- Link "Pular para o cardápio"; foco visível (anel rosa-profundo; dourado sobre escuros).
- Produto = `button[aria-haspopup=dialog]` com o nome; folha = `dialog[aria-labelledby]`; foco volta ao produto ao fechar.
- Barra flutuante fica `inert` enquanto escondida; item ativo com `aria-current`.
- Medidas lidas como "5 por 5"; marcadores de foto com `role=img` e rótulo explícito.

## 6. Movimento

Só CSS, Web Animations API, IntersectionObserver e View Transitions. **Nenhuma biblioteca de animação.**

| Token | Valor | Uso |
|---|---|---|
| `--motion-fast` | 200 ms | Toque, hover, controles |
| `--motion-editorial` | 700 ms | Base das revelações |
| `--motion-hero` | 900 ms | Monograma da abertura |
| `--ease-editorial` | `cubic-bezier(.2,.8,.2,1)` | Entradas (desacelera ao chegar) |
| `--ease-saida` | `cubic-bezier(.4,0,1,1)` | Saídas (acelera ao sair; ~60% da duração da entrada) |

| Momento | Técnica |
|---|---|
| Abertura (único momento orquestrado) | Monograma revelado de baixo para cima (`clip-path`), wordmark subindo linha a linha (90 ms de intervalo), frase e botão surgindo |
| Abertura recuando | `animation-timeline: scroll()` — a abertura reduz e escurece enquanto a folha sobe (só onde há suporte) |
| Fotos | Cortina que sobe (`clip-path`) + leve aproximação da imagem, uma vez, ao entrar na tela |
| Títulos de capítulo | Linhas sobem dentro da máscara |
| Sabores | Entrada em sequência, 40 ms por item (lista em 2 colunas) |
| Navegação | Barra desliza da base; pílula ativa desliza por `clip-path` |
| Toque | Cartão encolhe 1,5% ao pressionar; foto aproxima 3% no hover (só com mouse) |
| Detalhe | Foto voa do cartão para a folha (View Transitions); folha sobe da base (celular) ou surge (desktop); fallback em WAAPI; arrastar para baixo fecha |

Regras: movimento só em `transform`, `opacity` e `clip-path` (sem layout); revelações acontecem uma vez;
estado inicial escondido só existe com `html[data-motion="ok"]` (definido antes da pintura e desligado se o JS
não iniciar em 2,5 s); **"reduzir movimento" desliga tudo** (testado).
