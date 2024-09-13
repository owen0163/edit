<template>
    <v-app>
        <v-container fluid class="fill-height pa-0">
            <v-img src="https://wallpapers.com/images/hd/hd-orange-wavelength-art-fbcwek67vdsjxlgv.jpg" class="fill-height" cover>
  <v-container>
    <v-row justify="center">
      <v-col cols="13" md="6" lg="2" v-for="product in products.products" :key="product.id">
        <div>
          <v-card class="mt-15">
            <div class="d-flex justify-center">
              <v-col lg="12">
            <v-img :height="200" :width="200" :src="product.image" cover></v-img>
          </v-col>
          </div>
            <v-card-title>
              {{ product.name }}

            </v-card-title>

            <v-card-text>
              <div> product in stock : {{ product.stock }}</div>
              <div>currentPrice : {{ product.currentprice }}</div>

            </v-card-text>
            <v-card-actions>
              <v-dialog max-width="1200">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn @click="openDialog(product.id)" variant="elevated" color="orange-darken-3" block
                    v-bind="activatorProps">
                    ຈັດການຂໍ້ມູນສິນຄ້າ
                  </v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card>
                    <v-card-title class="mt-3">
                      <div>Edit Slot {{ selectedProductId }}</div>
                    </v-card-title>
                    <v-divider :thickness="3"></v-divider>

                    <v-row justify="center" class="mt-2">
                      <v-col cols="13" md="6" lg="6" v-if="selectedProduct" :key="index">

                        <div class="d-flex justify-center">
                            <v-col lg="4">
                          <v-img :height="200" :width="200" :src="selectedProduct.image" cover></v-img>
                        </v-col>
                        </div>
                        <div class="text-center"> {{ selectedProduct.name }}</div>
                        <div class="text-center"> Price : {{ selectedProduct.currentprice }}</div>
                        <div class="text-center"> Qty : {{ selectedProduct.stock }}</div>

                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col md="9" class="justify-center ">

                        <v-autocomplete label="Products" :items="products.products" item-value="id" item-title="name"
                          v-model="selectedProductId" @change="updateSelectedProduct" variant="underlined">
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-spacer></v-spacer>
                    <v-container v-if="selectedProduct">
                      <v-form v-model="valid">
                        <v-row justify="center">
                          <v-col cols="13" md="5">
                            <v-text-field label="Default Price" width="450" variant="outlined"
                              :model-value="selectedProduct.defaultprice" disabled> </v-text-field>
                          </v-col>

                          <v-col cols="12" md="5">


                            <v-text-field label="Current Price" v-model="selectedProduct.currentprice" width="450"
                              variant="outlined" :rules="[rules.currentPrice]"></v-text-field>
                          </v-col>
                          <v-col cols="12" md="5">

                            <v-text-field label="Stock" v-model="selectedProduct.stock" width="450" variant="outlined"
                              :rules="[rules.requiredStock, (value) => rules.stockRule(value, selectedProduct.maxstock)]"></v-text-field>
                          </v-col>
                          <v-col cols="12" md="5">

                            <v-text-field label="Max Stock" v-model="selectedProduct.maxstock" width="450"
                              variant="outlined" :rules="[rules.maxStock]"></v-text-field>


                          </v-col>

                        </v-row>


                      </v-form>

                      <v-divider :thickness="3"></v-divider>
                    </v-container>

                    <v-card-actions>


                      <!--<v-btn
                        @click="updateProductDetails(selectedProduct.id, selectedProduct), isActive.value = false">Update
                      </v-btn> -->
                      <v-btn @click="submitForm(isActive)">Update</v-btn>
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
import { ref, onMounted } from 'vue';
import { useProductStore } from '~/stores/pinia';
import Header11 from '../header11.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const valid = ref(true);
const products = useProductStore();
const selectedProduct = ref(null);
const selectedProductId = ref(null);

definePageMeta({
  middleware: 'auth'
});

onMounted(async () => {
  await products.fetchProducts();


});

const submitForm = (isActive) => {
  const form = ref(null);
  if (valid.value) {
    updateProductDetails(selectedProduct.value.id, selectedProduct.value);
    alert_Edit_Success();
    isActive.value = false;
  } else {
    form.value.validate();
  }
};
const alert_Edit_Success= ()=>{
          Swal.fire({
          position: "center",
          icon: "success",
          title: "ແກ້ໄຂສິນຄ້າສຳເລັດ",
          showConfirmButton: false,
          timer: 3000
        });
        }

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
  
  } catch (error) {
    console.error('Error updating product:', error);
  }
};


</script>

<script>
export default {
  data() {
    return {

      rules: {
        currentPrice: value => !!value || 'Please iput Price',
        maxStock: value => !!value || 'Please iput MaxStock',
        requiredStock: value => !!value || 'Please iput MaxStock',
        stockRule: (value, maxStock) => {

          if (value > maxStock) {
            return 'Stock cannot exceed max stock'
          }

          return true

        }
      }
    }
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh; /* Full screen height */
}
</style>