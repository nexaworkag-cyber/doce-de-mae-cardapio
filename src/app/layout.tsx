import type { Metadata, Viewport } from "next";
import { Archivo, Figtree } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cardápio — Doce de Mãe",
  description:
    "Cardápio da Doce de Mãe: docinhos gourmet pelo cento, brownies, palha italiana e copo da felicidade.",
};

export const viewport: Viewport = {
  themeColor: "#52352f",
  viewportFit: "cover",
};

/**
 * Roda antes da primeira pintura: só liga os estados iniciais das animações quando o sistema
 * não pede movimento reduzido e o navegador tem IntersectionObserver. Se o observador do
 * cardápio não iniciar em 2,5 s, desliga tudo — o conteúdo nunca fica escondido.
 */
const scriptMovimento = `(function(){try{var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: no-preference)').matches&&'IntersectionObserver' in window){d.dataset.motion='ok';setTimeout(function(){if(!window.__revelarPronto){delete d.dataset.motion}},2500)}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${figtree.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptMovimento }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
