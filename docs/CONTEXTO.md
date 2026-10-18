# Contexto para continuar em outro computador

Cole isto no começo de um chat novo com a IA (Claude Code), dentro da pasta do projeto:

> Leia `CLAUDE.md`, `docs/CONTEXTO.md`, `docs/DECISOES.md` e `docs/DIRECAO-VISUAL.md` antes de mexer.
> Continue o cardápio da Doce de Mãe de onde parou.

## Onde estamos (17/10/2026)

- **Versão atual: v0.2, o "cardápio de cartões".** Topo chocolate compacto, abas de categoria presas ao topo
  (Docinhos, Brownies, Palha, Copo), produtos em cartões brancos com área de foto, nome, informações e preço,
  quadro de sabores abaixo dos centos e rodapé "Faça sua encomenda!" com WhatsApp e Instagram.
- Tocar num cartão abre uma folha de detalhe com o botão do WhatsApp. "Voltar" fecha a folha.
- A v0.1 (visual editorial, que "parecia site") está no commit `13a2033`.
- Typecheck, lint, build e 72 testes E2E passando.

## O que a família pediu (regras que valem sempre)

- Cardápio simples, muito bem feito, com cara de **cardápio, não de site**.
- **Nada inventado:** preço, sabor, peso, tamanho, ingrediente, desconto, promoção, disponibilidade, mínimo,
  prazo ou informação nutricional, só o que está em `docs/referencias/cardapio-antigo.jpg`.
- **Não alterar a logo.** Não gerar foto falsa do produto.
- Não instalar bibliotecas de animação (GSAP, Lenis, Motion) nem skills/plugins sem avisar.
- **Sem deploy** sem autorização. Fora de escopo: carrinho, pagamento, login, cadastro, painel e frete.
- Projeto separado do e-commerce (`doce-de-mae`): não misturar.

## Próximos passos

1. **Fotos reais** dos produtos (inteiros, recortados ou em fundo claro liso): é o que mais vai melhorar o visual.
   Colocar em `public/fotos/` e preencher `foto` em `src/data/cardapio.ts`.
2. Pendências que a família precisa confirmar: `src/data/pendencias.ts` (peso 19 g, mínimo das palhas 5×5,
   se o telefone é WhatsApp, grafia dos sabores, unidade dos preços avulsos).

## Rotina em cada computador

```bash
git pull          # antes de começar
npm install       # se mudou alguma dependência
npm run dev       # abre em http://localhost:3000
git add -A && git commit -m "o que mudou" && git push   # ao terminar
```

Primeira vez num computador novo: instalar Node.js e Git, clonar o repositório, `npm install` e
`npx playwright install chromium` (só para os testes).
