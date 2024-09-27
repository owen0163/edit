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
          password,
        }, {
          withCredentials: true // Ensure cookies are included in requests
        });

        this.token = response.data.token;
        const user = {
          user_id: response.data.user.user_id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role
        };
        const nuxtApp = useNuxtApp();
        const $cookies = nuxtApp.$cookies;

        if ($cookies) {
          $cookies.set('token', this.token, { path: '/', expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
          $cookies.set('user', user, { path: '/', expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
          console.log('Token and user set in cookies:', this.token, user); // Debugging
        } else {
          throw new Error('Cookies are not available');
        }

        this.user = user; // Store user details in the state
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get('http://localhost:3300/api/users', {
          // headers: { 'Authorization': `Bearer ${this.token}` }, // Use this if your API requires the token
          withCredentials: true,
        });
        console.log('user data', response.data);
        this.user = response.data; // Ensure this includes user_id
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    async register(email, password, name, role) {
      try {
        const response = await axios.post('http://localhost:3300/api/register', {
          email,
          password,
          name,
          role,
        });
        // Handle response and store user data
        this.user = response.data;
        this.token = response.data.token; // Assuming the token is returned
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    setToken({ email, name, role, user_id }) {
      this.token = { email, name, role, user_id }; // Adjust based on actual usage
    },
    logout() {
      const { $cookies } = useNuxtApp();
      $cookies.remove('token', { path: '/' });
      $cookies.remove('user', { path: '/' });
      this.token = null;
      this.user = null;
    },
    isAuthenticated() {
      return !!this.token; // Simple check for token presence
    },
  },
});
