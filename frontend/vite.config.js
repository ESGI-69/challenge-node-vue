import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import child_process from 'child_process';

try {
  process.env.VITE_GIT_HASH = child_process
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();
} catch (_) {
  process.env.VITE_GIT_HASH = '';
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>{
  if (mode !== 'production') {
    return {
      envDir: '../',
      server: {
        port: 8080,
        proxy: {
          '^/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
      preview: {
        proxy: {
          '^/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
      plugins: [ vue() ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    };
  }
  return {
    plugins: [ vue() ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
