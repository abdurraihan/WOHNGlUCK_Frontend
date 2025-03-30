// import tailwindcss from "@tailwindcss/vite";
// import { defineConfig, loadEnv } from "vite";

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd());
//   console.log("VITE_API_URL from vite.config:", env.VITE_API_URL); // Added logging
//   return {
//     server: {
//       proxy: {
//         "/api": {
//           target: env.VITE_API_URL,
//           changeOrigin: true,
//           ws: true,
//         },
//       },
//     },
//     define: {
//       "process.env": env,
//     },
//     plugins: [tailwindcss()],
//   };
// });

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log("VITE_API_URL from vite.config:", env.VITE_API_URL); // This logs the API URL

  return {
    server: {
      proxy: {
        // Proxy all requests that start with /api
        "/api": {
          target: env.VITE_API_URL, // VITE_API_URL should be https://wohngluk-api.onrender.com
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"), // Ensure the /api prefix stays intact
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
