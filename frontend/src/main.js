import 'nes.css/css/nes.min.css';
import './assets/main.scss';

import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import { createPinia } from 'pinia';

import { useAuthStore } from './stores/authStore';

import App from '@/App.vue';
import $API from '@/plugins/axios';
import addInterceptors from '@/plugins/interceptors';
import router from '@/router';

const app = createApp(App);
for (const [ key, component ] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.config.globalProperties.$API = $API;

app.use(ElementPlus);
app.use(createPinia());
app.use(router);
addInterceptors($API, router);

const authStore = useAuthStore();

authStore.init();

app.mount('#app');

app.config.devtools = process.env.NODE_ENV === 'development';
