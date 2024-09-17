<template>
 <v-app>
        <v-container fluid class="fill-height pa-0">
            <v-img src="https://wallpapers.com/images/hd/hd-orange-wavelength-art-fbcwek67vdsjxlgv.jpg" class="fill-height" cover>
    <v-container class="mt-12" >
        <v-row justify="center">
            <v-col cols="9"  sm="10"  >
                <v-card title="Products" flat>
                    <template v-slot:text>
                        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify"
                            variant="outlined" hide-details single-line></v-text-field>
                    </template>

                    <!-- Display products in v-data-table -->
                    <v-data-table :headers="headers" :items="filteredProducts" :search="search">
                        <!-- Custom slot to display product image -->
                        <template v-slot:item.image="{ item }">
                            <v-img :src="item.image || '/images/fallback-image.jpg'" max-width="75"
                                max-height="75"></v-img>
                        </template>
                    </v-data-table>
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
import { useProductStore } from '~/stores/pinia';  // Adjust path based on your file structure
import Header11 from '../header11.vue';
import { computed, onMounted } from 'vue';

// Initialize Pinia store
const productStore = useProductStore();

definePageMeta({
  middleware: 'auth'
});

// Search state
const search = ref('');

// Data table headers
const headers = [
{ align: 'start', key: 'id', sortable: true, title: 'Product ID' },
    { align: 'start', key: 'name', sortable: true, title: 'Product Name' },
    { align: 'center', key: 'image', title: 'Image', sortable: false },
    { align: 'start', key: 'stock', title: 'Stock' },
    { align: 'start', key: 'maxstock', title: 'max Stock' },
    { align: 'start',key: 'defaultprice', title: 'default Price' },
    { align: 'start', key: 'currentprice', title: 'current Price' },

   
];

// Fetch products on component mount
onMounted(async () => {
    await productStore.fetchProducts();
    console.log(productStore.products);
});

// Computed property to filter products based on search
const filteredProducts = computed(() => {
    if (!search.value) return productStore.products;

    return productStore.products.filter((product) =>
        product.name.toLowerCase().includes(search.value.toLowerCase())
    );
});
</script>
