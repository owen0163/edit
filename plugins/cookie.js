import Cookies from 'cookie-universal';

export default defineNuxtPlugin((nuxtApp) => {
  const cookies = Cookies();

  nuxtApp.provide('cookies', cookies);

  
});