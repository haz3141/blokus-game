import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
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
  plugins: [
    react(),
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
  ]
});
