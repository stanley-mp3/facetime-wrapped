import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  optimizeDeps: {
    // sql.js ships its own WASM — exclude from esbuild pre-bundling
    exclude: ['sql.js'],
  },
})
