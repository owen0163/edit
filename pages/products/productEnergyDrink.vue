<!-- energy drink -->

<template>
    <v-container fluid>
      <v-row class="pa-4" dense>
        <v-col v-for="product in productenergydrink" :key="product.id" cols="12" sm="6" md="4" lg="3">
          <v-card class="mx-auto" max-width="200">
            <div class="d-flex justify-center">
              <v-img aspect-ratio="4/3" :height="150" :width="150" :src="product.image" contain></v-img>
            </div>
            <v-card-title>{{ product.name }}</v-card-title>
            <v-card-text>
              <div>Type: {{ product.type }}</div>
              <div>Product in stock: {{ product.stock }}</div>
              <div>Current Price: {{ product.currentprice }}</div>
            </v-card-text>
            <v-card-actions class="d-flex justify-center noto-serif-lao">
              <v-btn variant="elevated" color="blue-darken-2" @click="addProduct(product.id, product.currentprice)">
                ເພີ້ມສິນຄ້າ
              </v-btn>
            </v-card-actions>
            <v-card-actions class="d-flex justify-center noto-serif-lao" v-if="isAdmin">
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
                      <v-btn variant="elevated" @click="submitForm(product.id, isActive)" color="red-darken-2" class="noto-serif-lao">
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
  </template>
  
<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { useProductStore } from '~/stores/pinia';
import { usePdf } from '~/stores/pdf';
import VueCookies from 'vue-cookies';

const user = ref(null);
const addPdf = usePdf();
const products = useProductStore();
const deleteInput = ref('');
const pdfCount = ref(0);
const isAdmin = ref(false);
const selectedProduct = ref(null);

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
        if (user.value.role === 'admin') {
            isAdmin.value = true;
        }
    } else {
        console.error('User data not found in cookies');
    }
});

// Define a computed property to filter products by type
const productenergydrink = computed(() => {
    return products.products.filter(product => product.type === 'energydrink');
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
                deleteproduct: (value) => value === "DELETE" || 'Please input DELETE',
            },
        };
    },
};
</script>

<style scoped>
.fill-height {
    height: 100vh;
    /* Full screen height */
}
</style>