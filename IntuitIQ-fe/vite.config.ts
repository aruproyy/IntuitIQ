import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Ensures assets load from root path
  build: {
    outDir: 'dist',  // Explicit output directory
    assetsDir: 'assets',  // Organizes JS/CSS files
    emptyOutDir: true,  // Cleans the directory before build
    rollupOptions: {
      output: {
        // Ensures consistent chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  server: {
    // Required for HMR in some network setups
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
})