# Decisões

Registro das decisões importantes, com o porquê. Data: 15/10/2026 (v0.1).

## Projeto

| # | Decisão | Por quê |
|---|---|---|
| D1 | **Projeto independente** em `C:\Projetos\doce-de-mae-cardapio`, Git próprio, sem remoto | Pedido explícito: nada é compartilhado com o e-commerce |
| D2 | **Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind CSS 4 + ESLint + Playwright** | Stack pedida; página 100% estática (prerender), deploy simples na Vercel no futuro |
| D3 | Nenhuma biblioteca de animação, ícones ou UI | Pedido explícito; movimento com CSS/WAAPI/IntersectionObserver/View Transitions; ícones inline |
| D4 | Dependências: só as do `create-next-app` + `@playwright/test` | Mínimo necessário |
| D5 | Arquitetura: `data/` (fonte), `lib/` (regras e formatação), `components/` (peças visuais), `features/` (seções e interações), `styles/` (tokens, prancha, detalhe, movimento) | Separar dado comercial de apresentação; nenhum preço ou produto escrito em componente |
| D6 | Dados como módulo TypeScript tipado (`src/data/cardapio.ts`), com **categoria → grupo → produto** | Reflete o original (mínimos e porções que valem para um grupo); fácil de editar; checado pelo compilador e pelos testes |

## Conteúdo

| # | Decisão | Por quê |
|---|---|---|
| D7 | Nada inventado; lacunas ficam em `src/data/pendencias.ts` e `docs/CARDAPIO-FONTE.md` | Regra do projeto |
| D8 | O cartão mostra só dados do próprio produto; dados de grupo aparecem uma vez no grupo | Fidelidade ao original; a folha de detalhe mostra os dois resolvidos |
| D9 | "A partir de" no sumário é **calculado** do menor preço da categoria | Informação útil sem texto comercial inventado |
| D10 | Grafia original dos sabores mantida (Cappucino, Ferrero Roche…) | Correção é decisão da família (pendência P11) |
| D11 | Telefone tratado como WhatsApp (botão "Encomendar pelo WhatsApp"), com chave para desligar | O ícone está ilegível no arquivo; a marca já usa WhatsApp para encomendas. Pendência P10 |
| D12 | Textos próprios mínimos e verificáveis: "Docinhos gourmet e mais delícias, feitos por mãe." (nomes dos blocos do cardápio + direção de marca pedida), "Vendidos pelo cento. Escolha a linha e os sabores." | Evitar frases comerciais genéricas ou promessas |

## Marca

| # | Decisão | Por quê |
|---|---|---|
| D13 | **Monograma oficial** copiado dos PNGs 4K da marca (`docs/design/Logo-4K-2026-10-04/transparentes/` do projeto da loja), só com recorte da margem transparente e redimensionamento | Identidade obrigatória; a arte não foi alterada. Ícones do site: monograma dourado sobre chocolate |
| D14 | Cores e fontes da identidade oficial (Archivo + Figtree; creme/chocolate/rosa argila/figo/dourado) | Coerência com a marca; tokens recriados do zero neste projeto (nenhum código reutilizado) |
| D15 | A **tarja rosa** do cardápio antigo aparece **uma única vez** ("Mais delícias") | Herança reconhecível da marca sem virar tique visual |
| D16 | Tema claro único (sem modo escuro automático) | O cardápio é uma peça de marca; as faixas chocolate já dão o contraste. `color-scheme: light` |

## Experiência

| # | Decisão | Por quê |
|---|---|---|
| D17 | **Detalhe em bottom sheet** (`<dialog>` nativo) no celular; painel 2 colunas no desktop | Mantém o contexto do cardápio; acessibilidade nativa (foco preso, Esc, fundo inerte); comparado com página de detalhe (perde o lugar na rolagem) e expansão inline (empurra o layout, gera CLS) |
| D18 | Cada abertura de detalhe cria `#id` no histórico | Botão/gesto "voltar" fecha a folha (padrão mobile); link compartilhável |
| D19 | Foto "voa" do cartão para a folha com **View Transitions** nativas, fallback em WAAPI | Continuidade espacial sem biblioteca; navegadores sem suporte recebem a animação simples |
| D20 | Navegação de categorias **flutuante na base** | Alcance do polegar; 4 itens cabem em 375 px com rótulos curtos |
| D21 | Placeholders = "set de fotografia vazio" + selo "Foto em breve" + aviso no rodapé | Honesto (nunca parece o doce) e ainda editorial; mesma proporção da foto futura |
| D22 | Estados iniciais de animação só com `html[data-motion="ok"]`, definido antes da pintura | Sem JS ou com "reduzir movimento", o conteúdo aparece direto; sem flash |
| D23 | Fotos observadas pelo elemento pai no IntersectionObserver | Um alvo recortado por `clip-path` (área visível zero) nunca "entra" na tela para o observador — bug encontrado nos testes |
| D24 | Proporções diferentes para desktop (`proporcaoDesktop`) | Fotos 4:5 ficavam mais altas que a tela em 1280 px |

## v0.2 — Cardápio de cartões (17/10/2026)

| # | Decisão | Por quê |
|---|---|---|
| D25 | Layout trocado para **cartões em grade + abas de categoria**; saem abertura de tela inteira, sumário, faixas, interlúdio e revelações ao rolar | Pedido da família: "parece um site"; referência de cardápio de cartões. A v0.1 fica no Git (`13a2033`) |
| D26 | Marcador de foto neutro (baunilha) e igual em todos os cartões | Calma visual; quando as fotos chegarem, a cor vem do doce |
| D27 | Sabores dos docinhos num quadro próprio, abaixo dos três centos | Como no cardápio antigo (três colunas); os cartões ficam curtos |
| D29 | **Cores da marca distribuídas por categoria** (faixa de título, aba ativa, tom suave do marcador); fundo creme; rodapé figo | Pedido da família: usar as cores da marca bem distribuídas. Texto creme só sobre rosa-profundo/chocolate/figo; espresso sobre dourado/rosa-argila |
| D28 | Repositório privado no GitHub (`nexaworkag-cyber/doce-de-mae-cardapio`) | Pedido da família para trabalhar de qualquer computador |

## Referências usadas (HorizonX — só consulta)

Pesquisado: image reveal, text reveal, galerias, tabs, landing pages de comida/café/vinho. **Nada baixado, nada exportado.**

| Item | Tipo | O que inspirou |
|---|---|---|
| `bruma-roasters` (gratuito) | Landing editorial de café | Tipografia editorial expressiva + notas de sabor como conteúdo (lista de sabores em destaque em cada cento) |
| `vallora-estate` (Premium, não baixado) | Landing editorial de vinícola | Revelações de linha escalonadas, respeito a reduced-motion |
| `type-reveal` | Componente (scroll) | Máscaras de texto e imagem |
| `gallery-reveal` | Componente (scroll) | Revelação progressiva de imagens |
| `beacon-tabs` | Componente (UI) | Indicador de aba ativa deslizante |

## Skills

| Skill | Uso |
|---|---|
| `find-skills` | Inventário. A skill só busca/instala do registro remoto; nada foi instalado. Inventário feito pela lista do ambiente |
| `frontend-design` | Processo de direção (plano → revisão contra o briefing → construção → crítica) e anti-padrões evitados |
| `ui-ux-pro-max` | Regras de toque (44 px), folha (arrastar para fechar, escape), movimento (saída mais rápida que entrada, stagger 30–50 ms), deep link e "voltar". Scripts de busca indisponíveis (Python ausente) |
| `designer:review` | Revisão visual das capturas (ver seção abaixo) |
| Playwright | Testes E2E em 375/430/768/1280 e capturas de revisão |

## Revisão de design (designer:review)

Duas auditorias sobre as capturas de 15/10/2026 (`npm run capturas`): uma em 375 px, outra em 1280 px.
O juiz externo (Gemini via claudish) não rodou — a ferramenta só aceita arquivos dentro da pasta do outro
projeto —, então as duas revisões foram feitas pelo próprio agente de revisão, com contraste medido nos pixels.

| | 375 px | 1280 px |
|---|---|---|
| Veredito | **PASS** — 7,5/10 | **PASS** — 7/10 |
| Parece cardápio premium? | Na maior parte, sim | Na maior parte, sim |
| Parece marca real? | Sim | Sim (abertura é a tela mais forte) |
| Fotografia protagonista? | Sim, no layout | Molduras sim; enfeites do marcador competiam |
| Cara de template? | Pouca | Leve |
| Cara de IA? | Baixa a moderada (marcadores repetidos) | Baixa a moderada (palavras cortadas, cantoneiras) |
| Animação demais? | Não | Não |
| Preços claros? | Valores sim; mínimos inconsistentes | Sim |
| Uma mão / navegação | Fácil; a barra sumia no escuro | Fácil de varrer; caminho de encomenda pouco visível |
| Identidade coerente? | Sim | Sim, com 3 desvios |
| Algo genérico? | Folha, chips, rodapé, barra | Barra, sumário, rodapé, cantoneiras |
| WCAG AA (texto) | Passa (menor: creme/figo 4,72:1) | Passa |

### Segunda rodada (aplicada)

| Achado | Correção |
|---|---|
| Barra de categorias some sobre faixas escuras (1,02:1) | Contorno dourado de 1 px; sem item ativo no rodapé |
| Palavra-fantasma cortada no marcador, cantoneiras e botão de expandir empilhados | Marcador simplificado: cor + luz + textura + selo "Foto em breve" |
| Sabores em Archivo caixa alta pesavam mais que nome e preço (e fugiam da regra da marca) | Lista em Figtree, 2 colunas, ponto rosa |
| Mínimo de pedido em 4 lugares e estilos; "Mínimo 30 un." solto | `NotaGrupo`: medida comum + porção + mínimo sempre logo abaixo do título do grupo |
| Pista de "abre detalhes" ambígua (ícone de expandir) | "Ver detalhes ›" em todo cartão; seta nas linhas da mini palha |
| Quadrado da medida parecia caixa de seleção | Quadrado preenchido |
| Informação com cara de botão (pílulas contornadas, chips) | Texto simples |
| Folha de detalhe genérica; nome diferente do cartão | Título editorial com o mesmo nome do cartão + trilha "Palha italiana › Mini palha" |
| Monograma suave em telas retina | Reexportado com 1600 px de altura (arte inalterada) |
| Botão da abertura fraco; rótulo "Cardápio" parecia link | Botão preenchido dourado; rótulo junto do nome |
| Sumário desalinhado e com padrões de preço diferentes | "a partir de R$ X" em todos (+ "o cento" nos docinhos), seta, alinhamento |
| "Mais delícias" colado em "Brownies" | Interlúdio menor, com divisor |
| Palha e Copo com a mesma composição no desktop | Copo vira par alinhado; a palha segue em zigue-zague |
| Aviso do rodapé em 13 px | 15 px |

### Não aplicado (depende da família)

- Unidade dos preços avulsos ("cada" / "por unidade") — pendência P7; não inventamos.
- Botão de encomenda fixo ou ao fim de cada capítulo — decisão comercial e de experiência.
- Grafia de sabores (Ferrero Roche, Geléia, Banoffe, Cappucino) — pendência P11.
- Descrição para o copo Banoffe — não existe no cardápio.
