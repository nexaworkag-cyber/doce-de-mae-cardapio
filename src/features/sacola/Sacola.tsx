"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CONTATO } from "@/data/contato";
import { buscarProduto } from "@/lib/cardapio";
import { linkTelefone, linkWhatsApp } from "@/lib/contato";
import { linkPedidoWhatsApp, regrasDoProduto, subtotal, totalDoPedido } from "@/lib/pedido";
import { formatarPreco } from "@/lib/preco";
import { FotoProduto } from "@/components/FotoProduto";
import { Icone } from "@/components/Icone";
import { SeletorQuantidade } from "./SeletorQuantidade";
import { useSacola } from "./SacolaProvider";

/** Barra presa à base da tela enquanto houver itens: quantos itens, total e "Ver sacola". */
export function BarraSacola() {
  const { itens, abrir } = useSacola();
  if (itens.length === 0) return null;
  return (
    <div className="barra-sacola">
      <button type="button" onClick={abrir} className="barra-sacola-botao">
        <span className="relative">
          <Icone nome="sacola" className="size-5" />
          <span className="barra-sacola-contador">{itens.length}</span>
        </span>
        <span className="flex-1 text-left">Ver sacola</span>
        <span className="tabular-nums">{formatarPreco(totalDoPedido(itens))}</span>
      </button>
    </div>
  );
}

/** Folha da sacola (<dialog>): itens com quantidade editável, total estimado e envio pelo WhatsApp. */
export function FolhaSacola() {
  const { itens, aberta, fechar, remover, alterarQuantidade, limpar } = useSacola();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberta && !d.open) d.showModal();
    if (!aberta && d.open) d.close();
  }, [aberta]);

  // Sacola esvaziou com a folha aberta: fecha.
  useEffect(() => {
    if (aberta && itens.length === 0) fechar();
  }, [aberta, itens.length, fechar]);

  const total = totalDoPedido(itens);

  return (
    <dialog
      ref={ref}
      className="sacola"
      aria-labelledby="sacola-titulo"
      onClose={fechar}
      onClick={(e) => e.target === e.currentTarget && fechar()}
    >
      <div className="sacola-cabecalho">
        <h2 id="sacola-titulo" className="titulo-produto">Sua sacola</h2>
        <button type="button" onClick={fechar} className="grid size-11 place-items-center rounded-full bg-realce text-tinta" aria-label="Fechar sacola">
          <Icone nome="fechar" className="size-5" />
        </button>
      </div>

      <ul className="sacola-lista">
        {itens.map((item) => {
          const p = buscarProduto(item.produtoId);
          if (!p) return null;
          const regras = regrasDoProduto(p);
          return (
            <li key={item.chave} className="sacola-item">
              <FotoProduto produto={{ ...p, tom: "baunilha" }} proporcao="1 / 1" compacto sizes="72px" className="w-18 shrink-0 self-start [--raio:var(--radius-nota)]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="titulo-cartao">
                    {p.nome}
                    <span className="block text-legenda font-medium text-tinta-suave">{p.categoria.nome}{p.grupoNome ? ` · ${p.grupoNome}` : ""}</span>
                  </p>
                  <button type="button" onClick={() => remover(item.chave)} className="grid size-11 shrink-0 place-items-center rounded-full text-tinta-suave hover:bg-realce" aria-label={`Remover ${p.nomeCompleto}`}>
                    <Icone nome="lixeira" className="size-[1.1rem]" />
                  </button>
                </div>
                {item.escolhas.length > 0 && <p className="mt-1 text-apoio text-tinta-suave">{item.escolhas.join(", ")}</p>}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <SeletorQuantidade
                    compacto
                    valor={item.quantidade}
                    minimo={regras.minimo}
                    rotulo={`Quantidade de ${p.nomeCompleto}`}
                    sufixo={regras.unidade === "cento" ? (item.quantidade === 1 ? "cento" : "centos") : "un."}
                    onMudar={(n) => alterarQuantidade(item.chave, n)}
                  />
                  <p className="font-semibold tabular-nums">{formatarPreco(subtotal(p, item.quantidade))}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="sacola-rodape">
        <div className="flex items-baseline justify-between">
          <span className="text-apoio font-semibold">Total estimado</span>
          <span className="text-preco font-semibold tabular-nums">{formatarPreco(total)}</span>
        </div>
        <p className="mt-1 text-legenda text-tinta-suave">Valor e entrega são confirmados pela Doce de Mãe no WhatsApp.</p>
        {CONTATO.whatsapp ? (
          <a href={linkPedidoWhatsApp(itens)} target="_blank" rel="noopener noreferrer" className="botao-acao mt-4 w-full">
            <Icone nome="whatsapp" className="size-5" />
            Enviar pedido pelo WhatsApp
          </a>
        ) : (
          <a href={linkTelefone} className="botao-escuro mt-4 w-full">
            <Icone nome="telefone" className="size-5" />
            Ligar para encomendar
          </a>
        )}
        <button type="button" onClick={limpar} className="mt-2 min-h-11 w-full text-apoio font-semibold text-tinta-suave underline-offset-4 hover:underline">
          Esvaziar sacola
        </button>
      </div>
    </dialog>
  );
}

/** Botão do rodapé: com a sacola vazia, conversa direto no WhatsApp; com itens, abre a sacola para enviar o pedido. */
export function BotaoEncomendar({ className, children }: { className: string; children: ReactNode }) {
  const { itens, abrir } = useSacola();
  if (itens.length > 0) {
    return (
      <button type="button" onClick={abrir} className={className}>
        <Icone nome="sacola" className="size-5" />
        Enviar pedido da sacola
      </button>
    );
  }
  return (
    <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
