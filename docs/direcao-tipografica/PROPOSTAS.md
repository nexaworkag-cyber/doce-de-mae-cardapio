# Topo "Cardápio": direção de arte e tipografia (18/10/2026) · aguardando escolha

Laboratório: [`propostas.html`](propostas.html) (abrir no navegador). Capturas em `capturas/` (375 px e 1280 px).
Nada foi aplicado ao site ainda.

## 1. Ferramentas usadas

| Ferramenta | Situação | Uso |
|---|---|---|
| `frontend-design` (skill) | disponível, carregada | Processo plano → revisão → construção → crítica; evitar escolhas-padrão |
| `ui-ux-pro-max` (skill) | disponível; scripts de busca precisam de Python, ausente neste PC | Regras de legibilidade e toque, sem a busca automática |
| `designer:ui` / `designer:review` (agentes) | disponíveis | Não usados: as três propostas foram feitas numa única direção, para manter coerência |
| Playwright | instalado no projeto | Verificação real das fontes (`verificar-fontes.mjs`) e capturas (`capturar.mjs`) |
| Figma (MCP) | disponível | Precisa do link do arquivo para ler as medidas |

## 2. Referência: Kina Design Studio (só observação)

O que se repete nos logotipos deles (Fith, Green Matcha, Sion, Hydrä, Last Mile):
- **uma intervenção personalizada por marca**: letra trocada por um símbolo, ligadura própria, diacrítico redesenhado (o trema do Hydrä);
- letras bem justas, com o selo ou monograma pequeno separado da palavra;
- muito espaço vazio e paleta curta.

**Aplicação aqui:** "Cardápio" e "Mãe" têm acentos, e o acento pode ser o detalhe próprio da marca (proposta B). Nada foi copiado.

## 3. Pesquisa de fontes (verificada, não presumida)

Licença conferida no repositório oficial `google/fonts` (pasta `ofl/` = SIL Open Font License: uso comercial e web livres).
Acentos testados (áãâàçéêíóõôú e maiúsculas) e recursos testados renderizando com o recurso desligado e ligado e comparando os pixels
(`fontes.json` = arquivos do Google Fonts; `fontes-completas.json` = arquivos originais).

| Fonte | Licença | Acentos PT | Recursos no **Google Fonts** | Recursos no **arquivo completo** | Eixos variáveis |
|---|---|---|---|---|---|
| Fraunces | OFL | ok | liga | liga, ss01, case | SOFT, WONK, opsz, wght |
| Caprasimo | OFL | ok | — | — | — |
| Gloock | OFL | ok | liga, frac | liga, frac | — |
| Instrument Serif | OFL | ok | liga | liga, ss01 | — |
| Bodoni Moda | OFL | ok | liga, frac | liga, ss01–ss03, onum, smcp, c2sc, frac | opsz, wght |
| Playfair Display | OFL | ok | liga, frac | liga, dlig, smcp, c2sc, case, frac | wght |
| DM Serif Display | OFL | ok | liga, frac | liga, frac | — |
| Young Serif | OFL | ok | liga, frac | liga, case, frac | — |
| Ballet | OFL | ok | liga, frac | liga, salt, ss01, ss02, frac | opsz |
| Cormorant | OFL | ok | liga, calt, frac | liga, dlig, calt, ss01–ss03 (+ss07/ss08 no itálico), smcp, c2sc, case, frac | wght |
| Shrikhand | OFL | ok | liga | liga, ordn | — |
| **Recoleta** | **comercial** (Latinotype) | — | não está no Google Fonts | licença paga; o arquivo gratuito do DaFont é só demonstração | — |

**Descoberta importante:** o Google Fonts (e portanto o `next/font/google`) **remove** os recursos extras (ss01, dlig, smcp…). Os **eixos variáveis continuam**. Usar alternativas estilísticas ou versaletes exige hospedar no projeto o arquivo completo (permitido pela OFL), de preferência recortado para o latim.

## 4. As três propostas

### A · Editorial Luxury (recomendada)
- **Fontes:** só a Fraunces, com o contraste vindo do tamanho óptico. "Cardápio" em itálico leve (opsz 144, wght 330, SOFT 50, WONK 1); "Doce de Mãe" em romano para texto (opsz 14, wght 450).
- **Composição:** alinhada à esquerda, sem centralizar tudo. Embaixo, uma linha só: "Doce de Mãe", um fio fino e o monograma como selo na ponta. Moldura fina dentro do cartão de vidro claro, como um cardápio impresso.
- **Implementação:** dá para usar o `next/font/google` (Fraunces com os eixos `SOFT`, `WONK` e `opsz`), sem arquivos extras.
- **Riscos:** quase nenhum. Combina com Archivo e Figtree, que continuam nos títulos e textos.

### B · Expressive Retro
- **Fontes:** Caprasimo, uma serifa gorda e arredondada de inspiração retrô.
- **Detalhe próprio:** o acento do "á" redesenhado como uma **gota de calda** em SVG próprio. A fonte não tem recursos OpenType, então o detalhe é desenhado.
- **Composição:** rótulo de embalagem com listras rosa, título com sombra creme deslocada (impressão retrô) e um selo redondo com "DOCE DE MÃE" em arco, "estourando" a borda.
- **Riscos:** é a mais chamativa e disputa atenção com as fotos. Com a faixa rosa-profundo de "Docinhos gourmet" logo abaixo, os rosas ficam próximos demais; se for a escolhida, a faixa precisa mudar.

### C · Assinatura (interpretação própria: o briefing chegou cortado depois da B)
- **Fontes:** Ballet, um script caligráfico (opsz 72, ss01), e "Doce de Mãe" em versaletes verdadeiros da Cormorant (smcp), alinhado à direita do script como uma assinatura.
- **Composição:** vidro marrom do Figma com o monograma dourado (a combinação principal da marca).
- **Implementação:** exige hospedar os arquivos completos, porque o ss01 e o smcp não vêm do Google Fonts.
- **Riscos:** script tem leitura mais lenta; o bloco escuro volta a pesar, o que já foi apontado antes.

## 5. Próximo passo

Escolha A, B ou C, ou uma mistura (por exemplo, a composição da A com a gota da B no acento).
Depois da escolha: aplicar no `Cabecalho`, carregar a fonte (via `next/font` ou arquivo próprio), rodar os testes e gerar o antes e depois.
