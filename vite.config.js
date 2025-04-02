import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          secure: false,
        },
      },
    },
    plugins: [tailwindcss()],
  };
});

//https://wohngluk-api.onrender.com
