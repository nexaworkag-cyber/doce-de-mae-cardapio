import type { SVGProps } from "react";

/**
 * Ícones em traço (estilo Lucide), desenhados inline para não adicionar dependência.
 * Sempre decorativos: o texto ao lado (ou um aria-label no controle) carrega o significado.
 */
const caminhos = {
  fechar: <path d="M18 6 6 18M6 6l12 12" />,
  "seta-baixo": <path d="m6 9 6 6 6-6" />,
  "seta-direita": <path d="m9 6 6 6-6 6" />,
  camera: (
    <>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="13" r="3" />
    </>
  ),
  sacola: (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  lixeira: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  telefone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  ),
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5 4.8 16A8.6 8.6 0 1 1 8 19.2Z" />
      <path
        d="M9.2 8.6c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.1-.2.3 0 .5.4.7 1 1.3 1.6 1.8.3.2.6.4 1 .5.2.1.4 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5 0 .7-.4 1.3-1 1.6-.5.2-1 .3-1.6.1a8.4 8.4 0 0 1-4.9-4.4c-.3-.8-.4-1.6-.1-2.3Z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
} as const;

export type NomeIcone = keyof typeof caminhos;

export function Icone({ nome, ...props }: { nome: NomeIcone } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {caminhos[nome]}
    </svg>
  );
}
