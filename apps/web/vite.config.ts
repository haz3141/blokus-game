import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig(({ mode }) => {
  const isStorybook =
    mode === "storybook" ||
    process.env.STORYBOOK === "1" ||
    process.env.STORYBOOK === "true";

  const plugins = [tailwindcss(), react()];

  if (!isStorybook) {
    plugins.push(
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icons/*.png"],
        manifest: {
          name: "Cornerfall",
          short_name: "Cornerfall",
          description: "A mobile-first multiplayer corner-placement polyomino strategy game.",
          theme_color: "#09101f",
          background_color: "#09101f",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "/icons/cornerfall-192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "/icons/cornerfall-512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "/icons/cornerfall-512-maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ]
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,svg}"],
          navigateFallbackDenylist: [/^\/connect\//, /^\/api\//]
        }
      })
    );
  }

  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("/node_modules/three/")) {
              return "three-vendor";
            }

            if (
              id.includes("/node_modules/@react-three/fiber/") ||
              id.includes("/node_modules/its-fine/") ||
              id.includes("/node_modules/react-reconciler/") ||
              id.includes("/node_modules/react-use-measure/") ||
              id.includes("/node_modules/suspend-react/")
            ) {
              return "r3f-vendor";
            }

            return undefined;
          }
        }
      }
    },
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8787",
          changeOrigin: true
        },
        "/connect": {
          target: "http://127.0.0.1:8787",
          changeOrigin: true,
          ws: true
        },
        "/health": {
          target: "http://127.0.0.1:8787",
          changeOrigin: true
        }
      }
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(srcDir)
      }
    }
  };
});
