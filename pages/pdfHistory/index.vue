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
                                <td>{{ bill.bill_id }}</td>
                                <td>{{ bill.date }}</td>
                                <td></td>
                                <td>{{ bill.name }}</td>
                                <td>{{ bill.total_amount  }}</td>
                            </tr>
                                <tr class="text-center">
                                <th>Product ID</th>
                                <th>Item</th>
                                <th></th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                                <tr  v-for="product in bill.products" :key="product.id">
                                 
                                        <td>{{ product?.product_id }}</td>
                                        <td>{{ product?.product_name }}</td>
                                        <td></td>
                                        <td>{{ product?.quantity }}</td>
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
  const element = billContent.value;  // The element to convert to PDF
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm

  html2canvas(element, {
    useCORS: true, // Enable cross-origin for images (optional, can be removed if not needed)
    allowTaint: true, // Allow cross-origin images to be loaded (optional, can be removed if not needed)
    logging: true,
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0; // Initial Y position for the image

    // Add pages if needed
    while (position < imgHeight) {
      pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);

      // Add a new page if more content remains
      if (position + pageHeight < imgHeight) {
        pdf.addPage();
      }

      position += pageHeight; // Move to the next page
    }

    pdf.save('bill.pdf');
  }).catch((error) => {
    console.error('Error generating PDF:', error);
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Failed to generate PDF.",
      showConfirmButton: false,
      timer: 3000
    });
  });
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
    });
};
</script>
