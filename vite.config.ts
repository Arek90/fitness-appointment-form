import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/holidays": {
        target: "https://api.api-ninjas.com/v1/publicholidays",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/holidays/, ""),
        headers: {
          "X-Api-Key": "OH+HEf/9IH2zuHR/cMO/8g==ldhBovC6Rpa1TIss",
        },
      },
    },
  },
});
