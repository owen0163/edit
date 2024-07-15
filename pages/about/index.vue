<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="13" md="6" lg="2" v-for="product in products.products" :key="product.id">
        <div>
          <v-card>

            <v-img height="300px" :src="product.image" cover></v-img>
            <v-card-title>
              {{ product.name }}

            </v-card-title>

            <v-card-text>
              <div> product in stock : {{ product.stock }}</div>
              <div>currentPrice : {{ product.currentPrice }}</div>

            </v-card-text>
            <v-card-actions>
              <v-dialog max-width="1200">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn @click="openDialog(product.id)" variant="elevated" size="x-large" color="orange-darken-3" block
                    v-bind="activatorProps">
                    ຈັດການຂໍ້ມູນສິນຄ້າ
                  </v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card title="Edit Slot 01">
                    <v-divider :thickness="3"></v-divider>

                    <v-row justify="center">
                      <v-col cols="13" md="6" lg="4" v-if="selectedProduct" :key="index">

                        <v-img height="300px" :src="selectedProduct.image" cover></v-img>
                        <div class="text-center"> {{ selectedProduct.name }}</div>
                        <div class="text-center"> Price : {{ selectedProduct.currentPrice }}</div>
                        <div class="text-center"> Qty : {{ selectedProduct.stock }}</div>

                      </v-col>
                    </v-row>
                    <v-row justify="center">
                  <v-col cols="20" md="6" class="justify-center align-center">
                    <v-select label="Select a product" :items="products.products"   item-value="id"
                      v-model="selectedProductId" @change="updateSelectedProduct" variant="underlined"></v-select>
                    </v-col>
                  </v-row>
                    <v-spacer></v-spacer>
                    <v-container v-if="selectedProduct">
                      <v-form v-model="valid">
                        <v-row justify="center">
                          <v-col cols="13" md="5">

                            <p>default Price</p>
                            <v-text-field width="450" variant="outlined">
                              {{ selectedProduct.defaultPrice }}
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" md="5">
                            <p>Current Price</p>
                            <v-text-field v-model="selectedProduct.currentPrice" width="450"
                              variant="outlined"></v-text-field>
                          </v-col>
                          <v-col cols="12" md="5">
                            <p>Stock</p>
                            <v-text-field v-model="selectedProduct.stock" width="450" variant="outlined"></v-text-field>
                          </v-col>
                          <v-col cols="12" md="5">
                            <p>Max Stock</p>
                            <v-text-field v-model="selectedProduct.maxStock" width="450"
                              variant="outlined"></v-text-field>


                          </v-col>
                        </v-row>


                      </v-form>
                    </v-container>

                    <v-card-actions>


                      <v-spacer></v-spacer>
                      <v-btn @click="updateProductDetails(selectedProduct.id, selectedProduct)">Update</v-btn>
                      <v-btn text="Close " @click="isActive.value = false"></v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>

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

const valid = ref(true);
const products = useProductStore();
const selectedProduct = ref(null);
const selectedProductId = ref(null);

onMounted(async () => {
  await products.fetchProducts();

  
});

const openDialog = async (productId) => {
  try {
    await products.fetchProductById(productId);
    selectedProduct.value = products.product;
  } catch (error) {
    console.error('Error fetching product:', error);
  }
};
const updateSelectedProduct = () => {
  selectedProduct.value = products.products.find(product => product.id === selectedProductId.value) || null;
};

watch(selectedProductId, updateSelectedProduct);

const updateProductDetails = async (productId, updatedProduct) => {
  try {
    await products.updateProduct(productId, updatedProduct);
    alert('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
  }
};
</script>
