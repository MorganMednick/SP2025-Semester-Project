import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  esbuild: {
    loader: 'tsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.ts': 'tsx',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
});
