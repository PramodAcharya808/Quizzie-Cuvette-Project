import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendUrl = "https://quizcraft-gl9v.onrender.com";
// const backendUrl = "http://localhost:8000";

export default defineConfig({
  plugins: [react()],
  preview: {
    port: parseInt(process.env.PORT) || 4173, // Use the port from Render, default to 4173 if not set
    host: "0.0.0.0", // Bind to all network interfaces to make it accessible
  },
  server: {
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      },
    },
  },
});
