import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log("VITE_API_URL from vite.config:", env.VITE_API_URL); // Added logging
  return {
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    define: {
      "process.env": env,
    },
    plugins: [tailwindcss()],
  };
});
