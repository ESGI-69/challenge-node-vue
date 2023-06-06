import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import child_process from 'child_process';

console.log('hash gen');
try {
  process.env.VITE_GIT_HASH = child_process
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();
  console.log('hash gen', process.env.VITE_GIT_HASH);
} catch (err) {
  process.env.VITE_GIT_HASH = '';
  console.log(err);
  console.log('no hash');
}

let env = '';
Object.keys(process.env).forEach(async (key) => {
  env += `${key} = ${JSON.stringify(process.env[key])}; - ;`;
});
console.log(env);

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
