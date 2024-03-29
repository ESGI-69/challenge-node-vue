import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import child_process from 'child_process';

if (!process.env.VITE_LAST_COMMIT || process.env.VITE_LAST_COMMIT === '') {
  try {
    process.env.VITE_LAST_COMMIT = child_process
      .execSync('git rev-parse --short HEAD')
      .toString()
      .trim();
  } catch (err) {
    process.env.VITE_LAST_COMMIT = '';
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode !== 'production') {
    return {
      envDir: '../',
      server: {
        port: 8080,
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
