import { test } from "@playwright/test";
test("foco-teclado", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.locator('[data-produto="cento-especiais"] button').focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await page.locator('[data-produto="cento-especiais"]').evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(1600);
  await page.screenshot({ path: "docs/capturas/mobile-375/15-foco-teclado.png" });
});
