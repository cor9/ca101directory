import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    name: "parent-features",
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.tsx"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/app/**/parent/**/*.{ts,tsx}",
        "src/data/favorites.ts",
        "src/data/reviews.ts",
        "src/lib/auth/roles.ts",
        "src/config/feature-flags.ts",
      ],
      exclude: [
        "node_modules/**",
        "src/__tests__/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
