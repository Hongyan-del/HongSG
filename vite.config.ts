
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  define: {
    // 解決 SDK 引用 process.env 時在瀏覽器端報錯的問題
    'process.env': {}
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
