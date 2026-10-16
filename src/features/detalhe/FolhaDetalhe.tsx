"use client";

import { useRef, type MouseEvent, type PointerEvent, type ReactNode, type RefObject } from "react";
import { CONTATO } from "@/data/contato";
import type { ProdutoResolvido } from "@/lib/cardapio";
import { textoMinimo } from "@/lib/cardapio";
import { linkTelefone, linkWhatsApp } from "@/lib/contato";
import { FotoProduto } from "@/components/FotoProduto";
import { Icone } from "@/components/Icone";
import { Medida } from "@/components/Medida";
import { Preco } from "@/components/Preco";
import { ListaSabores } from "@/features/cardapio/ListaSabores";

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

  const especificacoes = produto ? listarEspecificacoes(produto) : [];

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
              className="grid size-11 place-items-center rounded-full bg-leite/95 text-espresso shadow-flutuante transition-transform duration-200 active:scale-95"
              aria-label="Fechar detalhes"
            >
              <Icone nome="fechar" className="size-5" />
            </button>
          </div>

          <div className="detalhe-midia">
            <FotoProduto produto={produto} proporcao="5 / 4" sizes="(min-width: 768px) 512px, 100vw" />
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

          <div className="detalhe-info [--texto-apoio:var(--color-cacau)]">
            <p id="detalhe-contexto" className="flex flex-wrap items-center gap-1.5 text-apoio font-medium text-cacau">
              {produto.categoria.nome}
              {produto.grupoNome && (
                <>
                  <Icone nome="seta-direita" className="size-3.5" />
                  {produto.grupoNome}
                </>
              )}
            </p>
            <h2 id="detalhe-titulo" className="display mt-2 text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[0.95]">
              {produto.nome}
            </h2>
            <Preco centavos={produto.precoCentavos} unidade={produto.unidadePreco} className="mt-5 text-[1.875rem]" />

            {especificacoes.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-apoio font-medium text-cacau" aria-label="Informações do cardápio">
                {especificacoes.map((item) => (
                  <li key={item.chave}>{item.conteudo}</li>
                ))}
              </ul>
            )}

            {produto.descricao && <p className="mt-6 max-w-[40ch] text-corpo-lg">{produto.descricao}</p>}

            {produto.opcoes && <p className="mt-6 text-corpo-lg">{produto.opcoes.join(", ")}</p>}

            {produto.sabores && (
              <ListaSabores sabores={produto.sabores} corPonto="bg-rosa-argila" revelar={false} className="mt-8 border-t border-linha pt-5" />
            )}

            {produto.recheios && (
              <p className="mt-6 max-w-[40ch] text-corpo-lg">
                <span className="font-semibold">Recheios: </span>
                <span className="text-cacau">{produto.recheios.join(", ")}</span>
              </p>
            )}
          </div>

          <div className="detalhe-acao">
            {CONTATO.whatsapp ? (
              <a
                href={linkWhatsApp(produto)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-espresso px-6 text-corpo font-semibold text-creme shadow-flutuante transition-transform duration-200 active:scale-[0.98]"
              >
                <Icone nome="whatsapp" className="size-5" />
                Encomendar pelo WhatsApp
              </a>
            ) : (
              <a
                href={linkTelefone}
                className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-espresso px-6 text-corpo font-semibold text-creme"
              >
                <Icone nome="telefone" className="size-5" />
                Ligar para encomendar
              </a>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}

function listarEspecificacoes(p: ProdutoResolvido) {
  const itens: { chave: string; conteudo: ReactNode }[] = [];
  if (p.medida) itens.push({ chave: "medida", conteudo: <Medida medida={p.medida} /> });
  if (p.porcaoEfetiva) itens.push({ chave: "porcao", conteudo: p.porcaoEfetiva });
  if (p.saboresPorPedido) itens.push({ chave: "sabores", conteudo: `Até ${p.saboresPorPedido} sabores` });
  if (p.peso) itens.push({ chave: "peso", conteudo: p.peso });
  if (p.pedidoMinimoEfetivo) itens.push({ chave: "minimo", conteudo: textoMinimo(p.pedidoMinimoEfetivo) });
  return itens;
}
