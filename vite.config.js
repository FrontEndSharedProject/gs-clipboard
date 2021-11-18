import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "gsClipboard",
      fileName: (format) => `gs-clipboard.${format}.js`,
    },
    minify: false,
  },
});
