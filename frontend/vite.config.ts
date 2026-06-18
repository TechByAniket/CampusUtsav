import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true, // allow external access
    port: 5173, // your dev port
    allowedHosts: [
      'sacrilegiously-auscultative-carline.ngrok-free.dev',
      '.ngrok-free.dev', // optional: allow all ngrok-free.dev subdomains
    ],
  },
});
