import { test, type Page } from "@playwright/test";
import { VIEWPORTS } from "../../playwright.config";

/**
 * Capturas de revisão (não são testes de regressão). Saída: docs/capturas/<viewport>/.
 * - Telas na altura do aparelho, com movimento ligado, rolando como uma pessoa faria.
 * - Página inteira com "reduzir movimento" (tudo visível de uma vez).
 */

const PARADAS: { nome: string; alvo: string; deslocamento?: number }[] = [
  { nome: "02-sumario", alvo: "#cardapio" },
  { nome: "03-docinhos", alvo: "#docinhos" },
  { nome: "04-tradicionais", alvo: '[data-produto="cento-tradicionais"]' },
  { nome: "05-especiais", alvo: '[data-produto="cento-especiais"]', deslocamento: -56 },
  { nome: "06-recheados", alvo: '[data-produto="cento-recheado"]', deslocamento: -56 },
  { nome: "07-mais-delicias", alvo: "#brownies", deslocamento: -360 },
  { nome: "08-brownies", alvo: '[data-produto="brownie-recheado-5x5"]', deslocamento: -24 },
  { nome: "09-palha", alvo: "#palha-italiana" },
  { nome: "10-mini-palha", alvo: '[data-produto="mini-palha-tradicional-3x3"]', deslocamento: -200 },
  { nome: "11-copo", alvo: "#copo-da-felicidade" },
  { nome: "12-rodape", alvo: "footer" },
];

async function rolarAte(page: Page, seletor: string, deslocamento = 0) {
  await page.evaluate(
    ([sel, d]) => {
      const el = document.querySelector(sel as string);
      if (!el) return;
      const topo = el.getBoundingClientRect().top + window.scrollY + (d as number);
      window.scrollTo({ top: topo, behavior: "instant" });
    },
    [seletor, deslocamento] as const,
  );
  await page.waitForTimeout(1700);
}

for (const v of VIEWPORTS) {
  test.describe(v.nome, () => {
    test.use({
      viewport: { width: v.width, height: v.height },
      hasTouch: v.toque,
      isMobile: v.toque && v.width < 768,
      deviceScaleFactor: v.width < 768 ? 2 : 1,
    });

    test("telas", async ({ page }) => {
      test.setTimeout(120_000);
      const pasta = `docs/capturas/${v.nome}`;
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running" || a.timeline !== document.timeline));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${pasta}/01-abertura.png` });

      for (const parada of PARADAS) {
        await rolarAte(page, parada.alvo, parada.deslocamento);
        await page.screenshot({ path: `${pasta}/${parada.nome}.png` });
      }

      await rolarAte(page, '[data-produto="cento-tradicionais"]');
      await page.locator('[data-produto="cento-tradicionais"] button').click();
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${pasta}/13-detalhe.png` });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(600);

      await rolarAte(page, '[data-produto="palha-oreo-5x5"]');
      await page.locator('[data-produto="palha-oreo-5x5"] button').click();
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${pasta}/14-detalhe-palha.png` });
    });

    test("pagina-inteira", async ({ browser }) => {
      const contexto = await browser.newContext({
        viewport: { width: v.width, height: v.height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        baseURL: "http://localhost:3100",
      });
      const page = await contexto.newPage();
      await page.goto("/");
      await page.waitForTimeout(800);
      await page.screenshot({ path: `docs/capturas/${v.nome}/00-pagina-inteira.png`, fullPage: true });
      await contexto.close();
    });
  });
}
