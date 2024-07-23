<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card class="text-center">
                    <v-card-title class="text-h5">Add Product</v-card-title>
                    <v-card-text >
                        <v-form v-model="valid" ref="form" @submit.prevent="submitForm" >
                            <v-text-field v-model="product.name" label="Product Name" required
                                :rules="[rules.name]"></v-text-field>
                            <v-text-field v-model="product.defaultPrice" label="Default Price" type="number" required
                                :rules="[rules.defaultPrice]"></v-text-field>
                            <v-text-field v-model="product.currentPrice" label="Current Price" type="number" required
                                :rules="[rules.currentPrice]"></v-text-field>
                            <v-text-field v-model="product.stock" label="Stock" type="number" required
                                :rules="[rules.stock]"></v-text-field>
                            <v-text-field v-model="product.maxStock" label="Max Stock" type="number" required
                                :rules="[rules.maxStock]"></v-text-field>
                            <v-text-field v-model="product.imageURL" label="Product Image URL" required
                                :rules="[rules.imageURL]"></v-text-field>

                            <v-col class="d-flex align-center justify-center">
                                <v-img :width="204" :src="product.imageURL" alt="Product Image"
                                    v-if="product.imageURL"></v-img>
                            </v-col>

                            <v-btn type="submit" color="primary">Add Product</v-btn>
                        </v-form>

                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useProductStore } from '~/stores/pinia';

const productStore = useProductStore();

const product = ref({
    name: '',
    defaultPrice: 0,
    currentPrice: 0,
    stock: 0,
    maxStock: 0,
    imageURL: '',
});
const valid = ref(false);

const submitForm = () => {
    const form = ref(null);
    if (valid.value) {
        addProduct(product.value);
    } else {
        form.value.validate();
    }
};

const addProduct = async () => {
    try {
        const newProduct = {
            name: product.value.name,
            defaultPrice: product.value.defaultPrice,
            currentPrice: product.value.currentPrice,
            stock: product.value.stock,
            maxStock: product.value.maxStock,
            imageURL: product.value.imageURL,
        };

        await productStore.addProduct(newProduct);

        product.value = {
            name: '',
            defaultPrice: 0,
            currentPrice: 0,
            stock: 0,
            maxStock: 0,
            imageURL: '',
        };
        alert('Add Product successfully');
        router.push({ name: 'pages' });
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
                name: value => !!value || 'Please iput name',
                defaultPrice: value => !!value || 'Please iput defaultPrice',
                currentPrice: value => !!value || 'Please iput currentPrice',
                stock: value => !!value || 'Please iput stock',
                maxStock: value => !!value || 'Please iput MaxStock',
                imageURL: value => !!value || 'Please iput imageURL',
            }
        }
    }
}
</script>