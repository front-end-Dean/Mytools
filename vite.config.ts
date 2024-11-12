// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { renameSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'static', // 设置资源目录
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: 'static/[name][extname]', // 保持资源在 static 文件夹下
        chunkFileNames: 'static/[name].js',
        entryFileNames: 'static/[name].js'
      }
    },
    // 在打包完成后进行 favicon.ico 文件移动
    emptyOutDir: true
  },
  plugins: [
    vue(),
    {
      name: 'move-favicon',
      apply: 'build',
      closeBundle() {
        try {
          renameSync('dist/favicon.ico', 'dist/static/favicon.ico')
        } catch (e) {
          console.warn('Favicon.ico not found, skipping move.')
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0'
  }
})
