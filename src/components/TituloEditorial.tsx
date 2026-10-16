import { Fragment, type CSSProperties, type ElementType } from "react";
import { quebrarEmLinhas } from "@/lib/texto";

/**
 * Título em Archivo expandida, uma linha por máscara (revelada ao rolar).
 * O texto fica em caixa normal no HTML; a caixa alta é só visual.
 */
export function TituloEditorial({
  texto,
  como: Tag = "h2",
  id,
  className = "",
  maximo = 8,
  revelar = true,
}: {
  texto: string;
  como?: ElementType;
  id?: string;
  className?: string;
  maximo?: number;
  revelar?: boolean;
}) {
  const linhas = quebrarEmLinhas(texto, maximo);
  return (
    <Tag id={id} tabIndex={-1} data-revelar={revelar ? "titulo" : undefined} className={`display outline-none ${className}`}>
      {linhas.map((linha, i) => (
        <Fragment key={linha}>
          {i > 0 && " "}
          <span className="linha" style={{ "--i": i } as CSSProperties}>
            <span>{linha}</span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
