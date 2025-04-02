import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    server: {
      proxy: {
        "/api": {
          target: "https://wohngluk-api.onrender.com",
          secure: false,
        },
      },
    },
    plugins: [tailwindcss()],
  };
});

//https://wohngluk-api.onrender.com
