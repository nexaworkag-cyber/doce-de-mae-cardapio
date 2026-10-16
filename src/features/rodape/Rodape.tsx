import { CONTATO } from "@/data/contato";
import { linkInstagram, linkTelefone, linkWhatsApp } from "@/lib/contato";
import { Icone } from "@/components/Icone";
import { Monograma } from "@/components/Monograma";

/** Fechamento: o chamado do cardápio antigo ("Faça sua encomenda!") e os contatos dele. */
export function Rodape() {
  return (
    <footer className="relative z-10 bg-baunilha pt-20 pb-32 md:pt-28 md:pb-36">
      <div className="moldura grid gap-10 md:grid-cols-12 md:items-end">
        <div className="min-w-0 md:col-span-7">
          <Monograma cor="chocolate" sizes="96px" className="h-auto w-16 md:w-20" />
          <h2 className="display mt-8 text-[clamp(2.125rem,0.9rem+5.4vw,5.75rem)] leading-[1]">{CONTATO.chamada}</h2>
        </div>

        <div className="flex min-w-0 flex-col gap-4 md:col-span-5 md:items-end">
          {CONTATO.whatsapp && (
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-espresso px-7 text-corpo font-semibold text-creme shadow-flutuante transition-transform duration-200 active:scale-[0.98] md:w-auto"
            >
              <Icone nome="whatsapp" className="size-5" />
              Encomendar pelo WhatsApp
            </a>
          )}
          <ul className="flex flex-col gap-1 md:items-end">
            <li>
              <a href={linkTelefone} className="inline-flex min-h-11 items-center gap-2.5 text-corpo-lg font-semibold tabular-nums">
                <Icone nome="telefone" className="size-5 text-rosa-profundo" />
                {CONTATO.telefone}
              </a>
            </li>
            <li>
              <a
                href={linkInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2.5 text-corpo-lg font-semibold"
              >
                <Icone nome="instagram" className="size-5 text-rosa-profundo" />@{CONTATO.instagram}
              </a>
            </li>
          </ul>
        </div>

        <p className="flex items-start gap-2 border-t border-linha pt-6 text-apoio text-cacau md:col-span-12">
          <Icone nome="camera" className="mt-px size-4 shrink-0" />
          As fotos dos produtos estão a caminho. Por enquanto, os quadros com o selo “Foto em breve” são
          marcadores provisórios, não imagens dos doces.
        </p>
      </div>
    </footer>
  );
}
