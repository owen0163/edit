<template>
  <v-parallax src="https://wallpapers.com/images/hd/hd-orange-wavelength-art-fbcwek67vdsjxlgv.jpg">
    <v-container class="mt-15">
      <v-row justify="center">
        <v-col cols="8" sm="9" md="8" lg="6" xl="10">
          <v-card>
            <v-card-title class="text-center text-orange-darken-3">Register</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="registerUser" class="mr-2 ml-2">
                <v-text-field label="Email" v-model="email" :rules="emailRules" type="email" required></v-text-field>
                <v-text-field label="Name" v-model="name" :rules="nameRules" required></v-text-field>
                <v-text-field label="Password" v-model="password" :rules="passwordRules" type="password" required></v-text-field>
                <v-select label="Role" v-model="role" :items="roles" :rules="roleRules" required></v-select>
                <v-row>
                  <v-col class="d-flex justify-center">
                    <v-btn type="submit" color="orange-darken-3" variant="flat">Register</v-btn>
                  </v-col>
                </v-row>
                <v-alert v-if="error" type="error">{{ error }}</v-alert>
                <v-alert v-if="successMessage" type="success">
                  {{ successMessage }}
                </v-alert>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-parallax>
  <!-- ///////////////////////////////////////////////////////////////////////////////// -->
  <v-container>
    <v-row>
      <v-col>
        <Header11></Header11>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import Header11 from '../header11.vue';
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const name = ref('');
const role = ref('');
const roles = ['user', 'admin'];
const error = ref(null);
const successMessage = ref('');

const emailRules = [
  v => !!v || 'Please input Email',
  v => /.+@.+\..+/.test(v) || 'Please input Email',
];
const passwordRules = [
  v => !!v || 'Please input Password',
  v => v.length >= 6 || 'Please input Password ',
];
const nameRules = [
  v=> !!v || 'Please input name',
];
const roleRules = [
  v=> !!v || 'Please input select Role',
];


const registerUser = async () => {

  error.value = '';
  successMessage.value = '';
  try {
    await authStore.register(email.value, password.value, name.value, role.value);
    successMessage.value = 'register successful!';
    error.value = null; // Clear error if successful
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error === 'Email already exists') {
      error.value = 'Email is already registered. Please use a different email.';
    } else {
      error.value = 'Registration failed. Please try again.';
    }
  }
};


</script>