import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/stores/authStore';

const isNotLogged = (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.token) {
    return next();
  }
  if (to.query.next) {
    return next(decodeURIComponent(to.query.next));
  }
  return next({ name: 'home' });
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        displayName: 'Home',
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
        displayName: 'About',
        authRequired: true,
      },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/Auth.vue'),
      redirect: { name: 'login' },
      beforeEnter: isNotLogged,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue'),
          meta: {
            displayName: 'Login',
          },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/Register.vue'),
          meta: {
            displayName: 'Register',
          },
        },
      ],
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
