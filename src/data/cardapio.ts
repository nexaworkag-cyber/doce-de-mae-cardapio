/**
 * Cardápio Doce de Mãe — dados comerciais.
 *
 * FONTE DE VERDADE: o cardápio antigo da família, em `docs/referencias/cardapio-antigo.jpg`,
 * transcrito linha a linha em `docs/CARDAPIO-FONTE.md`.
 *
 * Regras:
 * - Nada aqui pode ser inventado (preço, sabor, peso, medida, mínimo, prazo…).
 * - O que estiver ausente ou ambíguo no original fica em `PENDENCIAS` (src/data/pendencias.ts)
 *   e simplesmente não aparece na interface.
 * - Normalizações de texto feitas na transcrição (documentadas em CARDAPIO-FONTE.md):
 *   "c/" → "com", "uni." → "un.", "5X5" → "5×5". A grafia original dos sabores foi mantida.
 * - `tom` é apenas visual (cor do marcador de foto), não é dado comercial.
 */

export type CategoriaId = "docinhos" | "brownies" | "palha-italiana" | "copo-da-felicidade";

/** Cores da marca usadas nos marcadores de foto (placeholders). */
export type Tom = "chocolate" | "rosa-argila" | "rosa-antigo" | "figo" | "dourado" | "baunilha";

export type Foto = {
  src: string;
  alt: string;
  largura: number;
  altura: number;
};

export type Produto = {
  id: string;
  /** Nome como aparece no cardápio, dentro da sua categoria. */
  nome: string;
  /** Nome completo, usado no detalhe, no WhatsApp e para leitores de tela. */
  nomeCompleto: string;
  precoCentavos: number;
  /** Quando o preço é do cento (docinhos). */
  unidadePreco?: "cento";
  /** Medida exatamente como no cardápio. A unidade (cm?) não é informada. */
  medida?: string;
  porcao?: string;
  /** Pedido mínimo em unidades, quando informado para o próprio produto. */
  pedidoMinimo?: number;
  saboresPorPedido?: number;
  /** Peso como no cardápio ("15G"). */
  peso?: string;
  descricao?: string;
  sabores?: readonly string[];
  /** Opções listadas sob o produto, sem rótulo no original (ex.: Copo Brownie). */
  opcoes?: readonly string[];
  /** Foto real do produto. `null` = ainda não fornecida → marcador "Foto em breve". */
  foto: Foto | null;
  tom: Tom;
};

export type Grupo = {
  id: string;
  /** Título do grupo, quando existe no cardápio (ex.: "Mini palha"). */
  nome?: string;
  /** Mínimo que o cardápio informa para o grupo inteiro. */
  pedidoMinimo?: number;
  porcao?: string;
  produtos: readonly Produto[];
};

export type Categoria = {
  id: CategoriaId;
  nome: string;
  /** Rótulo curto para a navegação no celular. */
  rotuloCurto: string;
  /** Bloco do cardápio antigo: "Docinhos gourmet" ou "Mais delícias". */
  bloco: "Docinhos gourmet" | "Mais delícias";
  /** Recheios listados para a categoria (Brownies). */
  recheios?: readonly string[];
  grupos: readonly Grupo[];
};

export const CARDAPIO: readonly Categoria[] = [
  {
    id: "docinhos",
    nome: "Docinhos gourmet",
    rotuloCurto: "Docinhos",
    bloco: "Docinhos gourmet",
    grupos: [
      {
        id: "centos",
        produtos: [
          {
            id: "cento-tradicionais",
            nome: "Tradicionais",
            nomeCompleto: "Cento tradicionais",
            precoCentavos: 15000,
            unidadePreco: "cento",
            saboresPorPedido: 4,
            peso: "15 g",
            sabores: [
              "Brigadeiro",
              "Beijinho",
              "Sensação",
              "Cappucino",
              "Amendoim",
              "Casadinho",
              "Napolitano",
              "Morango",
              "Churros",
              "Romeu e Julieta",
              "Ninho com Nutella",
            ],
            foto: {
              src: "/fotos/cento-tradicionais.webp",
              alt: "Bandeja de docinhos tradicionais: brigadeiros com granulado, docinhos com açúcar e doce de leite, e docinhos brancos com espiral de chocolate",
              largura: 1265,
              altura: 1244,
            },
            tom: "rosa-argila",
          },
          {
            id: "cento-especiais",
            nome: "Especiais",
            nomeCompleto: "Cento especiais",
            precoCentavos: 17000,
            unidadePreco: "cento",
            saboresPorPedido: 4,
            peso: "15 g",
            sabores: [
              "Oreo",
              "Kit Kat",
              "Tie Dye",
              "Meio Amargo",
              "Ferrero Roche",
              "Coco Queimado",
              "Coco com Geléia de Maracujá",
            ],
            foto: {
              src: "/fotos/cento-especiais.webp",
              alt: "Quatro fotos de docinhos especiais: com biscoito Oreo, de coco com geleia de maracujá, com crocante de avelã e com wafer de chocolate",
              largura: 1254,
              altura: 1254,
            },
            tom: "dourado",
          },
          {
            id: "cento-recheado",
            nome: "Recheados",
            nomeCompleto: "Cento recheado",
            precoCentavos: 20000,
            unidadePreco: "cento",
            saboresPorPedido: 4,
            // Leitura incerta no original ("19G" ou "18G") — ver PENDENCIAS.
            peso: "19 g",
            sabores: [
              "Prestígio",
              "Ninho com Uva",
              "Queijo com Goiabada",
              "Morango com Chocolate",
              "Brigadeiro com Bolo de Cenoura",
            ],
            foto: {
              // Nome com versão: o otimizador de imagens do Next guarda cache por URL.
              src: "/fotos/cento-recheado-3.webp",
              alt: "Três fotos de docinhos recheados: bandeja de docinhos claros e vermelhos decorados com laços e taças, um aberto com recheio cremoso coberto de coco e outro aberto com recheio de chocolate crocante",
              largura: 1672,
              altura: 941,
            },
            tom: "figo",
          },
        ],
      },
    ],
  },
  {
    id: "brownies",
    nome: "Brownies",
    rotuloCurto: "Brownies",
    bloco: "Mais delícias",
    recheios: ["Ninho", "Brigadeiro", "Nutella", "Doce de Leite"],
    grupos: [
      {
        id: "brownies",
        produtos: [
          {
            id: "brownie-recheado-5x5",
            nome: "Recheado",
            nomeCompleto: "Brownie recheado 5×5",
            precoCentavos: 700,
            medida: "5×5",
            pedidoMinimo: 30,
            foto: {
              src: "/fotos/brownie-recheado.webp",
              alt: "Brownies em forminhas azuis, cada um com um confeito de creme branco por cima",
              largura: 1254,
              altura: 1254,
            },
            tom: "chocolate",
          },
          {
            id: "brownie-mini-3x3",
            nome: "Mini",
            nomeCompleto: "Brownie mini 3×3",
            precoCentavos: 300,
            medida: "3×3",
            pedidoMinimo: 50,
            foto: {
              src: "/fotos/brownie-mini.webp",
              alt: "Caixa com brownies em forminhas brancas de papel, com a casquinha brilhante e craquelada por cima",
              largura: 1254,
              altura: 1254,
            },
            tom: "rosa-antigo",
          },
        ],
      },
    ],
  },
  {
    id: "palha-italiana",
    nome: "Palha italiana",
    rotuloCurto: "Palha",
    bloco: "Mais delícias",
    grupos: [
      {
        id: "palha-5x5",
        // No original, "Mínimo 30 uni." aparece logo abaixo dos dois itens 5×5 — ver PENDENCIAS.
        pedidoMinimo: 30,
        produtos: [
          {
            id: "palha-tradicional-5x5",
            nome: "Tradicional",
            nomeCompleto: "Palha italiana tradicional 5×5",
            precoCentavos: 400,
            medida: "5×5",
            descricao: "Massa chocolate, biscoito maisena envolto no ninho",
            foto: {
              src: "/fotos/palha-tradicional.webp",
              alt: "Três fotos de palha italiana: quadrados cobertos de leite em pó em forminhas azuis, embalados com fita laranja numa cesta e embalados com fita marrom",
              largura: 1254,
              altura: 1254,
            },
            tom: "dourado",
          },
          {
            id: "palha-oreo-5x5",
            nome: "Oreo",
            nomeCompleto: "Palha italiana Oreo 5×5",
            precoCentavos: 500,
            medida: "5×5",
            descricao: "Massa ninho com biscoito oreo envolto no leite ninho",
            foto: {
              // Nome com versão: o otimizador de imagens do Next guarda cache por URL.
              src: "/fotos/palha-oreo-4.webp",
              alt: "Duas fotos de palha italiana de Oreo com um biscoito por cima: embaladas com fita laranja e servidas num prato",
              largura: 1254,
              altura: 1254,
            },
            tom: "baunilha",
          },
        ],
      },
      {
        id: "mini-palha",
        nome: "Mini palha",
        pedidoMinimo: 50,
        produtos: [
          {
            id: "mini-palha-tradicional-3x3",
            nome: "Tradicional",
            nomeCompleto: "Mini palha tradicional 3×3",
            precoCentavos: 250,
            medida: "3×3",
            foto: {
              src: "/fotos/mini-palha-tradicional.webp",
              alt: "Duas fotos de mini palhas italianas em forminhas verdes, enfileiradas numa bandeja de inox",
              largura: 1536,
              altura: 1024,
            },
            tom: "rosa-argila",
          },
          {
            id: "mini-palha-oreo-3x3",
            nome: "Oreo",
            nomeCompleto: "Mini palha Oreo 3×3",
            precoCentavos: 300,
            medida: "3×3",
            foto: {
              src: "/fotos/mini-palha-oreo.webp",
              alt: "Mini palhas italianas claras, cobertas de açúcar cristal e raspas verdes, enfileiradas em forminhas transparentes",
              largura: 1079,
              altura: 1457,
            },
            tom: "rosa-antigo",
          },
        ],
      },
    ],
  },
  {
    id: "copo-da-felicidade",
    nome: "Copo da felicidade",
    rotuloCurto: "Copo",
    bloco: "Mais delícias",
    grupos: [
      {
        id: "copos",
        porcao: "180 ml",
        pedidoMinimo: 20,
        produtos: [
          {
            id: "copo-brownie",
            nome: "Brownie",
            nomeCompleto: "Copo da felicidade Brownie",
            precoCentavos: 1200,
            opcoes: ["Ninho", "Brigadeiro", "Doce de Leite"],
            foto: {
              src: "/fotos/copo-brownie.webp",
              alt: "Duas fotos de copos da felicidade com camadas de brownie e creme claro, em copos transparentes com tampa",
              largura: 1254,
              altura: 1254,
            },
            tom: "dourado",
          },
          {
            id: "copo-banoffe",
            nome: "Banoffe",
            nomeCompleto: "Copo da felicidade Banoffe",
            precoCentavos: 1500,
            foto: {
              src: "/fotos/copo-banoffe.webp",
              alt: "Copos da felicidade banoffe em camadas: farofa de biscoito, doce de leite, banana com canela e chantilly, com colherinhas douradas",
              largura: 1254,
              altura: 1254,
            },
            tom: "rosa-argila",
          },
        ],
      },
    ],
  },
];
