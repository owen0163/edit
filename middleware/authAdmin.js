// middleware/authAdmin.js
export default defineNuxtRouteMiddleware((to, from) => {
    const cookies = useCookie('user');

    const user = cookies.value;
  
    // Check if the user is not an admin, redirect them away
    if (!user || user.role !== 'admin') {
      return navigateTo('/');
    }
  });