import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb'],
  server: {
    proxy: {
      '/api': {
        target: 'https://revakalp-2461.onrender.com',
        // target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
