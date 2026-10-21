# Revisão "confeitaria boutique": diagnóstico e plano (aguardando aprovação)

Data: 19/10/2026.
- Capturas do estado atual: `antes/` (celular 390 px a 3×, desktop 1440 px a 2×).
- Auditorias do Designer: `designer/`.

## Ferramentas: o que estava disponível e o que foi usado

| Pedido | Situação | Uso real |
|---|---|---|
| UI UX Pro Max | Instalado e habilitado | Li `quick-reference.md` (toque, desempenho, layout, tipografia, animação). **O script de busca não roda:** não há Python na máquina |
| Frontend Design | Instalado | Será aplicado na implementação: plano → revisão → construção → crítica com capturas |
| Designer | Instalado | **Executado:** duas auditorias (cartões no celular e topo no desktop), julgadas pelo modelo externo gpt-6.1-sol. Gemini não rodou, porque não há credencial |
| Context7 | Instalado, mas **pede autenticação** (`/mcp`) | Indisponível. Alternativa: a documentação do Next 16.4.2 que vem em `node_modules/next/dist/docs` |
| Code Review | Instalado | O comando oficial revisa **pull requests no GitHub**, o que exige push (não autorizado). Alternativa: o agente local `feature-dev:code-reviewer` sobre a diferença no disco |

## Diagnóstico

### Acessibilidade (corrigir de qualquer forma)

**A1. Abas inativas reprovam no WCAG 1.4.3.**
- Medido: 3,97 a 4,05:1 (creme 80% sobre o vidro).
- Fui eu que baixei de 85% para 80% na rodada anterior.

**A2. Aba ativa marcada fraca.**
- A pílula escura tem só 2,36:1 contra a barra; quem sustenta o estado é o ponto de 4 px.

**A3. O vidro das abas deixa o conteúdo de trás legível.**
- Aparecem "R$ 7,00" e "180 ml Mínimo 20 un." atrás dos rótulos, o que embaralha a leitura.

### Primeira tela

**P1. Nenhum produto aparece sem rolar a página.**
- Celular: o topo tem cerca de 470 px e os cartões começam perto da dobra.
- Desktop: o topo tem 496 px e os cartões começam em y≈779 de 900.
- Para um cardápio, a primeira tela precisa mostrar o que se vende.

**P2. Espaços mortos.**
- 40–48 px entre o topo e as abas.
- Cerca de 60 px das abas até o título.

### Banner

**B1. Desktop pouco nítido.**
- O original tem 1774 px; o desktop a 2× pede cerca de 2750 px.
- O site já entrega o máximo da imagem. Ganhar nitidez real depende de um arquivo maior.

**B2. Celular: a passagem do chocolate para a foto marca uma faixa.**
- Desktop: a tigela de morangos disputa com o lettering.

**B3. Regra 6 do CLAUDE.md.**
- O bolo foi gerado por IA e não está no cardápio; quem visita pode achar que é um produto.
- Decisão sua: manter como decorativo até chegarem as fotos reais, ou recortar só o cenário (morangos, linho, flores).

### Cartões e imagens

**C1. O marcador mostra só a câmera.**
- Parece "adicionar foto" ou imagem quebrada.
- O texto "Foto em breve" existe, mas está escondido nos cartões.

**C2. No celular, nada indica que o cartão abre detalhes.**
- O desktop tem a elevação ao passar o cursor; o celular, nenhuma pista.

**C3. Acabamento pesado demais para "boutique".**
- Contorno + sombra de 3 camadas + moldura dupla da foto + gradiente do marcador + pontilhado.
- Os três marcadores iguais lembram tela carregando.

**C4. O preço grita mais que o nome.**
- Nome com 16–17 px, preço com 20 px.

### Tipografia e detalhes

**T1. Título de categoria duro perto do lettering.**
- O Designer sugere suavizar o peso e trocar o pontilhado longo por fio fino.
- Eu proponho manter o pontilhado, mais leve.

**T2. Folha de detalhe.**
- O marcador ocupa cerca de 45% da folha no celular.
- O divisor é sólido, fora da assinatura.
- "Até 4 sabores 15 g" não usa o mesmo separador dos cartões.

**T3. "Escolha até 4 sabores por cento" sugere seleção.**
- A lista só mostra os sabores. Proposta: reordenar a frase, sem mudar a regra.

**T4. Rodapé.**
- O ícone da nota final fica desalinhado do texto centralizado.

### Desempenho (medido no modo de desenvolvimento)

**D1. Banner já otimizado.**
- AVIF de 74 KB no celular e 98 KB no desktop, com prioridade de carregamento.

**D2. Fonte Archivo.**
- Arquivo variável de 88 KB (eixo de largura), só para os títulos. É o maior recurso depois do JS.

**D3. Monograma baixado duas vezes no desktop.**
- O topo e o rodapé pedem tamanhos diferentes.

**D4. Números reais ainda faltam.**
- LCP e CLS precisam ser medidos na versão de produção (`build` + `start`), não no modo de desenvolvimento.

## Plano

### 1. Acessibilidade e abas

**1a. Contraste das abas inativas.**
- Creme pleno: 5,1:1.
- Ao passar o cursor, a aba escurece em vez de clarear.

**1b. Aba ativa mais clara.**
- Pílula creme com texto chocolate.
- O ponto dourado sai: a pílula basta.

**1c. Vidro mais denso e mais plano.**
- Opacidade de cerca de 0,92 e borda e sombra mais finas, para nada de trás aparecer.

**1d. Pílula que desliza.**
- Ao trocar de categoria, a pílula ativa desliza até a nova aba, em vez de pular.
- Um único elemento, só com transform; desligado em "reduzir movimento".

### 2. Banner e primeira tela

**2a. Celular.**
- Recorte 4:3 em vez de 6:5 (cerca de −45 px) e fusão chocolate → foto mais longa e suave.

**2b. Desktop.**
- Topo mais baixo: cerca de 380 px em vez de 496 (proporção ~8:3), com o bolo mantido à direita.
- Véu um pouco mais forte embaixo à esquerda, atrás do lettering.

**2c. Espaçamento.**
- Topo → abas: 24 px no celular, 32 px no desktop.
- Abas → título: cerca de 36 px.
- Meta: a primeira fileira de cartões começa na primeira tela, nos dois tamanhos.

**2d. Acabamento do painel.**
- Fio interno creme de 1 px, como borda de caixa de confeitaria.

**2e. Uma só animação de entrada.**
- O lettering sobe 8 px e aparece, uma vez, em 600 ms. Não atrasa a imagem (LCP).

**2f. Nitidez do desktop.**
- Se você tiver o arquivo do bolo com 2800 px ou mais, regenero os recortes com o script.

### 3. Cartões

**3a. Acabamento mais leve.**
- Uma sombra curta e suave mais o contorno.
- Some a moldura dupla da foto.
- Marcador com gradiente mais discreto.

**3b. Marcador assumido.**
- "Foto em breve" escrito (13 px) junto da câmera, em tom sobre tom.
- Ao fundo, um padrão quase invisível de pontos (a assinatura), como papel de embrulho da confeitaria.
- A logo não entra.

**3c. Hierarquia.**
- Nome com 17–18 px; preço com 18–19 px, peso 600.
- O nome vira a linha principal. O preço continua acima de 18 px.
- Preciso ajustar o teste que hoje exige 20 px, ou manter 20 px no preço e só subir o nome. Recomendo a segunda opção: o teste fica como está.

**3d. Pista de toque no celular.**
- Uma seta pequena ("›") ao lado do preço, em `destaque`.
- O cartão inteiro continua sendo a área de toque.

**3e. Toque.**
- Ao tocar, a sombra assenta e a foto encolhe 2%, em cerca de 120 ms.

### 4. Tipografia e detalhes

**4a. Título da categoria.**
- Fica em Archivo 800, mas 2 px menor no desktop.
- Pontilhado mais claro e mais espaçado, para ficar mais fino.
- Alternativa, se você preferir: fio sólido fino.

**4b. Folha de detalhe.**
- No celular, o marcador fica mais baixo sem foto (16:10).
- Divisor pontilhado; informações separadas por " · ".

**4c. Sabores.**
- Lista primeiro, regra depois: "Sabores disponíveis" e, abaixo, "Na encomenda, até 4 sabores por cento".
- Abertura e fechamento suaves das linhas (aprimoramento progressivo).

**4d. Rodapé.**
- Ícone da nota final alinhado ao texto.

### 5. Desempenho e verificação

**5a. Fonte Archivo.**
- Medir a diferença entre o arquivo variável (88 KB) e o peso 800 fixo.
- Se valer a pena, troco a largura 105% pela normal e economizo cerca de 60 KB. Decisão com números.

**5b. Monograma.**
- Um único tamanho para o topo e o rodapé, para baixar o arquivo uma vez só.

**5c. Medição em produção.**
- LCP e CLS a 390 e 1440 px, antes e depois.
- Capturas sem o selo "N" do modo de desenvolvimento.

**5d. Comparação.**
- Designer em modo de comparação (antes × depois) e revisão de código local.
- Lint, typecheck e os 72 testes, mais uma checagem a 320 px.

### Fora do escopo

- Conteúdo comercial: nada muda (texto, preço, sabor, peso, mínimo).
- Estrutura das seções, ordem e grade.
- Cores principais e logo.
- Nenhuma dependência nova.

## Versão de teste

Toda a revisão anterior ainda não foi commitada, então uma branch sem commit não isola nada. Opções:

**(a) Recomendado.** Commit local de segurança numa branch `teste/boutique`, **sem push**, e implementação em cima dele.

**(b)** Sem commit: antes de começar, salvo uma cópia dos arquivos que vou tocar em `docs/revisao-premium/backup/`, para poder desfazer.
