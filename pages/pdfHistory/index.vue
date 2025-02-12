<template>
    <v-app>
        <v-container fluid class="fill-height pa-0">
            <v-img
                src="https://static.vecteezy.com/ti/gratis-vektor/p1/24596331-hintergrund-design-mit-orange-farbe-geeignet-zum-4k-auflosung-vektor.jpg"
                class="fill-height" cover>

                <v-container class="bill-container">
                    <v-card outlined class="mt-15">
                        <div ref="billContent">
                            <v-card-title class="text-center">History bills</v-card-title>
                            <v-card-subtitle>UserID: {{ user.user_id || 'Unknown' }}</v-card-subtitle>
                            <v-card-subtitle>User: {{ user?.name || 'Unknown' }}</v-card-subtitle>
                            <v-card-subtitle>Date: {{ currentDateTime }}</v-card-subtitle>

                            <v-card-text>
                                <v-table>
                                    <tbody>

                                        <template v-for="(bill, index) in pdfbillPreview" :key="index">
                                            <tr class="text-center">
                                                <th class="mdi mdi-clipboard-text">Bill ID</th>
                                                <th>Date</th>
                                                <th></th>
                                                <th>User</th>
                                                <th>Amount</th>
                                            </tr>
                                            <tr>
                                                <td class="text-center">{{ bill.bill_id }}</td>
                                                <td>{{ bill.date }}</td>
                                                <td></td>
                                                <td class="text-center">{{ bill.name }}</td>
                                                <td>{{ bill.total_amount }}</td>
                                            </tr>
                                            <tr class="text-center">
                                                <th>Product ID</th>
                                                <th>Product name</th>
                                                <th></th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                            <tr v-for="product in bill.products" :key="product.id">

                                                <td class="text-center">{{ product?.product_id }}</td>
                                                <td>{{ product?.product_name }}</td>
                                                <td></td>
                                                <td class="text-center">{{ product?.quantity }}</td>
                                                <td>{{ product?.price }}</td>

                                            </tr>
                                            <v-divider vertical :thickness="8"></v-divider>
                                        </template>

                                    </tbody>
                                </v-table>
                                <!-- <v-card-text>
                        <v-row justify="space-between">
                            <v-col cols="3">
                                ຜູ້ອອກເຄື່ອງ
                            </v-col>
                            <v-col class="text-left">
                                ຜູ້ຮັບເຄື່ອງ
                            </v-col>
                        </v-row>
                    </v-card-text> -->
                            </v-card-text>
                        </div>
                    </v-card>
                    <v-card-actions class="d-flex justify-center">
                        <v-btn variant="flat" color="primary" @click="generatePDF">bill</v-btn>
                        <v-btn variant="elevated" color="red-darken-2" @click="clearPdfData">ລືບ</v-btn>
                    </v-card-actions>
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
import { ref, computed, onMounted } from 'vue';
import VueCookies from 'vue-cookies';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Header11 from '../header11.vue';
import { useRouter } from 'vue-router';
import { usePdfHistory } from '~/stores/pdfHistory';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

definePageMeta({
  middleware: 'auth'
});

const user = ref({ email: '', name: '' });
const pdfHistoryStore = usePdfHistory();
const billContent = ref(null);
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
const generatePDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const columnWidth = {
        id: 30,
        item: 80,
        quantity: 30,
        price: 30
    };
    let yPosition = margin;

    // Title and Basic User Info
    pdf.setFontSize(18);
    pdf.text('History Bills', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(`UserID: ${user.value.user_id || 'Unknown'}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`User: ${user.value.name || 'Unknown'}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Date: ${currentDateTime.value}`, margin, yPosition);
    yPosition += 10;

    // Loop over bills
    pdf.setFontSize(14);
    pdf.text('Bills:', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(12);
    pdf.setLineWidth(0.1);

    pdfbillPreview.value.forEach((bill) => {
        // Add a new page if the content overflows
        if (yPosition > 280) {
            pdf.addPage();
            yPosition = margin;
        }

        // Bill information
        pdf.text(`Bill ID: ${bill.bill_id}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Date: ${bill.date}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`User: ${bill.name}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Total Amount: ${bill.total_amount}`, margin, yPosition);
        yPosition += 10;

        // Products Table Header
        pdf.text('Products:', margin, yPosition);
        yPosition += 6;

        // Table column titles
        pdf.text('Product-ID', margin + columnWidth.id / 2, yPosition, { align: 'center' });
        pdf.text('Product-name', margin + margin + columnWidth.id + 2, yPosition);
        pdf.text('Quantity', margin + columnWidth.id + columnWidth.item + columnWidth.quantity / 2, yPosition, { align: 'center' });
        pdf.text('Price', margin + columnWidth.id + columnWidth.item + columnWidth.quantity + columnWidth.price / 2, yPosition, { align: 'center' });
        yPosition += 6;

        // Draw products of the bill
        bill.products.forEach((product) => {
            if (yPosition > 280) {
                pdf.addPage();
                yPosition = margin;
            }

            // Product ID
            pdf.text(product.product_id.toString(), margin + columnWidth.id / 2, yPosition, { align: 'center' });
            // Item
            pdf.text(product.product_name, margin + columnWidth.id + 2, yPosition); // Adjust position if necessary
            // Quantity
            pdf.text(product.quantity.toString(), margin + columnWidth.id + columnWidth.item + columnWidth.quantity / 2, yPosition, { align: 'center' });
            // Price
            pdf.text(product.price.toString(), margin + columnWidth.id + columnWidth.item + columnWidth.quantity + columnWidth.price / 2, yPosition, { align: 'center' });
            yPosition += 6;
        });

        // Add a divider after each bill
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
    });

    // Save the generated PDF
    pdf.save('bill.pdf');
};





const clearPdfData = () => {
    // Remove bills from local storage
    localStorage.removeItem('bills');

    // Clear the bills in the store
    pdfHistoryStore.bills.value = [];

    // Clear cached bills in useBillHistory if necessary
    const billHistoryStore = useBillHistory();
    billHistoryStore.billsHistory = []; // Reset the bill history

    // Optionally, you might want to fetch fresh data or reset any necessary states
    billHistoryStore.fetchBills(); // Re-fetch or reset data
    pdfHistoryStore.loadFromLocalStorage(); // Reinitialize the store

    // Show a success message
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Bills cleared successfully",
        showConfirmButton: false,
        timer: 3000
    }).then(() => {
        // Refresh the page
        window.location.reload();
    });

};
</script>
<style scoped>
.bill-container {
    width: 210mm;
    padding: 20px;
    background: #fff;
    color: #000;
}

.fill-height {
    height: 100vh;
    /* Full screen height */
}
</style>