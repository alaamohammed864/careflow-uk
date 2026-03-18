import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // تأكد أن السطر يبدأ وينتهي بـ /
  base: "/careflow-uk/", 
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // هذا السطر يضمن خروج الملفات في المجلد الصحيح لـ GitHub Pages
    outDir: "dist",
  }
}));
