/**
 * Contato — do rodapé do cardápio antigo ("Faça sua encomenda!").
 * O ícone ao lado do telefone está ilegível no arquivo original: o uso como WhatsApp
 * é uma inferência e está em PENDENCIAS. Para desligar o WhatsApp, troque `whatsapp` para `false`.
 */
export const CONTATO = {
  chamada: "Faça sua encomenda!",
  /** Número atual (WhatsApp e ligação), informado pela família em 21/10/2026. O cardápio antigo trazia (21) 97680-4627. */
  telefone: "(21) 96669-6546",
  /** Mesmo número em formato internacional, só dígitos (link de ligação). */
  telefoneE164: "5521966696546",
  whatsapp: true,
  /** Número que recebe as mensagens do WhatsApp (pedidos da sacola e contato). */
  whatsappE164: "5521966696546",
  instagram: "docedemaetelier_",
} as const;
