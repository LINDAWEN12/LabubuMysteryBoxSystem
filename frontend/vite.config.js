import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // 新增代理配置（对接后端API）
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // 确保与后端端口一致
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    // 启用热更新
    hmr: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 确保这些路径别名存在
      'components': path.resolve(__dirname, './src/components'),
      'pages': path.resolve(__dirname, './src/pages')
    }
  },
  // 构建优化
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
});