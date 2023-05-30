import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME);
  if (to.meta.authRequired && !token) {
    return next({ name: 'login' });
  }
  return next();
});

export default router;
