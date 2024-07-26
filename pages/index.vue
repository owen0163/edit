<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="13" md="6" lg="2" class=" mt-50px" v-for="product in products.products" :key="product.id"  >
        <div>
          <v-card class="mx-auto mt-50px" max-width="344">

            <v-img height="250px" :src="product.image" cover></v-img>
            <v-card-title>
              {{ product.name }}
            </v-card-title>
         
            <v-card-text>
              <div> product in stock : {{ product.stock }}</div>
              <div>currentPrice : {{ product.currentprice }}</div>
            </v-card-text>
            <v-card-actions class="d-flex justify-center"><v-btn variant="elevated" size="x-large"
                color="orange-darken-3">
                ລາຍລະອຽດ ສິນຄ້າ
              </v-btn>
            </v-card-actions>
            <v-card-actions class="d-flex justify-center" ><v-btn variant="elevated" size="x-large" @click="removeProduct(product.id)"
                color="orange-darken-3">
                ລົບ ສິນຄ້າ
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '~/stores/pinia';

const products = useProductStore()

onMounted(async () => {
  await products.fetchProducts()
  console.log(products.products)
})
const removeProduct = async (id) => {
  await products.removeProduct(id);
};
</script>