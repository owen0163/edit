<template>
    <v-container class="bill-container">
        <v-card outlined class="mt-15">
            <div ref="billContent">
                <v-card-title class="text-center">History bills</v-card-title>
                <v-card-subtitle>UserID: {{ user.user_id || 'Unknown' }}</v-card-subtitle>
                <v-card-subtitle>User: {{ user?.name || 'Unknown' }}</v-card-subtitle>
                <v-card-subtitle>Date: {{ currentDateTime }}</v-card-subtitle>

                <v-card-text>
                    <v-table>
                        <thead>
                            <tr class="text-center">
                                <th>Bill ID</th>
                                <th>User</th>
                                <th></th>
                                <th>Date</th>
                                <th></th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(bill, index) in pdfbillPreview" :key="index">
                                <td>{{ bill.bill_id }}</td>
                                <td>{{ bill.name }}</td>
                                <td></td>
                                <td>{{ bill.date }}</td>
                                <td>{{ bill.amount }}</td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr class="text-center">
                                <th>Product ID</th>
                                <th>Item</th>
                                <th></th>
                                <th>Quantity</th>
                                <th></th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>

                                <td>

                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </v-table>
                    <v-card-text>
                        <v-row justify="space-between">
                            <v-col cols="3">
                                ຜູ້ອອກເຄື່ອງ
                            </v-col>

                            <v-col class="text-left">
                                ຜູ້ຮັບເຄື່ອງ
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card-text>
            </div>
        </v-card>
        <v-card-actions class="d-flex justify-center">
            <!-- <v-btn variant="flat" color="primary" @click="generatePDFAndPostBill">bill</v-btn>
        <v-btn variant="elevated" color="red-darken-2" @click="clearPdfData">
          ລືບ
        </v-btn> -->
        </v-card-actions>
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
import { ref, computed, onMounted } from 'vue';
import VueCookies from 'vue-cookies';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Header11 from '../header11.vue';
import { useRouter } from 'vue-router';
import { usePdfHistory } from '~/stores/pdfHistory';

const user = ref({ email: '', name: '' });
const pdfHistoryStore = usePdfHistory();

const pdfbillPreview = computed(() => pdfHistoryStore.pdfbillPreview);

onMounted(async () => {
    const userData = VueCookies.get('user');
    if (userData) {
        console.log('Raw userData from cookie:', userData);
        user.value = userData;
    } else {
        console.error('User data not found in cookies');
    }

    // Load bills from local storage
    pdfHistoryStore.loadFromLocalStorage();

    // Fetch bills from the API
    const billHistoryStore = useBillHistory();
    await billHistoryStore.fetchBills();
});

const currentDateTime = ref(new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
}));
</script>