<template>
    <v-app>
        <v-container fluid class="fill-height pa-0">
            <v-img
                src="https://static.vecteezy.com/ti/gratis-vektor/p1/24596331-hintergrund-design-mit-orange-farbe-geeignet-zum-4k-auflosung-vektor.jpg"
                class="fill-height" cover>
                <v-container class="mt-15">
                    <v-row justify="center">
                        <v-col cols="3">
                            <v-card>
                                <v-card-item>
                                    <v-autocomplete label="Select Bill" :items="billOptions" item-value="id"
                                        item-title="display_name" v-model="selectedBillId" @change="onBillChange"
                                        variant="underlined"></v-autocomplete>
                                </v-card-item>
                                <v-card-actions>
                                    <v-row justify="center" class="w-100">
                                        <v-col cols="auto">
                                            <div class="text-center">
                                                <v-btn variant="elevated" color="blue-accent-3" @click="fetchBillData">
                                                    Fetch Data
                                                </v-btn>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-card-actions>
                            </v-card>
                            <v-card class="mt-5">



                            </v-card>
                        </v-col>
                        <v-col cols="8">
                            <!-- Display bill details in a new v-card -->
                            <v-card v-if="currentBill" class="pa-4">
                                <v-card-title>
                                    <span class="headline">Bill Details</span>
                                </v-card-title>
                                <v-card-subtitle>
                                    <div><strong>Bill ID:</strong> {{ currentBill.bill_id }}</div>
                                    <div><strong>User Name:</strong> {{ currentBill.username }}</div>
                                    <div><strong>Bill Date:</strong> {{ currentBill.bill_date }}</div>
                                    <div><strong>Total Amount:</strong> {{ currentBill.total_amount }}</div>
                                </v-card-subtitle>
                                <v-data-table :headers="productHeaders" :items="currentBill.products"
                                    item-key="product_id">
                                    <!-- Define columns for products -->
                                    <template v-slot:item="{ item }">
                                        <tr>
                                            <td>{{ item.product_name }}</td>
                                            <td>{{ item.quantity }}</td>
                                            <td>{{ item.price }}</td>
                                            <td>{{ item.product_defaultprice }}</td>
                                            <td>{{ item.product_currentprice }}</td>
                                        </tr>
                                    </template>

                                </v-data-table>
                                <v-card-actions class="d-flex justify-center">

                                    <v-btn variant="elevated" color="blue-accent-3"
                                        @click="addbills(currentBill.bill_id, currentBill.username, currentBill.bill_date, currentBill.total_amount, currentBill.products)">
                                        Add
                                    </v-btn>

                                </v-card-actions>
                            </v-card>
                            <v-card v-else class="pa-4 text-center">
                                <v-card-title>No Bill Selected</v-card-title>
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
import Header11 from '../header11.vue';
import { ref, onMounted } from 'vue';
import { useBillHistory } from '~/stores/useBillHistory';
import { usePdfHistory } from '~/stores/pdfHistory';
const pdfHistoryStore = usePdfHistory();

definePageMeta({
    middleware: 'auth'
});

// Initialize Pinia store
const billHistoryStore = useBillHistory();

// State variables
const selectedBillId = ref(null);
const currentBill = ref(null);
const billOptions = ref([]);
// Fetch bills and bill details on component mount
onMounted(async () => {
    await billHistoryStore.fetchBills();
    billOptions.value = billHistoryStore.getBillOptions();
    console.log('Bill Options:', billOptions.value);
});

const fetchBillData = async () => {
    if (selectedBillId.value) {
        await billHistoryStore.fetchBillById(selectedBillId.value);
        currentBill.value = billHistoryStore.currentBill;
        console.log('Fetched Bill Data:', currentBill.value);
    }
};
const onBillChange = async (id) => {
    if (id) {
        await billHistoryStore.fetchBillById(id);
        currentBill.value = billHistoryStore.currentBill;
    }
};
const addbills = (bill_id, username, bill_date, total_amount, products) => {
    if (currentBill.value) {
        pdfHistoryStore.add_bill(currentBill.value.bill_id, currentBill.value.username, currentBill.value.bill_date, currentBill.value.total_amount, currentBill.value.products);
    } else {
        console.error('No current bill selected');
    }
};
// Access store state
// const billOptions = billHistoryStore.getBillOptions();
const productHeaders = [
    { key: 'product_name', title: 'Product Name' },
    { key: 'quantity', title: 'Quantity' },
    { key: 'price', title: 'Price' },
    { key: 'product_defaultprice', title: 'Default Price' },
    { key: 'product_currentprice', title: 'Current Price' },
];
</script>