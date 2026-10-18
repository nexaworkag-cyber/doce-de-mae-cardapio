# Doce de Mãe — Cardápio interativo

Cardápio digital da Doce de Mãe, pensado primeiro para o celular: topo com o monograma, abas de categoria,
produtos em cartões e detalhe em folha deslizante com o botão de encomenda.

**Não é uma loja**: sem carrinho, pagamento, login, cadastro, painel ou frete. A encomenda continua pelo contato
do cardápio. Projeto independente do e-commerce da marca (pasta, Git e dependências próprios).

## Em outro computador

```bash
git clone https://github.com/nexaworkag-cyber/doce-de-mae-cardapio.git
```

Depois `npm install` e `npm run dev`. Antes de começar, `git pull`; ao terminar, `git push`.

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run build        # build de produção (página estática)
npm run test:e2e     # Playwright em 375, 430, 768 e 1280 px (faz build e sobe o servidor na porta 3100)
npm run capturas     # imagens de revisão em docs/capturas/ (fora do Git)
```

Na primeira vez, instale o navegador dos testes: `npx playwright install chromium`.

## Onde mexer

| Quero… | Arquivo |
|---|---|
| Mudar preço, sabor, produto | `src/data/cardapio.ts` (fonte: `docs/CARDAPIO-FONTE.md`) |
| Mudar telefone, Instagram, ligar/desligar WhatsApp | `src/data/contato.ts` |
| Ver o que ainda falta confirmar | `src/data/pendencias.ts` / `docs/CARDAPIO-FONTE.md` §4 |
| Colocar a foto real de um produto | Arquivo em `public/fotos/` + `foto: { src, alt, largura, altura }` no produto |
| Cores, fontes, tamanhos, movimento | `src/styles/tokens.css`, `src/styles/motion.css` (ver `docs/DESIGN-SYSTEM.md`) |

## Estrutura

```
src/
  app/            layout (fontes, metadados), página, ícones
  data/           cardápio, contato e pendências — a fonte de verdade
  lib/            regras (resolver mínimos de grupo, menor preço), preço em BRL, links de contato
  components/     peças visuais: Monograma, FotoProduto, Preco, Medida, Icone
  features/       cabeçalho, abas de categoria, seções e cartões do cardápio, detalhe, rodapé
  styles/         tokens (Tailwind v4), prancha de foto, folha de detalhe, movimento
public/brand/     monograma oficial (dourado, chocolate, creme)
tests/e2e/        testes Playwright
tests/capturas/   roteiro das capturas de revisão
docs/             CARDAPIO-FONTE, DIRECAO-VISUAL, DESIGN-SYSTEM, DECISOES, referencias/
```

## Regras

- **Nada inventado** — preços, sabores, pesos, mínimos, prazos: só o que está no cardápio antigo.
- Sem deploy sem autorização. Repositório privado no GitHub; contexto para continuar em `docs/CONTEXTO.md`.
- Detalhes e porquês: `docs/DECISOES.md`.
