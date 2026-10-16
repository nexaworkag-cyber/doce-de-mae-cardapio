import type { CSSProperties } from "react";
import Image from "next/image";
import type { Produto } from "@/data/cardapio";
import { Icone } from "@/components/Icone";

type Props = {
  produto: Pick<Produto, "id" | "nomeCompleto" | "foto" | "tom">;
  /** Proporção CSS, ex.: "4 / 5". Fixa o espaço antes da imagem carregar (sem CLS). */
  proporcao?: string;
  /** Proporção a partir de 768 px (opcional). */
  proporcaoDesktop?: string;
  /** Revela com máscara ao entrar na tela. */
  revelar?: boolean;
  sizes?: string;
  className?: string;
  /** Miniatura: o marcador mostra só o ícone de câmera. */
  compacto?: boolean;
};

/**
 * Área de foto do produto. Com foto real → next/image (AVIF/WebP, lazy).
 * Sem foto → marcador "Foto em breve": um set de fotografia vazio na cor da marca,
 * claramente identificado (não simula o doce).
 */
export function FotoProduto({
  produto,
  proporcao = "4 / 5",
  proporcaoDesktop,
  revelar = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
  className = "",
  compacto = false,
}: Props) {
  const { foto } = produto;

  return (
    <div
      className={`prancha ${compacto ? "prancha-compacta" : ""} ${className}`}
      data-tom={produto.tom}
      data-foto-produto={produto.id}
      data-revelar={revelar ? "foto" : undefined}
      style={{ "--proporcao": proporcao, "--proporcao-md": proporcaoDesktop } as CSSProperties}
      {...(foto
        ? {}
        : { role: "img", "aria-label": `${produto.nomeCompleto}: foto em breve (marcador provisório)` })}
    >
      {foto ? (
        <div className="prancha-conteudo">
          <Image src={foto.src} alt={foto.alt} fill sizes={sizes} />
        </div>
      ) : (
        <div className="prancha-conteudo prancha-set" aria-hidden="true">
          <span className="prancha-selo">
            <Icone nome="camera" className="size-[1.15em]" />
            <span className="prancha-selo-texto">Foto em breve</span>
          </span>
        </div>
      )}
    </div>
  );
}
