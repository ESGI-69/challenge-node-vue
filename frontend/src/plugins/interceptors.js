// request interceptors
import Cookies from 'js-cookie';
// import { getActivePinia } from 'pinia';

// import { useAuthStore } from '@/store/authStore';

/**
 * @param {import('axios').AxiosInstance} axios
 * @param {import('vue-router').Router} router
 */
// export default (axios, router) => {
export default (axios) => {
  // const authStore = useAuthStore();

  axios.interceptors.request.use(
    (config) => {
      const token = Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME);
      console.log(`interceptors request token = ${token}`);
      if (token && config.noAuthToken !== true) {
        config.headers.authorization = `Bearer ${token}`;
      }

      return config;
    },
  );

  // response interceptors
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log('interceptors response error');
      if (error && error.response) {
        // The client was given an error response (5xx, 4xx)
        // if (error.response.status === 401 && authStore.isLogged) {
        //   authStore.logout(false);
        //   const query = {};
        //   if (router.currentRoute.value.meta.authRequired) {
        //     query.next = encodeURIComponent(router.currentRoute.value.path);
        //   }
        //   await router.push({ name: 'login', query }).catch((failure) => {
        //     if (!router.isNavigationFailure(failure, router.NavigationFailureType.redirected)) {
        //       throw failure;
        //     }
        //   });

        //   // Reset pinia stores
        //   getActivePinia()._s.forEach((store) => {
        //     store.$reset();
        //   });

        //   return Promise.reject(error);
        // }
        // Handle error request blob, returning json
        if (
          error.request.responseType === 'blob'
            && error.response.headers['content-type'] === 'application/json'
        ) {
          error.response.data = JSON.parse(await error.response.data.text());
          return Promise.reject(error);
        }

        if (error.response.status && error.response.data) {
          // Handle error with data
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    },
  );
};
