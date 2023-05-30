import './assets/main.scss';

import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';

import { useAuthStore } from './stores/authStore';

import App from '@/App.vue';
import $API from '@/plugins/axios';
import addInterceptors from '@/plugins/interceptors';
import router from '@/router';
// import { useAuthStore } from '@/store/authStore';
// import { useProfileStore } from '@/store/profileStore';

const app = createApp(App);

app.config.globalProperties.$API = $API;

app.use(ElementPlus);
app.use(createPinia());
app.use(router);
addInterceptors($API, router);

const authStore = useAuthStore();

authStore.init();

app.mount('#app');
