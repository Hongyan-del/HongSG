
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  define: {
    // 確保 process.env.API_KEY 在瀏覽器端可用
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
