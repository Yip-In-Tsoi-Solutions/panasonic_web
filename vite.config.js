import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // ถ้า Express server ของคุณรันบน container ชื่อ "backend" และ port 3000
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }
  },
  build: {
    outDir: "dist",
  },
});
