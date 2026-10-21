# Cardápio-fonte — transcrição e pendências

> **Fonte de verdade comercial:** o cardápio antigo usado pela família, em
> [`referencias/cardapio-antigo.jpg`](referencias/cardapio-antigo.jpg) (imagem de celular, 738 × 1600 px).
> Os dados estruturados ficam em `src/data/cardapio.ts`. **Nada foi acrescentado** além do que está no arquivo.
> Data da transcrição: 15/10/2026.

## 1. Transcrição fiel (como está no arquivo)

### Bloco "DOCINHOS GOURMET"

| Cartão | Preço | Linha pequena |
|---|---|---|
| CENTO TRADICIONAIS | R$ 150,00 | ATÉ 4 SABORES · 15G |
| CENTO ESPECIAIS | R$ 170,00 | ATÉ 4 SABORES · 15G |
| CENTO RECHEADO | R$ 200,00 | ATÉ 4 SABORES · 19G (leitura incerta) |

| TRADICIONAIS | ESPECIAIS | RECHEADOS |
|---|---|---|
| Brigadeiro | Oreo | Prestígio |
| Beijinho | Kit Kat | Ninho com Uva |
| Sensação | Tie Dye | Queijo c/ Goiabada |
| Cappucino | Meio Amargo | Morango c/ Chocolate |
| Amendoim | Ferrero Roche | Brigadeiro c/ Bolo de Cenoura |
| Casadinho | Coco Queimado | |
| Napolitano | Coco c/ Geléia de Maracujá | |
| Morango | | |
| Churros | | |
| Romeu e Julieta | | |
| Ninho com Nutella | | |

### Bloco "MAIS DELÍCIAS"

**BROWNIES**
- RECHEADO 5X5 — R$ 7,00 — Mínimo 30 uni.
- MINI 3X3 — R$ 3,00 — Mínimo 50 uni.
- RECHEIOS: Ninho · Brigadeiro · Nutella · Doce de Leite

**PALHA ITALIANA**
- TRADICIONAL 5X5 — R$ 4,00 — "Massa chocolate, biscoito maisena envolto no ninho"
- OREO 5X5 — R$ 5,00 — "Massa ninho c/ biscoito oreo envolto no leite ninho"
- Mínimo 30 uni. *(aparece uma vez, abaixo da Oreo 5X5)*
- MINI PALHA — Mínimo 50 uni.
  - TRADICIONAL 3X3 — R$ 2,50
  - OREO 3X3 — R$ 3,00

**COPO DA FELICIDADE** — 180ml · Mínimo 20 uni.
- BROWNIE — R$ 12,00 — Ninho · Brigadeiro · Doce de Leite
- BANOFFE — R$ 15,00

### Rodapé
- "Faça sua encomenda!"
- (21) 97680-4627 *(o ícone ao lado está ilegível no arquivo)*
- @docedemaetelier_ *(o ícone ao lado está ilegível no arquivo)*

## 2. Normalizações feitas na transcrição

| Original | No site | Motivo |
|---|---|---|
| `c/` | `com` | Abreviação expandida para leitura |
| `uni.` | `un.` | Abreviação padrão |
| `5X5`, `3X3` | `5×5`, `3×3` | Sinal de multiplicação tipográfico |
| `15G`, `19G` | `15 g`, `19 g` | Grafia padrão de unidade |
| `180ml` | `180 ml` | Grafia padrão de unidade |
| CAIXA ALTA | caixa normal no HTML | A caixa alta é aplicada só visualmente nos títulos |

**Não foi alterada** a grafia dos sabores (ver pendência *grafia*).

## 3. Estrutura extraída (→ `src/data/cardapio.ts`)

| Categoria | Bloco | Grupo | Produto | Preço | Dados do produto | Dados do grupo |
|---|---|---|---|---|---|---|
| Docinhos gourmet | Docinhos gourmet | — | Tradicionais (Cento tradicionais) | R$ 150,00 o cento | até 4 sabores · 15 g · 11 sabores | — |
| | | | Especiais (Cento especiais) | R$ 170,00 o cento | até 4 sabores · 15 g · 7 sabores | — |
| | | | Recheados (Cento recheado) | R$ 200,00 o cento | até 4 sabores · 15 g (confirmado) · 5 sabores | — |
| Brownies | Mais delícias | — | Recheado | R$ 7,00 | 5×5 · mínimo 30 un. | Recheios: Ninho, Brigadeiro, Nutella, Doce de Leite (categoria) |
| | | | Mini | R$ 3,00 | 3×3 · mínimo 50 un. | (idem) |
| Palha italiana | Mais delícias | 5×5 (sem título) | Tradicional | R$ 4,00 | 5×5 · descrição | mínimo 30 un. |
| | | | Oreo | R$ 5,00 | 5×5 · descrição | mínimo 30 un. |
| | | Mini palha | Tradicional | R$ 2,50 | 3×3 | mínimo 50 un. |
| | | | Oreo | R$ 3,00 | 3×3 | mínimo 50 un. |
| Copo da felicidade | Mais delícias | — | Brownie | R$ 12,00 | Ninho, Brigadeiro, Doce de Leite | 180 ml · mínimo 20 un. |
| | | | Banoffe | R$ 15,00 | — | 180 ml · mínimo 20 un. |

Regra de exibição: **o cartão mostra só o que o cardápio informa no próprio produto**; mínimo e porção de grupo
aparecem uma vez, no grupo, como no original. A folha de detalhe mostra os dois já resolvidos.

Contato (→ `src/data/contato.ts`): (21) 97680-4627 · Instagram @docedemaeatelier_ (corrigido em 21/10/2026: o original grafava "docedemaetelier_").
**Atualizado em 21/10/2026 pela família:** o número de WhatsApp e ligação passou a ser (21) 96669-6546.

## 4. Pendências (dados ausentes ou ambíguos)

Espelhadas em `src/data/pendencias.ts`. **Nenhuma é exibida como fato.**

| # | Assunto | Situação | Como está no site |
|---|---|---|---|
| P1 | **Fotos** | Nenhuma foto real fornecida | Marcador "Foto em breve" em todos os produtos + aviso no rodapé |
| P2 | Peso do cento recheado | ✅ Resolvido (confirmado pela confeitaria em 21/10/2026): 15 g cada unidade, como os demais | Exibido como "15 g cada unidade" |
| P3 | Significado do peso | ✅ Resolvido (confirmado pela confeitaria em 21/10/2026): é o peso de cada unidade | Exibido como "15 g cada unidade" |
| P4 | Menos que um cento | Só há preço por cento | Nada além do preço do cento |
| P5 | **Mínimo das palhas 5×5** | "Mínimo 30 uni." aparece uma vez, abaixo da Oreo | Exibido como mínimo do grupo 5×5 — **confirmar** |
| P6 | ~~Recheios do brownie mini~~ **Resolvida (21/10/2026):** a família confirmou que o mini não tem recheio | Lista aparece abaixo dos dois brownies | Lista no nível da categoria; o mini não pede recheio no pedido |
| P7 | Preço unitário | Presume-se preço por unidade (brownie, palha, copo) | Preço + mínimo, sem escrever "por unidade" |
| P8 | Unidade de 5×5 / 3×3 | ✅ Resolvido (confirmado pela confeitaria em 21/10/2026): centímetros | Exibido como "Pedaço de 5 × 5 cm" |
| P9 | Opções do copo Brownie | "Ninho · Brigadeiro · Doce de Leite" sem rótulo | Lista sem rótulo de "escolha" |
| P10 | **Telefone é WhatsApp?** | Ícone ilegível | Botão "Encomendar pelo WhatsApp" + link de ligação. Desligável em `src/data/contato.ts` |
| P11 | **Grafia** | Cappucino, Ferrero Roche, Geléia, Banoffe, Tie Dye | Grafia original mantida até decisão |
| P12 | Prazo, entrega, retirada, pagamento, validade, alergênicos | Ausentes | Não exibidos |
| P13 | Descrições/ingredientes dos sabores | Só as palhas 5×5 têm descrição | Nada inventado |
