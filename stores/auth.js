import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    authToken: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:3300/api/login', {
          email,
          password,
        }, {
          withCredentials: true // Ensure cookies are included in requests
        });
    
        this.token = response.data.token;
    
        // const { $cookies } = useNuxtApp();
        const nuxtApp = useNuxtApp();  // Access Nuxt app instance
        const $cookies = nuxtApp.$cookies;
    
        if ($cookies) {
          // $cookies.set('token', this.token, { path: '/' });
          $cookies.set('token', this.token, { path: '/', expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
          console.log('Token set in cookies:', this.token); // Debugging
        } else {
          throw new Error('Cookies are not available');
        }
    
        this.user = response.data.user;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
  
    },
    async fetchUser() {
      try {
        const response = await axios.get('http://localhost:3300/api/users', {
          // headers: { 'Authorization': `Bearer ${this.token}` },
          withCredentials: true,
        });
          console.log('user data', response.data)
        // this.user = response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },

    setToken(token) {
      this.token = token;
    },
    logout() {
      const { $cookies } = useNuxtApp();
      $cookies.remove('token', { path: '/' });
      this.token = null;
      this.user = null;
    },
    
  },
});