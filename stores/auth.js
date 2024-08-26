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
    // async login(email, password) {
    //   try {
    //     const response = await axios.post('http://localhost:3300/api/login', {
    //       email,
    //       password,
    //     });

    //     this.token = response.data.token;

    //     // Ensure useNuxtApp() is used in a proper Nuxt.js context
    //     const { $cookies } = useNuxtApp();

    //     if ($cookies) {
    //       $cookies.set('token', this.token, { path: '/' });
    //     } else {
    //       throw new Error('Cookies are not available');
    //     }

    //     this.user = response.data.user;
    //   } catch (error) {
    //     console.error('Login failed:', error);
    //     throw error;
    //   }
    // },
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:3300/api/login', {
          email,
          password,
        });
    
        this.token = response.data.token;
    
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
    async fetchUser() {
      try {
        // Access cookies using useNuxtApp
        const { $cookies } = useNuxtApp();
        
        // Retrieve token from cookies
        this.token = $cookies.get('token');
    
        // Check if the token is available
        if (!this.token) {
          throw new Error('Token is not available in cookies');
        }
    
        // Make a GET request to fetch the user data
        const response = await axios.get('http://localhost:3300/api/users', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
    
        // Store the fetched user data in your component's data or state
        this.user = {
          email: response.data.email,
          name: response.data.name,
        };
    
      } catch (error) {
        // Handle any errors that occur during the fetch process
        console.error('Fetching user failed:', error);
        throw error;
      }
    },
  //   async fetchUser() {
  //     try {
  //       const { data, error } = await axios.get('http://localhost:3300/users', {
  //         headers: {
  //           'Authorization': `Bearer ${this.authToken}`
  //         },
  //       });

  //       if (error) {
  //         throw new Error(error);
  //       }

  //       this.user = data.value.user;
  //     } catch (err) {
  //       console.error('Failed to fetch user:', err);
  //     }
  //   },
    setToken(token) {
      this.authToken = token;
    },
    logout() {
      const { $cookies } = useNuxtApp();
      $cookies.remove('token', { path: '/' });
      this.token = null;
      this.user = null;
    },
    loadTokenFromCookies() {
      const { $cookies } = useNuxtApp();
      this.token = $cookies.get('token');
    },
  },
});

// import { defineStore } from 'pinia';
// import { useNuxtApp } from '#app';
// import axios from 'axios';

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     token: null,
//     user: null,
//   }),
//   actions: {
//     async login(email, password) {
//       try {
//         const response = await axios.post('http://localhost:3300/api/login', {
//           email, 
//           password
//         });
        
//         this.token = response.data.token;

//         // Ensure useNuxtApp() is used in a proper Nuxt.js context
//         const { $cookies } = useNuxtApp();

//         if ($cookies) {
//           $cookies.set('token', this.token, { path: '/' });
//         } else {
//           throw new Error('Cookies are not available');
//         }

//         this.user = response.data.user;
//       } catch (error) {
//         console.error('Login failed:', error);
//         throw error;
//       }
//     },
//     // logout() {
//     //   this.token = null;
//     //   this.user = null;

//     //   const { $cookies } = useNuxtApp();

//     //   if ($cookies) {
//     //     $cookies.remove('token');
//     //   } else {
//     //     console.error('Cookies are not available during logout');
//     //   }
//     // },
//   },
// });