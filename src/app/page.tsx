import { CARDAPIO } from "@/data/cardapio";
import { Abertura } from "@/features/abertura/Abertura";
import { CapituloBrownies } from "@/features/cardapio/CapituloBrownies";
import { CapituloCopo } from "@/features/cardapio/CapituloCopo";
import { CapituloDocinhos } from "@/features/cardapio/CapituloDocinhos";
import { CapituloPalha } from "@/features/cardapio/CapituloPalha";
import { Interludio } from "@/features/cardapio/Interludio";
import { DetalheProvider } from "@/features/detalhe/DetalheProvider";
import { RevelarAoRolar } from "@/features/movimento/RevelarAoRolar";
import { NavegacaoCategorias } from "@/features/navegacao/NavegacaoCategorias";
import { Rodape } from "@/features/rodape/Rodape";
import { Sumario } from "@/features/sumario/Sumario";

export default function PaginaCardapio() {
  const itensNavegacao = CARDAPIO.map(({ id, nome, rotuloCurto }) => ({ id, nome, rotuloCurto }));

  return (
    <DetalheProvider>
      <a href="#cardapio" className="pular-conteudo">
        Pular para o cardápio
      </a>
      <Abertura />
      {/* A folha creme sobe por cima da abertura (que fica presa ao topo). */}
      <main
        id="cardapio"
        tabIndex={-1}
        className="relative z-10 -mt-8 rounded-t-folha bg-leite shadow-folha outline-none"
      >
        <Sumario />
        <CapituloDocinhos />
        <Interludio />
        <CapituloBrownies />
        <CapituloPalha />
        <CapituloCopo />
      </main>
      <Rodape />
      <NavegacaoCategorias itens={itensNavegacao} />
      <RevelarAoRolar />
    </DetalheProvider>
  );
}
