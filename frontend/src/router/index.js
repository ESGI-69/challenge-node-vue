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
      component: () => import('@/views/Home.vue'),
      meta: {
        displayName: 'Home',
        authRequired: true,
      },
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('@/views/MyCards.vue'),
      meta: {
        displayName: 'Cards',
        authRequired: true,
      },
    },
    {
      path: '/packs',
      name: 'packs',
      component: () => import('@/views/Packs.vue'),
      meta: {
        displayName: 'Packs',
        authRequired: true,
      },
    },
    {
      path:'/profile',
      name:'edit-profile',
      component: () => import('@/views/EditProfile.vue'),
      meta: {
        displayName: 'Edit Profile',
        authRequired: true,
      },
    },
    {
      path: '/lobby/:id',
      name: 'lobby',
      component: () => import('@/views/Lobby.vue'),
      meta: {
        displayName: 'Lobby',
        authRequired: true,
      },
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('@/views/Join.vue'),
      meta: {
        displayName: 'Join',
        authRequired: true,
      },
    },
    {
      path: '/game/:id',
      name: 'game',
      component: () => import('@/views/Game.vue'),
      meta: {
        displayName: 'Game',
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
        {
          path: 'confirm',
          name: 'confirm',
          component: () => import('@/views/auth/Confirm.vue'),
          meta: {
            displayName: 'Confirm',
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
