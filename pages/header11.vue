<template>
  <v-card>
    <v-layout>
      <v-app-bar color="orange-darken-2" prominent :elevation="9">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>
          <v-btn href="/products">Vendee</v-btn>

          <v-btn class="text-none" stacked href="/bills">
            <v-badge color="error" :content="pdfCount">
              <v-icon size="default">mdi-cart</v-icon>
            </v-badge>
          </v-btn>


        </v-toolbar-title>

        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
        <div class="mr-2">
          <v-menu min-width="200px" rounded>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-avatar v-if="user && user.name" color="orange-darken-1" size="large">
                  <span class="text-subtitle-1">{{ user.name }}</span>
                </v-avatar>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <div class="mx-auto text-center">
                  <v-avatar color="orange-darken-1">
                    <span>{{ user.name }}</span>
                  </v-avatar>
                  <h3>{{ user.name }}</h3>
                  <p class="text-caption mt-1">
                    {{ user.email }}
                  </p>
                  <v-divider class="my-3"></v-divider>
                  <v-btn variant="text" rounded>
                    Edit Account
                  </v-btn>
                  <v-divider class="my-3"></v-divider>
                  <v-btn variant="text" rounded @click="handleLogout">
                    <v-icon size="25px" class="mdi mdi-account-arrow-right"></v-icon>
                    Disconnect
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
        <!-- //////////////////////////////////////////////////////////////////////////////////// -->
      </v-app-bar >
      <v-navigation-drawer v-model="drawer" location="left" temporary class="bg-grey-lighten-4">
        <v-list class="noto-serif-lao">
          <v-list-item href="/products" class="text-deep-orange-darken-3 mdi mdi-cube">ສິນຄ້າ</v-list-item>
          <v-list-item href="/productall" class="text-deep-orange-darken-3 mdi mdi-book-open">ຂໍ້ມູນສິນຄ້າ</v-list-item>

          <!-- Only show these items if the user is an admin -->
          <v-list-item v-if="isAdmin" href="/add"
            class="text-deep-orange-darken-3 mdi mdi-forklift">ເພີ້ມມູນສິນຄ້າ</v-list-item>
          <v-list-item v-if="isAdmin" href="/about"
            class="text-deep-orange-darken-3 mdi mdi-pen">ຈັດການຂໍ້ມູນສິນຄ້າ</v-list-item>
            <v-list-item v-if="isAdmin" href="/register" class="text-deep-orange-darken-3 mdi mdi-account">ສະໝັກ User</v-list-item>

          <v-list-item href="/bills" class="text-deep-orange-darken-3 mdi mdi-printer">ໃບບິນ</v-list-item>
          <v-list-item href="/history"
            class="text-deep-orange-darken-3 mdi mdi-clipboard-text">ປະຫວັດໃບບິນ</v-list-item>
          <v-list-item href="/historyBill"
            class="text-deep-orange-darken-3 mdi mdi-file-document">ປະຫວັດໃບບິນແບບເລືອກ</v-list-item>
          <v-list-item href="/pdfHistory"
            class="text-deep-orange-darken-3 mdi mdi-file-multiple">ປິ້ນປະຫວັດໃບບິນ</v-list-item>
          <v-list-item href="/partner" class="text-deep-orange-darken-3 mdi mdi-printer">ປະຫວັດ</v-list-item>
          <v-list-item href="/date" class="text-deep-orange-darken-3 mdi mdi-printer">date</v-list-item>

        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
import { usePdf } from '~/stores/pdf';

const token = ref(null);
// const user = ref({ email: '', name: '', role: '' });
const user = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const menu = ref(false);
const drawer = ref(false);
const pdfStore = usePdf();
const pdfCount = ref(0);

const isAdmin = ref(false);

// Watch effect to update pdfCount on client side
watchEffect(() => {
  pdfCount.value = pdfStore.pdf.length;
});

onMounted(async () => {
  const userData = VueCookies.get('user');
  if (userData) {
    user.value = userData;
    // isAdmin.value = user.value.role === 'admin';
    if (user.value.role === 'admin') {
      isAdmin.value = true;
    }
  } else {
    console.error('User data not found in cookies');
  }
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    menu.value = false;
    VueCookies.remove('token', { path: '/' });
    VueCookies.remove('user', { path: '/' });
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    menu: false,
    message: false,

  }),

  watch: {
    group() {
      this.drawer = false
    },
  },
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  vuetify: {
    breakpoint: {
      thresholds: {
        xs: 600,
        sm: 960,
        md: 1280,
        lg: 1920,
        xl: 2560,
      },
      scrollBarWidth: 24,
    },
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Lao:wght@100..900&display=swap');

.noto-serif-lao {
  font-family: "Noto Serif Lao", serif;
  font-weight: 500; /* Adjust this value based on your requirement */
  font-style: normal;
  font-variation-settings:
    "wdth" 84.9;
}
</style>