import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  // Absolute base: the app is served from the domain root (Vercel) and uses
  // nested client routes (/admin/dashboard, /cv). A relative base ('./')
  // resolves assets against the current path, so any full load or lazy
  // chunk fetch below / breaks (refresh on /admin = blank page).
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
