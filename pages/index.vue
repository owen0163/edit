<template>
 <v-app>
        <v-container fluid class="fill-height pa-0">
            <v-img src="https://static.vecteezy.com/ti/gratis-vektor/p1/24596331-hintergrund-design-mit-orange-farbe-geeignet-zum-4k-auflosung-vektor.jpg" class="fill-height" cover>
      <v-container >
        <v-card>
      <v-row >
        <v-col cols="6">
          <v-img src="https://img.freepik.com/premium-photo/vector-art-about-machine-technology_975572-4577.jpg"></v-img>
          </v-col>
          <v-col cols="6" class="d-flex align-center justify-center" style="max-width: 500px">
          <v-card class="w-100" >
            <v-card-title>
              <div class="text-center text-h4" style="color: #E65100;">Login</div>
            </v-card-title>
            <v-form v-model="formValid" ref="form" class="mt-10">
              <v-text-field class="mr-2 ml-2 " v-model="email" :rules="emailRules" label="Email" required
                type="email"></v-text-field>
              <v-text-field class="mr-2 ml-2" v-model="password" :rules="passwordRules" label="Password" type="password"
                required></v-text-field>
              <v-col class="text-center">
                <v-btn @click="submitForm" :disabled="!formValid" color="orange-darken-4">
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
    </v-card>
    </v-container>
  </v-img>
        </v-container>
    </v-app>
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
  v => /.+@.+\..+/.test(v) || 'Please input Email',
];

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Please input Password ',
];

const authStore = useAuthStore();
const router = useRouter();

const submitForm = async () => {
  error.value = '';
  successMessage.value = '';

  try {
    await authStore.login(email.value, password.value);
    successMessage.value = 'Login successful!';

    // Add a delay of 3000ms (3 seconds) before redirecting
    setTimeout(() => {
      router.push('/products');
    }, 3000);
    
  } catch (err) {
    error.value = 'Login failed. Please check Email or password';
  }
};

</script>


<style scoped>
.fill-height {
  height: 100vh; /* Full screen height */
}
</style>