<template>
  <v-card>
    <v-layout>
      <v-app-bar color="orange-darken-3" prominent>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>
          <v-btn href="/products">Vendee</v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="text-center">
          <v-menu v-model="menu" :close-on-content-click="false">
            <template v-slot:activator="{ props }" class="mr-4">
              <v-btn color="grey-lighten-5" v-bind="props" >
                <v-icon size="25px" class="mdi mdi-account-box mr-1"></v-icon>
               {{ user.name }}
              </v-btn>
            </template>
            <v-card min-width="300">
              <v-list v-if="user">
                <v-list-item>
                  <v-list-item-title>
                    <v-icon size="25px" class="mdi mdi-email"></v-icon>
                    {{ user.email }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-icon size="25px" class="mdi mdi-account"></v-icon>
                    {{ user.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>

              <v-list>
                <v-list-item>
                  

                </v-list-item>
              </v-list>

              <v-card-actions>
                <v-col class="text-center">
                  <v-btn color="primary" variant="outlined" @click="handleLogout">
                    <v-icon size="25px" class="mdi mdi-account-arrow-right"></v-icon>
                    Logout
                  </v-btn>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
        <v-list>
          <v-list-item href="/products">ຂໍ້ມູນສິນຄ້າ</v-list-item>
          <v-list-item href="/add">ເພີ້ມມູນສິນຄ້າ</v-list-item>
          <v-list-item href="/about">ຈັດການຂໍ້ມູນສິນຄ້າ</v-list-item>
          <v-list-item href="/pdf">pdf</v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router'; // Ensure this is imported
import VueCookies from 'vue-cookies';

const token = ref(null);
const user = ref({ email: '', name: '' });
const authStore = useAuthStore();
const router = useRouter(); // Initialize router
const menu = ref(false);
const drawer = ref(false);

onMounted(async () => {
  const userData = VueCookies.get('user');
  if (userData) {
    console.log('Raw userData from cookie:', userData);
    user.value = userData;
  } else {
    console.error('User data not found in cookies');
  }
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    menu.value = false; // Close the menu on logout
    VueCookies.remove('token', { path: '/' });
    VueCookies.remove('user', { path: '/' });
    router.push('/');  // Redirect to home or login page
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
}
</script>