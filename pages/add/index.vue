<template>
   
    <v-container >
        <v-row justify="center" >
            <v-col cols="13" md="8" class="mt-13">
                <v-card class="text-center mt-6">
                    <v-card-title class="text-h5">Add Product</v-card-title>
                    <v-card-text >
                        <v-form v-model="valid" ref="form" @submit.prevent="submitForm" >
                            <v-text-field v-model="product.name" label="Product Name" required
                                :rules="[rules.name]"></v-text-field>
                            <v-text-field v-model="product.defaultprice" label="Default Price" type="number" required
                                :rules="[rules.defaultPrice]"></v-text-field>
                            <v-text-field v-model="product.currentprice" label="Current Price" type="number" required
                                :rules="[rules.currentPrice]"></v-text-field>
                            <v-text-field v-model="product.stock" label="Stock" type="number" required
                                :rules="[rules.stock]"></v-text-field>
                            <v-text-field v-model="product.maxstock" label="Max Stock" type="number" required
                                :rules="[rules.maxStock]"></v-text-field>
                            <v-text-field v-model="product.image" label="Product Image URL" required
                                :rules="[rules.imageURL]"></v-text-field>

                            <v-col class="d-flex align-center justify-center">
                                <v-img :width="204" :src="product.image" alt="Product Image"
                                    v-if="product.image"></v-img>
                            </v-col>

                            <v-btn type="submit" color="primary">Add Product</v-btn>
                        </v-form>

                    </v-card-text>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '~/stores/pinia';
import Header11 from '../header11.vue';

const productStore = useProductStore();
const router = useRouter();

definePageMeta({
  middleware: 'auth'
});

const product = ref({
    name: '',
    defaultprice: 0,
    currentprice: 0,
    stock: 0,
    mapStock: 0,
    image: '',
});
const valid = ref(false);
const form = ref(null);

const submitForm = () => {
    if (valid.value) {
        addProduct();
    } else {
        form.value.validate();
    }
};

const addProduct = async () => {
    try {
        const newProduct = {
            name: product.value.name,
            defaultprice: product.value.defaultprice,
            currentprice: product.value.currentprice,
            stock: product.value.stock,
            maxstock: product.value.maxstock,
            image: product.value.image,
        };

        await productStore.addProduct(newProduct);

        product.value = {
            name: '',
            defaultprice: 0,
            currentprice: 0,
            stock: 0,
            maxstock: 0,
            image: '',
        };
        alert('Add Product successfully');
        router.push({ name: 'products' });
    } catch (error) {
        console.error('Error adding product:', error);
    }
};
</script>

<style scoped>
.v-card {
    max-width: 600px;
    margin: auto;
}
</style>

<script>
export default {
    data() {
        return {
            rules: {
                name: value => !!value || 'Please input name',
                defaultPrice: value => !!value || 'Please input default price',
                currentPrice: value => !!value || 'Please input current price',
                stock: value => !!value || 'Please input stock',
                maxStock: value => !!value || 'Please input max stock',
                imageURL: value => !!value || 'Please input image URL',
            }
        }
    }
}
</script>