import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:3300/api/login', {
          email, 
          password
        });
        
        this.token = response.data.token;

        // Ensure useNuxtApp() is used in a proper Nuxt.js context
        const { $cookies } = useNuxtApp();

        if ($cookies) {
          $cookies.set('token', this.token, { path: '/' });
        } else {
          throw new Error('Cookies are not available');
        }

        this.user = response.data.user;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    // logout() {
    //   this.token = null;
    //   this.user = null;

    //   const { $cookies } = useNuxtApp();

    //   if ($cookies) {
    //     $cookies.remove('token');
    //   } else {
    //     console.error('Cookies are not available during logout');
    //   }
    // },
  },
});