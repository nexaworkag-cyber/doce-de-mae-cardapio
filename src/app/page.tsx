import { CARDAPIO } from "@/data/cardapio";
import { Cabecalho } from "@/features/cabecalho/Cabecalho";
import { SecaoCategoria } from "@/features/cardapio/SecaoCategoria";
import { DetalheProvider } from "@/features/detalhe/DetalheProvider";
import { AbasCategorias } from "@/features/navegacao/AbasCategorias";
import { Rodape } from "@/features/rodape/Rodape";

export default function PaginaCardapio() {
  const abas = CARDAPIO.map(({ id, nome, rotuloCurto }) => ({ id, nome, rotuloCurto }));

  return (
    <DetalheProvider>
      <a href="#cardapio" className="pular-conteudo">
        Pular para o cardápio
      </a>
      <Cabecalho />
      <AbasCategorias itens={abas} />
      <main id="cardapio" tabIndex={-1} className="outline-none">
        {CARDAPIO.map((categoria) => (
          <SecaoCategoria key={categoria.id} categoria={categoria} />
        ))}
      </main>
      <Rodape />
    </DetalheProvider>
  );
}
