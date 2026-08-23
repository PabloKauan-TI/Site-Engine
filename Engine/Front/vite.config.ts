// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts
    server: { entry: "server" },
  },
  vite: {
    server: {
      host: true,
      allowedHosts: ["enginelab.ufc.br", ".ufc.br"],
      watch: {
        usePolling: true,
      },
      proxy: {
        "/back/api": {
          target: "http://enginelab.ufc.br",
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: true,
      allowedHosts: ["enginelab.ufc.br", ".ufc.br"],
    },
  },
});
