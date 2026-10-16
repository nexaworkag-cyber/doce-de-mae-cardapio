import { defineConfig, type Project } from "@playwright/test";

const PORTA = 3100;

/** Larguras exigidas: desenho em 375 px, adaptado para 430, 768 e 1280. */
export const VIEWPORTS = [
  { nome: "mobile-375", width: 375, height: 812, toque: true },
  { nome: "mobile-430", width: 430, height: 932, toque: true },
  { nome: "tablet-768", width: 768, height: 1024, toque: true },
  { nome: "desktop-1280", width: 1280, height: 800, toque: false },
] as const;

const projetosE2E: Project[] = VIEWPORTS.map((v) => ({
  name: v.nome,
  testDir: "./tests/e2e",
  use: {
    viewport: { width: v.width, height: v.height },
    hasTouch: v.toque,
    isMobile: v.toque && v.width < 768,
    deviceScaleFactor: v.toque ? 2 : 1,
  },
}));

// `npm run capturas` gera as imagens de revisão em docs/capturas/ (fora do Git).
// `npm run test:e2e` roda só os 4 viewports (ver package.json).
const projetoCapturas: Project = { name: "capturas", testDir: "./tests/capturas" };

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    locale: "pt-BR",
    trace: "retain-on-failure",
  },
  projects: [...projetosE2E, projetoCapturas],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORTA}`,
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
