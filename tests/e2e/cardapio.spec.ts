import { expect, test, type Page } from "@playwright/test";
import { CARDAPIO } from "../../src/data/cardapio";
import { PRODUTOS } from "../../src/lib/cardapio";
import { partesDoPreco } from "../../src/lib/preco";

/** Roda em 375, 430, 768 e 1280 px (projetos do playwright.config.ts). */

const dialogo = (page: Page) => page.locator("dialog.detalhe");

async function abrirProduto(page: Page, id: string) {
  const botao = page.locator(`[data-produto="${id}"] button[aria-haspopup="dialog"]`);
  await botao.scrollIntoViewIfNeeded();
  await botao.click();
  await expect(dialogo(page)).toBeVisible();
  return botao;
}

test.describe("conteúdo do cardápio", () => {
  test("abertura, sumário e as 4 categorias do cardápio antigo", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Doce");
    await expect(page.locator("h1")).toContainText("Mãe");

    const sumario = page.getByRole("region", { name: "Neste cardápio" });
    for (const categoria of CARDAPIO) {
      await expect(sumario.getByRole("link", { name: new RegExp(categoria.nome, "i") })).toBeVisible();
      await expect(page.locator(`section#${categoria.id} h2`)).toContainText(categoria.nome);
    }
  });

  test("todos os 11 produtos aparecem com o preço da fonte", async ({ page }) => {
    await page.goto("/");
    expect(PRODUTOS).toHaveLength(11);
    for (const produto of PRODUTOS) {
      const cartao = page.locator(`[data-produto="${produto.id}"]`);
      await expect(cartao).toHaveCount(1);
      await expect(cartao).toContainText(produto.nome);
      await expect(cartao).toContainText(partesDoPreco(produto.precoCentavos).valor);
    }
  });

  test("todos os sabores dos centos aparecem", async ({ page }) => {
    await page.goto("/");
    for (const produto of PRODUTOS.filter((p) => p.sabores)) {
      const cartao = page.locator(`[data-produto="${produto.id}"]`);
      for (const sabor of produto.sabores ?? []) {
        await expect(cartao.getByText(sabor, { exact: true })).toHaveCount(1);
      }
    }
  });

  test("produtos sem foto mostram marcador identificado", async ({ page }) => {
    await page.goto("/");
    for (const produto of PRODUTOS.filter((p) => !p.foto)) {
      const foto = page.locator(`[data-produto="${produto.id}"] [data-foto-produto]`);
      await expect(foto).toHaveAttribute("role", "img");
      await expect(foto).toHaveAttribute("aria-label", /foto em breve/i);
    }
    await expect(page.locator("footer")).toContainText("marcadores provisórios");
  });
});

test.describe("layout", () => {
  test("sem rolagem horizontal", async ({ page }) => {
    await page.goto("/");
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sobra).toBeLessThanOrEqual(0);
  });

  test("nenhum título editorial é cortado pela máscara", async ({ page }) => {
    await page.goto("/");
    const cortados = await page.evaluate(() =>
      [...document.querySelectorAll(".linha")]
        .filter((l) => l.scrollWidth > l.clientWidth + 1)
        .map((l) => l.textContent),
    );
    expect(cortados).toEqual([]);
  });

  test("toda área de foto tem tamanho real (nenhuma colapsa)", async ({ page }) => {
    await page.goto("/");
    const tamanhos = await page.evaluate(() =>
      [...document.querySelectorAll("[data-produto] [data-foto-produto]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.getAttribute("data-foto-produto"), w: r.width, h: r.height };
      }),
    );
    expect(tamanhos).toHaveLength(PRODUTOS.length);
    for (const t of tamanhos) {
      expect(t.w, t.id ?? "").toBeGreaterThanOrEqual(56);
      expect(t.h, t.id ?? "").toBeGreaterThanOrEqual(56);
    }
  });

  test("preços legíveis: tamanho mínimo, algarismos tabulares e contraste AA", async ({ page }) => {
    await page.goto("/");
    const precos = await page.evaluate(() => {
      const luminancia = (rgb: number[]) => {
        const [r, g, b] = rgb.map((v) => {
          const c = v / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const cor = (valor: string) => (valor.match(/[\d.]+/g) ?? []).map(Number);
      const fundo = (el: Element | null): number[] => {
        while (el) {
          const c = cor(getComputedStyle(el).backgroundColor);
          if (c.length >= 3 && (c[3] === undefined || c[3] > 0.9)) return c.slice(0, 3);
          el = el.parentElement;
        }
        return [255, 250, 230];
      };
      return [...document.querySelectorAll("[data-produto] p.tabular-nums")].map((p) => {
        const estilo = getComputedStyle(p);
        const l1 = luminancia(cor(estilo.color).slice(0, 3));
        const l2 = luminancia(fundo(p));
        return {
          texto: p.textContent,
          tamanho: Number.parseFloat(estilo.fontSize),
          tabular: estilo.fontVariantNumeric.includes("tabular-nums"),
          contraste: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05),
        };
      });
    });
    expect(precos).toHaveLength(PRODUTOS.length);
    for (const preco of precos) {
      expect(preco.tamanho, preco.texto ?? "").toBeGreaterThanOrEqual(20);
      expect(preco.tabular).toBe(true);
      expect(preco.contraste, preco.texto ?? "").toBeGreaterThanOrEqual(4.5);
    }
  });

  test("áreas de toque de pelo menos 44 × 44 px", async ({ page }) => {
    await page.goto("/");
    const minimo = async (seletor: string) => {
      for (const el of await page.locator(seletor).all()) {
        const caixa = await el.boundingBox();
        expect(caixa, seletor).not.toBeNull();
        expect(caixa!.height, seletor).toBeGreaterThanOrEqual(44);
        expect(caixa!.width, seletor).toBeGreaterThanOrEqual(44);
      }
    };
    await minimo('a[href="#cardapio"]:not(.pular-conteudo)');
    await minimo("nav[aria-label='Categorias do cardápio'] a");
    await minimo("footer a");

    // O cartão inteiro é a área de toque do produto (botão com área estendida).
    for (const produto of PRODUTOS) {
      const foto = page.locator(`[data-produto="${produto.id}"] [data-foto-produto]`);
      await foto.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      const caixa = (await foto.boundingBox())!;
      const alvo = await page.evaluate(
        ([x, y]) => document.elementFromPoint(x, y)?.closest("[data-produto]")?.getAttribute("data-produto"),
        [caixa.x + caixa.width / 2, caixa.y + caixa.height / 2],
      );
      expect(alvo).toBe(produto.id);
    }

    await abrirProduto(page, "cento-tradicionais");
    await minimo('button[aria-label="Fechar detalhes"]');
    await minimo(".detalhe-acao a");
  });
});

test.describe("navegação", () => {
  test("troca de categoria pela barra flutuante e indicador ativo", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Categorias do cardápio" });
    await expect(nav).toHaveAttribute("data-visivel", "false");

    await page.locator("#cardapio").evaluate((el) => window.scrollTo({ top: (el as HTMLElement).offsetTop, behavior: "instant" }));
    await expect(nav).toHaveAttribute("data-visivel", "true");

    for (const id of ["brownies", "copo-da-felicidade", "docinhos"]) {
      await nav.locator(`a[href="#${id}"]`).click();
      await expect(nav.locator(`a[href="#${id}"]`)).toHaveAttribute("aria-current", "true", { timeout: 5000 });
      await expect
        .poll(() => page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top)))
        .toBeLessThanOrEqual(4);
    }
  });

  test("o sumário leva às categorias", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("region", { name: "Neste cardápio" }).getByRole("link", { name: /palha italiana/i }).click();
    await expect
      .poll(() => page.locator("#palha-italiana").evaluate((el) => Math.abs(el.getBoundingClientRect().top)))
      .toBeLessThan(8);
  });
});

test.describe("detalhe do produto", () => {
  test("abre por toque com os dados do cardápio e fecha pelo botão", async ({ page }) => {
    await page.goto("/");
    await abrirProduto(page, "cento-recheado");
    const d = dialogo(page);
    await expect(d.getByRole("heading", { level: 2 })).toHaveText("Recheados");
    await expect(page.getByRole("dialog", { name: "Docinhos gourmet Recheados" })).toBeVisible();
    await expect(d).toContainText("200,00");
    await expect(d).toContainText("o cento");
    await expect(d).toContainText("Até 4 sabores");
    await expect(d).toContainText("Brigadeiro com Bolo de Cenoura");
    await expect(page).toHaveURL(/#cento-recheado$/);

    await d.getByRole("button", { name: "Fechar detalhes" }).click();
    await expect(d).toBeHidden();
    await expect(page).not.toHaveURL(/#cento-recheado/);
  });

  test("mostra mínimo e medida resolvidos do grupo (palhas)", async ({ page }) => {
    await page.goto("/");
    await abrirProduto(page, "palha-tradicional-5x5");
    const d = dialogo(page);
    await expect(d.getByRole("heading", { level: 2 })).toHaveText("Tradicional");
    await expect(d).toContainText("Massa chocolate, biscoito maisena envolto no ninho");
    await expect(d).toContainText("5×5");
    await expect(d).toContainText("Mínimo 30 un.");
    await page.keyboard.press("Escape");
    await expect(d).toBeHidden();

    await abrirProduto(page, "mini-palha-oreo-3x3");
    await expect(page.locator("#detalhe-contexto")).toHaveText(/Palha italiana\s*Mini palha/);
    await expect(d).toContainText("3,00");
    await expect(d).toContainText("Mínimo 50 un.");
  });

  test("Esc e o botão voltar do navegador fecham", async ({ page }) => {
    await page.goto("/");
    await abrirProduto(page, "copo-banoffe");
    await page.keyboard.press("Escape");
    await expect(dialogo(page)).toBeHidden();

    await abrirProduto(page, "copo-brownie");
    await page.goBack();
    await expect(dialogo(page)).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
  });

  test("teclado: Enter abre, foco vai para a folha e volta ao produto", async ({ page }) => {
    await page.goto("/");
    const botao = page.locator('[data-produto="brownie-mini-3x3"] button[aria-haspopup="dialog"]');
    await botao.focus();
    await page.keyboard.press("Enter");
    await expect(dialogo(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Fechar detalhes" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialogo(page)).toBeHidden();
    await expect(botao).toBeFocused();
  });

  test("link direto abre o produto", async ({ page }) => {
    await page.goto("/#brownie-recheado-5x5");
    await expect(dialogo(page)).toBeVisible();
    await expect(dialogo(page).getByRole("heading", { level: 2 })).toHaveText("Recheado");
    await expect(page.locator("#detalhe-contexto")).toHaveText("Brownies");
    await dialogo(page).getByRole("button", { name: "Fechar detalhes" }).click();
    await expect(dialogo(page)).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("movimento e estabilidade", () => {
  test("com 'reduzir movimento', tudo aparece sem animação", async ({ browser, baseURL }, testInfo) => {
    const contexto = await browser.newContext({ ...testInfo.project.use, baseURL, reducedMotion: "reduce" });
    const page = await contexto.newPage();
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBeUndefined();
    const estado = await page.evaluate(() => ({
      fotos: [...document.querySelectorAll("[data-produto] [data-foto-produto]")].map((el) => getComputedStyle(el).clipPath),
      sabores: [...document.querySelectorAll('[data-revelar="lista"] > li')].map((el) => getComputedStyle(el).opacity),
      animacoes: document.getAnimations().filter((a) => a.playState === "running").length,
    }));
    expect(estado.fotos.every((c) => c === "none")).toBe(true);
    expect(estado.sabores.every((o) => o === "1")).toBe(true);
    expect(estado.animacoes).toBe(0);

    await page.locator('[data-produto="cento-especiais"] button').click();
    await expect(page.locator("dialog.detalhe")).toBeVisible();
    await contexto.close();
  });

  test("CLS abaixo de 0,1 ao carregar e percorrer o cardápio", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((lista) => {
        for (const entrada of lista.getEntries()) {
          const e = entrada as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!e.hadRecentInput) w.__cls += e.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const altura = await page.evaluate(() => document.documentElement.scrollHeight);
    const passo = page.viewportSize()!.height;
    for (let y = 0; y < altura; y += passo) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(120);
    }
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.1);
  });

  test("CLS abaixo de 0,1 com rede lenta (fontes chegando tarde)", async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 300,
      downloadThroughput: (750 * 1024) / 8,
      uploadThroughput: (250 * 1024) / 8,
    });
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((lista) => {
        for (const entrada of lista.getEntries()) {
          const e = entrada as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!e.hadRecentInput) w.__cls += e.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/", { waitUntil: "load", timeout: 60_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.1);
  });

  test("sem erros no console", async ({ page }) => {
    const erros: string[] = [];
    page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
    page.on("pageerror", (e) => erros.push(e.message));
    await page.goto("/");
    await abrirProduto(page, "mini-palha-oreo-3x3");
    await page.keyboard.press("Escape");
    await expect(dialogo(page)).toBeHidden();
    expect(erros).toEqual([]);
  });
});
