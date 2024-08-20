<template>
  <v-parallax src="https://wallpapercave.com/wp/wp3525740.png">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <div class="text-center text-h4">Login</div>
            </v-card-title>
            <v-form v-model="formValid" ref="form">
              <v-text-field class="mr-2 ml-2" v-model="email" :rules="emailRules" label="Email" required
                type="email"></v-text-field>
              <v-text-field class="mr-2 ml-2" v-model="password" :rules="passwordRules" label="Password" type="password"
                required></v-text-field>
              <v-col class="text-center">
                <v-btn @click="submitForm" :disabled="!formValid" color="primary">
                  Login
                </v-btn>
              </v-col>
              <v-alert v-if="error" type="error">
                {{ error }}
              </v-alert>
              <v-alert v-if="successMessage" type="success">
                {{ successMessage }}
              </v-alert>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-parallax>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from '#app';
import { useAuthStore } from '~/stores/auth';

const email = ref('');
const password = ref('');
const formValid = ref(false);
const error = ref('');
const successMessage = ref('');

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid',
];

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters',
];

const authStore = useAuthStore();
const router = useRouter();

const submitForm = async () => {
  error.value = '';
  successMessage.value = '';

  try {
    await authStore.login(email.value, password.value);
    successMessage.value = 'Login successful!';
    setTimeout(() => {
      router.push('/products'); // Redirect to products page after a short delay
    }, 2000);
  } catch (err) {
    error.value = 'Login failed. Please check your credentials.';
  }
};
</script>
