import Image from "next/image";

/**
 * Monograma oficial (D + cupcake). Arquivos gerados dos PNGs 4K da marca sem alterar a arte.
 * Combinações permitidas: dourado sobre chocolate (principal), chocolate sobre creme, creme sobre escuros.
 */
const ARQUIVOS = {
  dourado: "/brand/monograma-dourado.png",
  chocolate: "/brand/monograma-chocolate.png",
  creme: "/brand/monograma-creme.png",
} as const;

export function Monograma({
  cor,
  className,
  decorativo = true,
  prioridade = false,
  sizes = "160px",
}: {
  cor: keyof typeof ARQUIVOS;
  className?: string;
  decorativo?: boolean;
  prioridade?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={ARQUIVOS[cor]}
      width={1295}
      height={1600}
      alt={decorativo ? "" : "Doce de Mãe"}
      priority={prioridade}
      sizes={sizes}
      className={className}
    />
  );
}
