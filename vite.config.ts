import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { Plugin } from 'vite';

// Custom plugin to handle markdown files
function markdown(): Plugin {
  return {
    name: 'markdown',
    transform(code, id) {
      if (!id.endsWith('.md')) return null;
      
      // Export the content as a string
      return {
        code: `export default ${JSON.stringify(code)};`,
        map: null
      };
    }
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    markdown()
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          ui: ['@nextui-org/react', '@nextui-org/system', '@nextui-org/theme'],
          form: ['react-hook-form', '@hookform/resolvers', 'zod'],
          markdown: ['react-markdown', 'react-syntax-highlighter'],
          icons: ['lucide-react'],
          state: ['zustand']
        }
      },
      treeshake: {
        moduleSideEffects: true,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode !== 'production',
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        passes: 2,
        drop_console: true,
        drop_debugger: true,
        pure_getters: true,
        unsafe: true,
        unsafe_math: true
      }
    } : undefined
  },
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
    target: 'esnext',
    drop: mode === 'production' ? ['console', 'debugger'] : []
  },
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    exclude: ['@xenova/transformers']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        secure: false
      }
    }
  }
}));