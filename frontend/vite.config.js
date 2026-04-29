import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const outDir =
    mode === 'es' ? 'dist-es' : mode === 'pt' ? 'dist-pt' : 'dist';

  return {
    plugins: [react()],
    build: {
      outDir,
    },
    server: {
      proxy: {
        '/api': 'http://localhost:5000',
      },
    },
  };
});
