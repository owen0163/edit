// https://nuxt.com/docs/api/configuration/nuxt-config
// nuxt.config.js
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/global.css'],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+Lao:wght@100..900&display=swap'
        }
      ]
    }
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      vuetify({ autoImport: true }),
    ],
  },

  plugins: [
    { src: '~/plugins/cookie.js', mode: 'client' }, // Include other plugins as needed
  ],

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    public: {
      jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    },
  },
});


// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// export default defineNuxtConfig({
//   compatibilityDate: '2024-04-03',
//   devtools: { enabled: true },

// //..
// // nuxt.config.js

// vite: {
//   vue: {
//     template: {
//       transformAssetUrls,
//     },
//   },
//   plugins: [
//     vuetify({ autoImport: true }),
//   ],
// },
// plugins: [
//   { src: '~/plugins/cookie.js', mode: 'client' }, // Include other plugins as needed
//   // You can add other plugins here if necessary
// ],

//   //...
//   build: {
//     transpile: ['vuetify'],
//   },
//   modules: [
//     (_options, nuxt) => {
//       nuxt.hooks.hook('vite:extendConfig', (config) => {
//         // @ts-expect-error
//         config.plugins.push(vuetify({ autoImport: true }))
//       })
//     },
//      '@pinia/nuxt',
//   ],

//   runtimeConfig: {
//     public: {
//       jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
//     },
//   },
  
// })


