# CLAUDE.md — Doce de Mãe · Cardápio interativo

Instruções para agentes de IA neste projeto. `AGENTS.md` aponta para cá.

## O que é

Cardápio digital (não é loja) da Doce de Mãe. Projeto **independente** do e-commerce da marca
(`C:\Projetos\doce-de-mae`): não editar, não importar código de lá.

## Regras

1. **Não invente informação comercial.** Fonte única: `docs/referencias/cardapio-antigo.jpg`, transcrito em
   `docs/CARDAPIO-FONTE.md` e estruturado em `src/data/cardapio.ts`. Lacunas → `src/data/pendencias.ts`.
2. **Dados fora dos componentes.** Preço, nome, sabor, mínimo e contato só em `src/data/`.
3. **Use os tokens** (`src/styles/tokens.css`). A paleta padrão do Tailwind não existe aqui.
4. **Sem bibliotecas de animação** (GSAP, Lenis, Motion…). Movimento só com CSS/WAAPI/IntersectionObserver/View Transitions,
   e sempre respeitando "reduzir movimento".
5. **Não altere a logo.** Monograma em `public/brand/`.
6. **Fotos reais têm prioridade;** sem foto, use o marcador "Foto em breve". Nunca gere imagem que pareça o produto.
7. Explique antes de instalar dependências ou mudar a arquitetura. Sem deploy, push ou remoto sem autorização.

## Comandos

`npm run dev` · `npm run typecheck` · `npm run lint` · `npm run build` · `npm run test:e2e` · `npm run capturas`

## Documentação

`docs/CARDAPIO-FONTE.md` · `docs/DIRECAO-VISUAL.md` · `docs/DESIGN-SYSTEM.md` · `docs/DECISOES.md`
