import { defineVitestConfig } from "@nuxt/test-utils/config";
import { coverageConfigDefaults } from "vitest/config";
import { resolve } from "path";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, "nuxt.config.ts"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
      "~": resolve(__dirname, "./"),
    },
  },
});
