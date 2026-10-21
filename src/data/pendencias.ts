/**
 * Dados ausentes ou ambíguos no cardápio antigo. Nenhum deles é exibido como fato.
 * Mantenha esta lista em sincronia com `docs/CARDAPIO-FONTE.md` (seção "Pendências").
 */
export type Pendencia = {
  id: string;
  assunto: string;
  situacao: string;
  comoEstaNaInterface: string;
};

export const PENDENCIAS: readonly Pendencia[] = [
  {
    id: "fotos",
    assunto: "Fotos dos produtos",
    situacao: "Nenhuma foto real foi fornecida.",
    comoEstaNaInterface: "Marcador \"Foto em breve\" em todos os produtos e aviso no rodapé.",
  },
  {
    id: "peso-recheado",
    assunto: "Peso do cento recheado",
    situacao: "Texto pequeno e borrado no original: \"19G\" (pode ser \"18G\").",
    comoEstaNaInterface: "Exibido como 19 g. Confirmar.",
  },
  {
    id: "peso-significado",
    assunto: "Significado do peso (15 g / 19 g)",
    situacao: "O original diz só \"15G\"; presume-se que seja o peso de cada docinho.",
    comoEstaNaInterface: "Exibido como no original, sem dizer \"cada\".",
  },
  {
    id: "cento-quantidade",
    assunto: "Encomenda abaixo de um cento",
    situacao: "O cardápio só traz preço por cento. Não diz se há meio cento ou quantidade menor.",
    comoEstaNaInterface: "Nada é exibido além do preço do cento.",
  },
  {
    id: "minimo-palha-5x5",
    assunto: "Mínimo das palhas 5×5",
    situacao: "\"Mínimo 30 uni.\" aparece uma vez, abaixo da Oreo 5×5. Presume-se que vale para as duas 5×5.",
    comoEstaNaInterface: "Exibido como mínimo do grupo 5×5. Confirmar.",
  },
  {
    id: "preco-unitario",
    assunto: "Preço por unidade",
    situacao: "Brownies, palhas e copos têm preço e mínimo em unidades; presume-se preço por unidade.",
    comoEstaNaInterface: "Preço exibido junto do mínimo, sem escrever \"por unidade\".",
  },
  {
    id: "unidade-medida",
    assunto: "Unidade das medidas 5×5 e 3×3",
    situacao: "O original não diz a unidade (provavelmente centímetros).",
    comoEstaNaInterface: "Exibido como 5×5 e 3×3, sem unidade.",
  },
  {
    id: "opcoes-copo-brownie",
    assunto: "Opções do copo Brownie",
    situacao: "\"Ninho · Brigadeiro · Doce de Leite\" aparece sem rótulo. Presume-se que sejam sabores à escolha.",
    comoEstaNaInterface: "Lista exibida sem rótulo de \"escolha\".",
  },
  {
    id: "grafia",
    assunto: "Grafia de sabores",
    situacao: "Mantida como no original: Cappucino, Ferrero Roche, Geléia, Banoffe, Tie Dye.",
    comoEstaNaInterface: "Grafia original. Aguardando decisão sobre correção.",
  },
  {
    id: "comercial",
    assunto: "Prazo, entrega, retirada, pagamento, validade, alergênicos",
    situacao: "Ausentes no cardápio.",
    comoEstaNaInterface: "Não exibidos.",
  },
  {
    id: "descricoes",
    assunto: "Descrições de sabores e ingredientes",
    situacao: "Só as palhas 5×5 têm descrição no original.",
    comoEstaNaInterface: "Sem descrições inventadas.",
  },
];
