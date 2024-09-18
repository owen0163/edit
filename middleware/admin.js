// middleware/admin.js
import { useCookie, useRouter } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  const userCookie = useCookie('user');
  const user = userCookie.value;

  if (to.path === '/about' || to.path === '/add') {
    if (!user || user.role !== 'admin') {
      return navigateTo('/403'); // Redirect to a 403 Forbidden page
    }
  }
});