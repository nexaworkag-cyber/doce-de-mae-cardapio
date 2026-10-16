# Direção visual — "Edição de ateliê"

> O cardápio como uma edição de revista da casa: a voz pesada e expandida da marca nos títulos,
> a fotografia em pranchas grandes, e o ritmo claro/escuro de uma publicação impressa — em formato de app,
> desenhado primeiro para 375 px.

## Fontes desta direção

1. **Cardápio antigo** (`referencias/cardapio-antigo.jpg`): conteúdo, estrutura em dois blocos
   ("Docinhos gourmet" / "Mais delícias"), a tarja rosa sobre palavras em caixa alta e a caixa chocolate do copo.
2. **Identidade oficial da marca** (projeto da loja, somente leitura): monograma D + cupcake, cores de `cores.json`,
   Archivo (títulos) + Figtree (texto), referências de atmosfera "Dark Chocolate / Rose Clay / Fig Leaf / Dusty Mauve / Espresso".
3. **HorizonX** (só referência de técnica; nada baixado ou exportado): ver `DECISOES.md` §Referências.
4. **Skills**: `frontend-design` (direção e anti-padrões de página genérica) e `ui-ux-pro-max` (regras de toque,
   folha, movimento, deep link — consultadas na referência da skill; os scripts de busca dela exigem Python,
   que não está instalado). Revisão visual com `designer:review` (resultado em `DECISOES.md`).

## Conceito

**Doce de mãe com acabamento de ateliê.** O afeto vem das cores da marca (chocolate, creme, rosa argila, figo)
e da linguagem simples; o luxo vem da contenção: poucos elementos por tela, tipografia como imagem,
muito respiro, preço claro e discreto.

O elemento memorável é a **voz tipográfica da marca** — o nome e os capítulos em Archivo expandida, gigantes,
alternando faixas claras e escuras como uma revista — enquanto as fotos (por ora, marcadores) ocupam metade da tela.
*(Na v0.1 inicial os sabores também eram em Archivo caixa alta; a revisão de design mostrou que competiam com nome,
preço e foto, e eles passaram para Figtree em duas colunas.)*

## Composição (375 px)

```
┌───────────────┐  ABERTURA (chocolate, presa ao topo)
│     [D]       │  monograma dourado revelado por máscara
│ Cardápio      │
│ DOCE          │  wordmark Archivo 900 / 125
│ DE MÃE        │
│ frase · botão │
╰───────────────╯  a FOLHA creme sobe por cima (cantos de 32 px)
  Neste cardápio   sumário: 4 categorias + "a partir de" calculado dos dados
  DOCINHOS GOURMET
  [prancha sangrando à esquerda]   Tradicionais ........ R$ 150,00 o cento
  sabores em 2 colunas (Figtree)
  ▓ faixa chocolate ▓  [prancha sangrando à direita]  Especiais
  [prancha quadrada recuada]  Recheados  (fundo baunilha)
  MAIS DELÍCIAS (tarja rosa — herança do cardápio antigo, uso único)
  BROWNIES  [destaque 4:5] + [mini 1:1 deslocado]
  ▓ faixa figo ▓  PALHA ITALIANA  [alternadas] + Mini palha em lista com pontilhado
  ▓ faixa chocolate ▓  COPO DA FELICIDADE  [par lado a lado, o segundo deslocado]
  RODAPÉ baunilha: "Faça sua encomenda!" + WhatsApp + telefone + Instagram
  [barra flutuante de categorias na base]
```

- **Ritmo:** claro → escuro → claro → respiro → claro → figo → chocolate → baunilha. Nenhuma seção repete a anterior.
- **Assimetria:** fotos sangram para um lado ou outro, mudam de proporção (4:5, 1:1, 3:4) e de tamanho.
- **Desktop (≥ 768):** grade de 12 colunas; foto e texto em colunas opostas, alternando; detalhe em painel de 2 colunas.

## Navegação

- **Barra flutuante na base** (polegar), com as 4 categorias reais. Rótulos curtos no celular
  (Docinhos, Brownies, Palha, Copo) e completos no desktop.
- Aparece só depois da abertura; acompanha a rolagem (scroll-spy) com uma **pílula dourada que desliza**
  — uma cópia da lista recortada por `clip-path`, então o texto muda de cor exatamente dentro da pílula.
- **Sumário** no topo da folha como segundo acesso, com o menor preço de cada categoria.
- Tocar uma categoria rola suavemente até o capítulo e move o foco para o título (teclado/leitor de tela).

## Detalhe do produto

**Bottom sheet** (`<dialog>` nativo) no celular; **painel central em 2 colunas** a partir de 768 px.
Por quê: mantém o contexto do cardápio (não é uma página nova), é acessível de graça (foco preso, Esc, fundo inerte),
fecha com o gesto de arrastar, com o botão voltar e tocando fora. Cada abertura gera `#id-do-produto` na URL
(link compartilhável; "voltar" fecha). A foto **voa do cartão para a folha** (View Transitions).

## Fotografia

- **Proporções fixas** em todas as áreas de foto (`aspect-ratio`): nada se mexe quando a imagem chega (CLS zero).
- **Enquanto não houver fotos:** cada área vira um *set de fotografia vazio* na cor da marca — fundo infinito,
  luz lateral quente, textura de papel e o selo **"Foto em breve"** — sem enfeites extras, para não competir com
  a foto que virá. Para leitores de tela: "…: foto em breve (marcador provisório)". O rodapé avisa.
  Nunca simula o doce.
- **Quando as fotos chegarem** (guia para a sessão): fundo liso na cor da prancha, luz natural lateral e quente,
  produto no terço inferior (onde está a "linha do horizonte"), macros de textura para a abertura.
  Arquivos em `public/fotos/`; preencher `foto: { src, alt, largura, altura }` no produto em `src/data/cardapio.ts`.
  O `next/image` entrega AVIF/WebP no tamanho certo.
- **Abertura:** hoje é tipográfica (monograma + wordmark). Com uma foto macro real, ela pode entrar atrás do texto.

## Tipografia

| Uso | Família | Detalhe |
|---|---|---|
| Wordmark, capítulos, interlúdio, título da folha de detalhe, "Faça sua encomenda!" | Archivo | peso 900, largura 125%, caixa alta só visual |
| Sabores | Figtree 500 | 17–18 px, duas colunas, ponto rosa |
| Nome de produto | Figtree 600 | 26–38 px, tracking −0,02em — contraste fino com o título pesado |
| Preço | Figtree 600 | algarismos tabulares, "R$" e "o cento" a 62% do tamanho |
| Texto, navegação, rótulos | Figtree 400–600 | base 16 px |

Evitados de propósito: rótulos em caixa alta espaçada, numeração 01/02/03 (o cardápio não é sequência),
"→" em botões, serifa decorativa.

## Animação

Um único momento orquestrado (abertura) e, depois disso, só movimento que acompanha a leitura ou responde a um toque.
Detalhes técnicos e tempos: `DESIGN-SYSTEM.md` §6.

## O que evitar

- Cards iguais em grade, cara de marketplace, preço gritando sobre a foto.
- Frases de efeito genéricas ou promessas não confirmadas ("o melhor", "entrega rápida"…).
- Animação contínua, parallax exagerado, rolagem sequestrada, cursor customizado.
- Qualquer imagem que pareça o produto real sem ser.
