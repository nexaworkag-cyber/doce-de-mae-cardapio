# Auditoria e proposta de cores (17/10/2026) — aguardando aprovação

Capturas "antes": `docs/auditoria-cores/antes/` (mobile-375 e desktop-1280).

## 1. Paleta original

Oficiais: Creme #FFF4C7 · Chocolate #52352F · Espresso #49362F · Rosa-argila #B97874 · Rosa-antigo #AB898C ·
Figo #66705A · Dourado #DEC58D.
Apoio: Leite #FFFAE6 · Nata #FFFDF6 · Baunilha #F7EBC9 · Linha #E6D7B4 · Cacau #75605A · Rosa-profundo #8E4F4C.

## 2. Problemas encontrados

| # | Problema | Onde | Gravidade |
|---|---|---|---|
| P1 | **Seis blocos de cor forte empilhados** (topo chocolate, 4 faixas de categoria, rodapé figo). Nenhum é o principal; os títulos gritam mais que os produtos | Página inteira | Alta |
| P2 | **Fundo creme #FFF4C7 em 100% da tela**: amarelo saturado demais como base; deixa os cartões nata acinzentados e vai amarelar a fotografia | `globals.css` | Alta |
| P3 | **Cor sem função**: rosa-profundo = título de Docinhos e borda; chocolate = topo e título de Brownies; o mesmo papel muda de cor por seção ("cores espalhadas entre seções") | `categorias.css` | Alta |
| P4 | **Ação principal inconsistente**: WhatsApp é espresso na folha e creme sobre figo no rodapé; a aba ativa muda de cor a cada categoria — ação e estado não têm cor própria | Folha, rodapé, abas | Alta |
| P5 | **Marcador de foto com tom por categoria + degradê decorativo** (luz, fundo infinito): ruído cromático no lugar onde a foto deve mandar | `prancha.css`, `categorias.css` | Média |
| P6 | **Contraste no limite**: espresso sobre rosa-argila 3,24:1 (só passa como texto grande); ícones dourados sobre figo 3,10:1; borda linha sobre leite 1,36:1 (abas inativas quase somem) | Faixa do Copo, rodapé, abas | Média |
| P7 | **Hierarquia achatada**: nome, informações e preço com o mesmo peso de cor; grupo ("Mini palha") quase igual ao texto | Cartões, grupos | Média |
| P8 | **Duas superfícies claras competindo** (creme da página, nata dos cartões, baunilha do quadro) sem papel definido | Seções | Baixa |

**Onde deve ser neutro:** fundo, cartões, área de foto, títulos de categoria, textos, abas inativas.
**Onde deve haver destaque:** botão de encomenda, aba ativa, preço (por peso, não cor), nome de grupo e pequenos detalhes de marca.

## 3. Arquitetura proposta — tokens semânticos

| Token | HEX | Origem | Função | Contraste |
|---|---|---|---|---|
| `background/base` | #FFFAE6 | Leite | Fundo da página (≈70%) | — |
| `background/alternate` | #F7EBC9 | Baunilha | Faixas de apoio: quadro de sabores, área de foto vazia | espresso 9,55 · cacau 4,94 |
| `surface/default` | #FFFDF6 | Nata | Cartões | espresso 11,14 |
| `surface/elevated` | #FFFDF6 + sombra | Nata | Folha de detalhe, abas presas, botão fechar | — |
| `surface/brand` | #52352F | Chocolate | Topo e rodapé (moldura da marca, ≈20%) | creme 9,96 · dourado 6,54 |
| `text/primary` | #49362F | Espresso | Títulos, nomes, preços | 10,8 no fundo |
| `text/secondary` | #75605A | Cacau | Informações, descrições, legendas | 5,61 no fundo |
| `text/on-brand` | #FFF4C7 | Creme | Texto sobre chocolate | 9,96 |
| `accent/primary` | #8E4F4C | Rosa-profundo | Nome do grupo, rótulos de sabores, detalhes | 5,95 no fundo |
| `accent/soft` | #F0E8E3 | Rosa-antigo 18% + Nata | Fundo de selo/aba ativa suave, realce discreto | rosa-profundo 5,15 |
| `accent/brand` | #DEC58D | Dourado | Só sobre chocolate: monograma, "Cardápio", ícones | 6,54 |
| `accent/decor` | #B97874 | Rosa-argila | Só decorativo (pontos dos sabores); nunca texto | 3,34 (gráfico ≥3) |
| `border/subtle` | #E6D7B4 | Linha | Divisores e contornos de cartão (com sombra) | decorativo |
| `border/control` | #75605A @ 35% | Cacau | Contorno de abas inativas | ≥3:1 com o anel |
| `action/primary` | #8E4F4C | Rosa-profundo | **Encomendar pelo WhatsApp** (único botão forte) | creme 5,64 |
| `action/hover` | #7B4844 | Rosa-profundo 72% + Espresso | Hover | creme 6,67 |
| `action/pressed` | #68413C | Rosa-profundo 45% + Espresso | Pressionado | creme 7,89 |
| `action/secondary` | transparente + borda espresso | — | Ações secundárias (telefone, Instagram) | espresso 10,8 |
| `nav/active` | #49362F | Espresso | Aba ativa (estado, não ação) | creme 10,27 |
| `focus/ring` | #8E4F4C (claro) · #DEC58D (sobre chocolate) | — | Anel de foco 2 px + 2 px de afastamento | 5,95 · 6,54 |
| `state/success` | #66705A | Figo | Confirmações | 4,98 no fundo |
| `state/error` | #9B3B36 | derivado do rosa-profundo | Erros (reservado) | 6,53 |

## 4. Distribuição (≈70/20/10)

- **70% neutro quente:** leite no fundo, nata nos cartões, baunilha nas áreas de apoio. A foto do doce passa a ser a cor mais forte de cada cartão.
- **20% marca:** chocolate como moldura — topo e rodapé (o rodapé deixa de ser figo, fechando a página como ela abre). Espresso em todo o texto principal.
- **10% destaque:** rosa-profundo só no que pede atenção — botão de encomenda, nome do grupo e detalhes; dourado só sobre chocolate.

## 5. Decisões principais

1. **Títulos de categoria sem faixa colorida**: Archivo extrabold espresso sobre o fundo, com um fio linha abaixo. A hierarquia vem do tamanho e do peso; a cor fica para os produtos.
2. **Uma cor de ação em todo o cardápio** (rosa-profundo): o WhatsApp vira o único elemento saturado recorrente, então o olho sabe onde agir. A aba ativa usa espresso — estado ≠ ação.
3. **Fundo leite em vez de creme**: o creme oficial continua presente como texto sobre chocolate (topo e rodapé), onde brilha sem saturar a tela.
4. **Marcador de foto neutro e liso** (baunilha, sem degradê): a cor virá da fotografia.
5. **Papéis fixos para as cores de apoio**: figo = sucesso; rosa-argila = só decoração; rosa-antigo = base do tom suave. Nenhuma cor muda de função entre seções.
6. **Hierarquia do cartão**: nome espresso bold → informações cacau → preço espresso grande; unidade ("o cento") em cacau.
7. **Tudo via tokens semânticos** no `tokens.css`; componentes deixam de usar nomes de cor crus (`bg-chocolate`, `text-rosa-profundo`) e passam a usar a função (`bg-marca`, `text-destaque`). `categorias.css` sai.
