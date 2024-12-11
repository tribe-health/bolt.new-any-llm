import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import UnoCSS from 'unocss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      ssr: true,
      serverModuleFormat: 'esm',
    }),
    react({
      jsxRuntime: "automatic",
      babel: {
        plugins: []
      }
    }),
    UnoCSS(),
    tsconfigPaths(),
    nodePolyfills({
      include: ['buffer', 'path'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";`,
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
    hmr: false
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'react-vendor';
            }
            if (id.includes('@remix-run/')) {
              return 'remix-vendor';
            }
            if (id.includes('framer-motion/')) {
              return 'framer-motion-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@remix-run/react'],
  },
});
