import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    globalSetup: "./vitest.global.ts",
    setupFiles: "./vitest.setup.ts",
  },
});
