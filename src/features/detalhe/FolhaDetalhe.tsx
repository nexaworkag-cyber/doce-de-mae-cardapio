"use client";

import { useRef, useState, type MouseEvent, type PointerEvent, type ReactNode, type RefObject } from "react";
import type { ProdutoResolvido } from "@/lib/cardapio";
import { textoMinimo } from "@/lib/cardapio";
import { pendenciaDoItem, regrasDoProduto, subtotal } from "@/lib/pedido";
import { formatarPreco } from "@/lib/preco";
import { FotoProduto } from "@/components/FotoProduto";
import { Icone } from "@/components/Icone";
import { Medida } from "@/components/Medida";
import { Preco } from "@/components/Preco";
import { EscolhaItens } from "@/features/sacola/EscolhaItens";
import { SeletorQuantidade } from "@/features/sacola/SeletorQuantidade";
import { useSacola } from "@/features/sacola/SacolaProvider";

type Props = {
  ref: RefObject<HTMLDialogElement | null>;
  produto: ProdutoResolvido | undefined;
  onFechar: (porGesto?: boolean) => void;
  onFechado: () => void;
};

/**
 * Folha de detalhe: bottom sheet no celular (arrastar para baixo fecha), painel em 2 colunas no desktop.
 * Mostra somente dados do cardápio.
 */
export function FolhaDetalhe({ ref, produto, onFechar, onFechado }: Props) {
  const arrasto = useRef<{ y0: number; t0: number; dy: number; id: number } | null>(null);

  const aoPressionar = (e: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    arrasto.current = { y0: e.clientY, t0: performance.now(), dy: 0, id: e.pointerId };
  };

  const aoMover = (e: PointerEvent<HTMLDivElement>) => {
    const a = arrasto.current;
    const dialog = ref.current;
    if (!a || !dialog || a.id !== e.pointerId) return;
    a.dy = Math.max(0, e.clientY - a.y0);
    dialog.style.transform = `translateY(${a.dy}px)`;
  };

  const aoSoltar = () => {
    const a = arrasto.current;
    const dialog = ref.current;
    arrasto.current = null;
    if (!a || !dialog || a.dy === 0) return;
    const velocidade = a.dy / Math.max(1, performance.now() - a.t0);
    dialog.style.transform = "";
    if (a.dy > 110 || (a.dy > 30 && velocidade > 0.6)) {
      const saida = dialog.animate(
        [{ transform: `translateY(${a.dy}px)` }, { transform: "translateY(100%)" }],
        { duration: 220, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" },
      );
      saida.finished.then(() => onFechar(true));
    } else {
      dialog.animate([{ transform: `translateY(${a.dy}px)` }, { transform: "none" }], {
        duration: 260,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      });
    }
  };

  const aoClicar = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    const fora = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (fora) onFechar();
  };

  return (
    <dialog
      ref={ref}
      className="detalhe"
      aria-labelledby="detalhe-contexto detalhe-titulo"
      onCancel={(e) => {
        e.preventDefault();
        onFechar();
      }}
      onClose={(e) => {
        e.currentTarget.getAnimations().forEach((animacao) => animacao.cancel());
        onFechado();
      }}
      onClick={aoClicar}
    >
      {produto && (
        <>
          <div className="detalhe-topo">
            <button
              type="button"
              onClick={() => onFechar()}
              className="grid size-11 place-items-center rounded-full bg-fundo/95 text-tinta shadow-flutuante transition-transform duration-200 active:scale-95"
              aria-label="Fechar detalhes"
            >
              <Icone nome="fechar" className="size-5" />
            </button>
          </div>

          <div className="detalhe-midia">
            <FotoProduto produto={{ ...produto, tom: "baunilha" }} proporcao="5 / 4" seloCentral sizes="(min-width: 768px) 512px, 100vw" />
            <div
              className="detalhe-alca"
              onPointerDown={aoPressionar}
              onPointerMove={aoMover}
              onPointerUp={aoSoltar}
              onPointerCancel={aoSoltar}
              aria-hidden="true"
            >
              <span />
            </div>
          </div>

          <ConteudoProduto key={produto.id} produto={produto} onAdicionado={() => onFechar()} />
        </>
      )}
    </dialog>
  );
}

/**
 * Informações do produto + montagem do pedido (escolhas e quantidade) + botão "Adicionar à sacola".
 * Com key = id do produto, as escolhas recomeçam a cada produto aberto.
 */
function ConteudoProduto({ produto, onAdicionado }: { produto: ProdutoResolvido; onAdicionado: () => void }) {
  const { adicionar, abrir } = useSacola();
  const regras = regrasDoProduto(produto);
  const [quantidade, setQuantidade] = useState(regras.minimo);
  const [escolhas, setEscolhas] = useState<string[]>([]);
  const pendencia = pendenciaDoItem(regras, quantidade, escolhas);
  const especificacoes = listarEspecificacoes(produto);

  const adicionarNaSacola = () => {
    if (pendencia) return;
    adicionar({ produtoId: produto.id, quantidade, escolhas });
    onAdicionado();
    // Depois que a folha fecha, a sacola abre mostrando o pedido.
    window.setTimeout(abrir, 320);
  };

  return (
    <>
      <div className="detalhe-info">
        <p id="detalhe-contexto" className="flex flex-wrap items-center gap-1.5 text-apoio font-medium text-tinta-suave">
          {produto.categoria.nome}
          {produto.grupoNome && (
            <>
              <Icone nome="seta-direita" className="size-3.5" />
              {produto.grupoNome}
            </>
          )}
        </p>
        <h2 id="detalhe-titulo" className="titulo-produto mt-1.5">
          {produto.nome}
        </h2>
        <Preco centavos={produto.precoCentavos} unidade={produto.unidadePreco} className="mt-5 text-preco-lg" />

        {especificacoes.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-apoio font-medium text-tinta-suave" aria-label="Informações do cardápio">
            {especificacoes.map((item) => (
              <li key={item.chave}>{item.conteudo}</li>
            ))}
          </ul>
        )}

        {produto.descricao && <p className="mt-6 max-w-[40ch] text-corpo-lg">{produto.descricao}</p>}

        <div className="mt-7 border-t border-divisor pt-5">
          {regras.escolha && (
            <EscolhaItens
              titulo={regras.escolha.titulo}
              itens={regras.escolha.itens}
              maximo={regras.escolha.maximo}
              escolhidos={escolhas}
              onMudar={setEscolhas}
            />
          )}
          <div className={regras.escolha ? "mt-6" : undefined}>
            <SeletorQuantidade
              valor={quantidade}
              minimo={regras.minimo}
              rotulo={regras.unidade === "cento" ? "Quantos centos" : "Quantidade"}
              sufixo={regras.unidade === "cento" ? (quantidade === 1 ? "cento" : "centos") : "un."}
              onMudar={setQuantidade}
            />
          </div>
        </div>
      </div>

      <div className="detalhe-acao">
        <button
          type="button"
          className="botao-escuro w-full"
          aria-disabled={pendencia ? true : undefined}
          onClick={adicionarNaSacola}
        >
          <Icone nome="sacola" className="size-5" />
          {pendencia ?? `Adicionar à sacola · ${formatarPreco(subtotal(produto, quantidade))}`}
        </button>
      </div>
    </>
  );
}

function listarEspecificacoes(p: ProdutoResolvido) {
  const itens: { chave: string; conteudo: ReactNode }[] = [];
  if (p.medida) itens.push({ chave: "medida", conteudo: <Medida medida={p.medida} /> });
  if (p.porcaoEfetiva) itens.push({ chave: "porcao", conteudo: p.porcaoEfetiva });
  if (p.saboresPorPedido) itens.push({ chave: "sabores", conteudo: `Até ${p.saboresPorPedido} sabores por cento` });
  if (p.peso) itens.push({ chave: "peso", conteudo: `${p.peso} cada unidade` });
  if (p.pedidoMinimoEfetivo) itens.push({ chave: "minimo", conteudo: textoMinimo(p.pedidoMinimoEfetivo) });
  return itens;
}
