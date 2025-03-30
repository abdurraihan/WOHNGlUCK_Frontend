import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // Load environment variables

  return {
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL, // Use the API URL from .env
          changeOrigin: true,
          ws: true,
        },
      },
    },
    define: {
      "process.env": env, // Ensure environment variables are available globally
    },
    plugins: [tailwindcss()],
  };
});
