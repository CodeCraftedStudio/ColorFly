import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/webview/index.tsx'),
      output: {
        entryFileNames: 'webview.js',
        chunkFileNames: 'webview-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'webview.css';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
});

