import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/anecdotes": "http://localhost:3001",
    },
  },
  // Vercel serves the generated frontend from its public directory.
  publicDir: "static",
  build: {
    outDir: "public",
    emptyOutDir: true,
  },
});
