import { CONTATO } from "@/data/contato";
import { PRODUTOS } from "@/lib/cardapio";
import { linkInstagram, linkTelefone, linkWhatsApp } from "@/lib/contato";
import { Icone } from "@/components/Icone";
import { Monograma } from "@/components/Monograma";

/** Fechamento: o chamado do cardápio antigo ("Faça sua encomenda!") e os contatos dele. */
export function Rodape() {
  // O aviso sobre os marcadores só aparece enquanto algum produto ainda estiver sem foto.
  const faltamFotos = PRODUTOS.some((p) => p.foto === null);
  return (
    <footer className="moldura pt-14 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:pt-20">
      <div className="painel escuro flex flex-col items-center px-6 py-10 text-center md:py-14">
        <Monograma cor="dourado" sizes="64px" className="h-auto w-11" />
        <h2 className="titulo-secao mt-4">{CONTATO.chamada}</h2>
        {CONTATO.whatsapp && (
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="botao-acao mt-6 w-full max-w-sm"
          >
            <Icone nome="whatsapp" className="size-5" />
            Encomendar pelo WhatsApp
          </a>
        )}
        <ul className="mt-4 flex flex-col items-center gap-1 sm:flex-row sm:gap-6">
          <li>
            <a href={linkTelefone} className="inline-flex min-h-11 items-center gap-2 text-corpo font-semibold tabular-nums">
              <Icone nome="telefone" className="size-5 text-acabamento" />
              {CONTATO.telefone}
            </a>
          </li>
          <li>
            <a
              href={linkInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-corpo font-semibold"
            >
              <Icone nome="instagram" className="size-5 text-acabamento" />@{CONTATO.instagram}
            </a>
          </li>
        </ul>
      </div>
      {faltamFotos && (
        <p className="mx-auto mt-6 flex max-w-[52ch] items-start justify-center gap-2 text-center text-legenda text-tinta-suave">
          <Icone nome="camera" className="mt-px size-4 shrink-0" />
          Fotos dos produtos em breve: os quadros com o selo “Foto em breve” são marcadores provisórios.
        </p>
      )}
    </footer>
  );
}
