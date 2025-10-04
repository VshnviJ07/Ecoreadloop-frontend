import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./", // ensures correct asset paths on Vercel
  build: {
    outDir: 'dist', // default build folder
    sourcemap: false, // disable source maps in production
  },
})
