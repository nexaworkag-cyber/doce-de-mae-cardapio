# Direção visual — "Cardápio de cartões" (v0.2)

> Cardápio simples e muito bem acabado: categorias em abas, produtos em cartões brancos arredondados,
> foto no topo do cartão, nome, uma linha de informações e o preço em destaque. Parece cardápio, não site.

**Por que mudou (17/10/2026):** a v0.1 ("Edição de ateliê": abertura de tela inteira, faixas coloridas,
títulos gigantes, revelações ao rolar) foi aprovada tecnicamente, mas a família achou que parecia um site.
A referência enviada é um cardápio de cartões (foto do produto recortada, nome, descrição curta, preço).
A v0.1 está no histórico do Git (commit `13a2033`).

## Estrutura (375 px)

```
╭───────────────────────╮  topo compacto em chocolate: monograma dourado, DOCE DE MÃE, "Cardápio"
╰───────────────────────╯
[Docinhos] [Brownies] [Palha] [Copo]   ← abas presas ao topo (rótulos completos no desktop)

Docinhos gourmet
┌──────────┐ ┌──────────┐   cartões 2 por linha (3 no tablet, 4 no desktop)
│  foto    │ │  foto    │
│ Nome     │ │ Nome     │
│ info     │ │ info     │
│ R$ 0,00  │ │ R$ 0,00  │
└──────────┘ └──────────┘
┌ Sabores ───────────────┐  quadro com os sabores de cada linha, como no cardápio antigo
└────────────────────────┘
Brownies · Palha italiana (5×5 e Mini palha) · Copo da felicidade
╭ Faça sua encomenda! ───╮  WhatsApp, telefone, Instagram
╰────────────────────────╯
```

- Mínimo, porção e medida de **grupo** aparecem uma vez, logo abaixo do título (NotaGrupo).
- Tocar no cartão abre a folha de detalhe (bottom sheet no celular, painel no desktop), com o botão do WhatsApp.

## Fotografia

- Área de foto **quadrada** no cartão, com proporção fixa (sem CLS).
- Sem foto real: marcador **"Foto em breve"** em fundo baunilha neutro, igual em todos os cartões
  (quando as fotos chegarem, a cor vem do doce). Nunca simula o produto.
- Fotos ideais para este layout: produto inteiro, **recortado ou em fundo claro liso**, centralizado, luz suave —
  como na referência. Arquivo em `public/fotos/` + `foto: { src, alt, largura, altura }` em `src/data/cardapio.ts`.

## Tipografia e cor

- Archivo 900 expandida só no nome da marca; Archivo 800 nos títulos de categoria e "Faça sua encomenda!".
- Figtree no resto: nome do produto 16–17 px negrito, informações 13 px, preço 20 px com algarismos tabulares.
- Fundo leite, cartões nata com sombra suave, texto espresso; chocolate e dourado no topo; rosa só em detalhes.

## Movimento

Mínimo e só em resposta ao toque: abas que deslizam até a ativa, cartão que afunda levemente ao tocar,
foto que passa do cartão para a folha (View Transitions) e folha que sobe. Nada se mexe sozinho.
"Reduzir movimento" desliga tudo.
