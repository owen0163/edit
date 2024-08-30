<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="2"  v-for="product in products.products" :key="product.id">
        <v-card class="mx-auto mt-50px mt-15" max-width="300">
            <div class="d-flex justify-center">
              <v-col lg="12">
            <v-img :height="200" :width="200" :src="product.image" cover></v-img>
          </v-col>
          </div>
          <v-card-title>{{ product.name }}</v-card-title>

          <v-card-text>
            <div>Product in stock: {{ product.stock }}</div>
            <div>Current Price: {{ product.currentprice }}</div>
          </v-card-text>

          <v-card-actions class="d-flex justify-center">
            <v-btn variant="elevated" color="blue-darken-2"
              @click="addPdf.add_product(product.id, product.currentprice)">
              ເພີ້ມສິນຄ້າ
            </v-btn>
          </v-card-actions>

          <v-card-actions class="d-flex justify-center">
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

  <v-container>
    <v-row>
      <v-col>
        <Header11></Header11>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '~/stores/pinia';
import Header11 from '../header11.vue';
import { usePdf } from '~/stores/pdf';

const addPdf = usePdf();
const products = useProductStore();
const deleteInput = ref('');

onMounted(async () => {
  await products.fetchProducts();
  addPdf.loadFromLocalStorage();
  console.log(products.products);
});

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