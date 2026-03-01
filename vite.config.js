import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Pour GitHub Pages avec repo username.github.io, base = '/'
  base: '/',
})
