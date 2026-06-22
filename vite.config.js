import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' // 1. Ова е важно, го додаваме за патеките

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),  // Твојата почетна страна
        about: resolve(__dirname, 'about.html')  // Новата About страна
      }
    }
  }
})
