<template>
    <v-app>
        <v-container fluid class="fill-height pa-0">
            <v-img
                src="https://static.vecteezy.com/ti/gratis-vektor/p1/24596331-hintergrund-design-mit-orange-farbe-geeignet-zum-4k-auflosung-vektor.jpg"
                class="fill-height" cover>
                <v-container>
                    <v-row>
                        <v-col cols="3" class="mt-13">
                            <v-card class=" mt-6">
                                <v-carousel show-arrows="hover" cycle hide-delimiter-background interval="5000">
                                    <v-carousel-item
                                        src="https://asset-cdn.campaignbrief.com/wp-content/uploads/2020/01/29102158/COCOOS3737_Share-A-Coke_Alexa_1080x1920px.jpg"
                                        cover></v-carousel-item>

                                    <v-carousel-item
                                        src="https://cdn.dribbble.com/users/249838/screenshots/5652978/pepsi.png"
                                        cover></v-carousel-item>

                                    <v-carousel-item
                                        src="https://ukzd365prdstr.blob.core.windows.net/images/786/772/4206bedf-d8bc-4525-b990-9e9ba4c6c3e3/Cosmos_Mobile_Design.png"
                                        cover></v-carousel-item>
                                </v-carousel>
                            </v-card>
                        </v-col>
                        <v-col cols="10" md="6" class="mt-13">
                            <v-card class="text-center mt-6">
                                <v-card-title class="text-h5">Add Product</v-card-title>
                                <v-card-text>
                                    <v-form v-model="valid" ref="form" @submit.prevent="submitForm">
                                        <v-text-field v-model="product.name" label="Product Name" required
                                            :rules="[rules.name]"></v-text-field>
                                        <v-text-field v-model="product.defaultprice" label="Default Price" type="number"
                                            required :rules="[rules.defaultPrice]"></v-text-field>
                                        <v-text-field v-model="product.currentprice" label="Current Price" type="number"
                                            required :rules="[rules.currentPrice]"></v-text-field>
                                        <v-text-field v-model="product.stock" label="Stock" type="number" required
                                            :rules="[rules.stock]"></v-text-field>
                                        <v-text-field v-model="product.maxstock" label="Max Stock" type="number"
                                            required :rules="[rules.maxStock]"></v-text-field>
                                        <!-- ///////////////////////////////////////////////// -->
                                        <v-select v-model="product.type" :items="type" :rules="[rules.type]"
                                            label="type" required></v-select>
                                        <!-- ///////////////////////////////////////////////// -->
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
                        <v-col cols="3" class="mt-13">
                            <v-card class=" mt-6">
                                <v-carousel show-arrows="hover" cycle hide-delimiter-background interval="5000">
                                    <v-carousel-item
                                        src="https://asset-cdn.campaignbrief.com/wp-content/uploads/2020/01/29102158/COCOOS3737_Share-A-Coke_Alexa_1080x1920px.jpg"
                                        cover></v-carousel-item>

                                    <v-carousel-item
                                        src="https://cdn.dribbble.com/users/249838/screenshots/5652978/pepsi.png"
                                        cover></v-carousel-item>

                                    <v-carousel-item
                                        src="https://ukzd365prdstr.blob.core.windows.net/images/786/772/4206bedf-d8bc-4525-b990-9e9ba4c6c3e3/Cosmos_Mobile_Design.png"
                                        cover></v-carousel-item>
                                </v-carousel>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '~/stores/pinia';
import Header11 from '../header11.vue';

const productStore = useProductStore();
const router = useRouter();

definePageMeta({
    middleware: 'auth',
    middleware: 'admin'
});


const product = ref({
    name: '',
    defaultprice: 0,
    currentprice: 0,
    stock: 0,
    mapStock: 0,
    type: '',
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
            type: product.value.type,
            image: product.value.image,
        };

        await productStore.addProduct(newProduct);

        product.value = {
            name: '',
            defaultprice: 0,
            currentprice: 0,
            stock: 0,
            maxstock: 0,
            type: '',
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
                type: value => !!value || 'Please select type',
            },
            select: null,
            type: [
                'chips',
                'beer',
                'energydrink',
                'soda',
                'milk',
            ],
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