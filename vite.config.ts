import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/wt2-frontend/', // Makes sure the app is deployed at the correct path
  plugins: [react(), tailwindcss()],
})
