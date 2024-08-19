<template>
  <v-card>
    <v-layout>
      <v-app-bar color="orange-darken-3" prominent>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>
          <v-btn href="/">Vendee</v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="text-center">
          <v-menu v-model="menu" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn color="grey-lighten-5" v-bind="props">
                Profile
              </v-btn>
            </template>
            <v-card min-width="300">
              <v-list>
                <v-list-item :title="authStore.user?.email" subtitle="Email"></v-list-item>
                <v-list-item :title="authStore.user?.name" subtitle="Name"></v-list-item>
              </v-list>
              <v-divider></v-divider>

              <v-list>
                <v-list-item>
                  <!-- Additional menu items can be added here -->
                </v-list-item>
              </v-list>

              <v-card-actions>
                <v-col class="text-center">
                  <v-btn color="primary" variant="text" @click="handleLogout">
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
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router'; // Ensure this is imported
import VueCookies from 'vue-cookies'; // Import vue-cookies

const token = ref(null);
const authStore = useAuthStore();
const router = useRouter(); // Initialize router
const menu = ref(false);
const drawer = ref(false);

onMounted(async () => {
  try {
    await authStore.fetchUser();
    token.value = VueCookies.get('token');
  console.log('Token from cookies:', token.value);
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    menu.value = false; // Close the menu on logout
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
    search: '',

    fav: true,
    menu: false,
    message: false,
    hints: true,
  }),

  watch: {
    group() {
      this.drawer = false
    },
  },
}
</script>