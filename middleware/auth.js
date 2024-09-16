// import { defineNuxtRouteMiddleware, navigateTo } from '#app';
// import { useAuthStore } from '~/stores/auth';
// import { useCookie } from '#app';

// export default defineNuxtRouteMiddleware((to, from) => {
//   const authStore = useAuthStore();
//   const tokenCookie = useCookie('user');

//   const token = authStore.token || tokenCookie.value;

//   if (!token) {
//     console.log('No token found, redirecting to login page...');
//     if (to.path !== '/' && !to.path.startsWith('/public')) {
//       return navigateTo('/'); // Redirect to login page if not authenticated and not a public route
//     }
//   } else if (!authStore.token && token) {
//     console.log('Setting token in authStore:', token);
//     authStore.setToken(token);
//   }
// });
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useCookie } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const tokenCookie = useCookie('user');

  const token = authStore.token || tokenCookie.value;

  if (!token) {
    console.log('No token found, redirecting to login page...');
    if (to.path !== '/' && !to.path.startsWith('/public')) {
      return navigateTo('/'); // Redirect to login page if not authenticated and not a public route
    }
  } else if (!authStore.token && token) {
    console.log('Setting token in authStore:', token);
    authStore.setToken(token);
  }
});