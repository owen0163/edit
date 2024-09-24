<template>
  <v-app>
    <v-container fluid class="fill-height pa-0">
      <v-img src="https://wallpapers.com/images/hd/hd-orange-wavelength-art-fbcwek67vdsjxlgv.jpg" class="fill-height"
        cover>
        <v-container class=" mt-50px mt-15">
          <v-row justify="center">
            <v-col cols="10" sm="5" md="3" lg="2" xl="3" v-for="product in products.products" :key="product.id">
              <v-card class="mx-auto" max-width="200">
                <div class="d-flex justify-center">
                  <v-img aspect-ratio="4/3" :height="150" :width="150" :src="product.image" contain></v-img>
                </div>
                <v-card-title>{{ product.name }}</v-card-title>
                <v-card-text>
                  <div>Product in stock: {{ product.stock }}</div>
                  <div>Current Price: {{ product.currentprice }}</div>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                  <v-btn variant="elevated" color="blue-darken-2" @click="addProduct(product.id, product.currentprice)">
                    ເພີ້ມສິນຄ້າ
                  </v-btn>
                </v-card-actions>
                <v-card-actions class="d-flex justify-center" v-if="isAdmin">
                  <v-dialog max-width="500">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn v-bind="activatorProps" color="red-darken-2" variant="elevated">
                        ລົບສິນຄ້າ
                      </v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                      <v-card title="Delete">
                        <v-card-text class="d-flex justify-center">
                          <v-col cols="12" sm="6">
                            <v-text-field v-model="deleteInput" label="Please Input [DELETE]" variant="outlined"
                              :rules="[rules.deleteproduct]">
                            </v-text-field>
                          </v-col>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn variant="elevated" text="Close" @click="isActive.value = false" color="blue-darken-3">
                            Close
                          </v-btn>
                          <v-btn variant="elevated" @click="submitForm(product.id, isActive)" color="red-darken-2">
                            ລົບສິນຄ້າ
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </v-container>
  </v-app>
  <v-container>
    <v-row>
      <v-col>
        <Header11></Header11>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useProductStore } from '~/stores/pinia';
import Header11 from '../header11.vue';
import { usePdf } from '~/stores/pdf';
import VueCookies from 'vue-cookies';

const user = ref(null);

const addPdf = usePdf();
const products = useProductStore();
const deleteInput = ref('');
const pdfCount = ref(0);

const isAdmin = ref(false);

definePageMeta({
  middleware: ['auth', 'admin'],
});


// Watch pdf count
watchEffect(() => {
  pdfCount.value = addPdf.pdf.length;
});

onMounted(async () => {
  await products.fetchProducts();
  addPdf.loadFromLocalStorage();

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

const addProduct = (id, currentprice) => {
  addPdf.add_product(id, currentprice);
};

const removeProduct = async (id) => {
  await products.removeProduct(id);
};

const submitForm = async (id, isActive) => {
  if (deleteInput.value === "DELETE") {
    await removeProduct(id);
    isActive.value = false;
    deleteInput.value = ''; // Clear the input after deletion
  } else {
    alert("Please input 'DELETE' to confirm.");
  }
};
</script>

<script>
export default {

  data() {
    return {
      rules: {
        deleteproduct: (value) => {
          if (value === "DELETE") {
            return true;
          } else {
            return 'Please input DELETE';
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
  /* Full screen height */
}
</style>