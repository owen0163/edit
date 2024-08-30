<template>
  <v-container class="bill-container">
    <v-card outlined class="mt-15">
      <div ref="billContent">
        <v-card-title>Vendee</v-card-title>
        <v-card-subtitle>UserID: {{ user.user_id || 'Unknown' }}</v-card-subtitle>
        <v-card-subtitle>User: {{ user?.name || 'Unknown' }}</v-card-subtitle>
        <v-card-subtitle>Date: {{ currentDateTime }}</v-card-subtitle>

        <v-card-text>
          <v-table>
            <thead>
              <tr class="text-center">
                <th>ID</th>
                <th>Item</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="(pdf, index) in pdfOrder" :key="index">
                <td>{{ pdf.id }}</td>
                <td>{{ pdf.name }}</td>
                <td>
                  <img :src="pdf.img" alt="Product Image" style="width: 50px; height: 50px; object-fit: cover;">
                </td>
                <td>
                  <v-text-field v-model="pdf.stock" variant="plain" class="text-center"
                    @keydown.enter="checkAndSaveStock(pdf)"></v-text-field>
                </td>
                <td>{{ pdf.currentprice }}</td>
                <td>{{ pdf.stock * pdf.currentprice }}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ totalAmount }}</td>

              </tr>
            </tbody>
          </v-table>

        </v-card-text>
      </div>
    </v-card>
    <v-card-actions class="d-flex justify-center">
      <v-btn variant="flat" color="primary" @click="generatePDFAndPostBill">bill</v-btn>
      <v-btn variant="elevated" color="red-darken-2" @click="clearPdfData">
        ລືບ
      </v-btn>
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useProductStore } from '~/stores/pinia';
import { usePdf } from '~/stores/pdf';
import { useBillStore } from '~/stores/bill';
import Header11 from '../header11.vue';
import VueCookies from 'vue-cookies';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { useRouter } from 'vue-router';

const router = useRouter();
const pdfStore = usePdf();
const products = useProductStore();
const billStore = useBillStore();
const billContent = ref(null);
const user = ref({ email: '', name: '' });

const pdfOrder = computed(() => pdfStore.pdfPreview);

onMounted(async () => {
  await products.fetchProducts();
  const userData = VueCookies.get('user');
  if (userData) {
    console.log('Raw userData from cookie:', userData);
    user.value = userData;
  } else {
    console.error('User data not found in cookies');
  }

  // Load the PDF data from localStorage
  pdfStore.loadFromLocalStorage();
});

const checkAndSaveStock = (pdf) => {
  const maxStock = products.products.find(product => product.id === pdf.id).stock;
  if (pdf.stock <= maxStock && pdf.stock >= 0) { // Ensure stock is not negative
    pdfStore.updateProductStock(pdf.id, pdf.stock); // Update the store
  } else {
    pdf.stock = maxStock; // Reset to max stock if exceeded
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Cannot exceed max stock of ${maxStock}`,
      showConfirmButton: false,
      timer: 3000
    });
  }
};

const totalAmount = computed(() =>
  pdfOrder.value.reduce((total, product) => total + (product.stock * product.currentprice), 0)
);

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
  const element = billContent.value;

  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('bill.pdf');
  });
};
const postBillToDatabase = () => {
  const billData = {
    userId: user.value.user_id, // Ensure this matches the backend's expected field
    products: pdfOrder.value.map(item => ({
      productId: item.id,
      quantity: item.stock,
      price: item.currentprice
    })),
  };

  console.log('Posting bill data:', JSON.stringify(billData, null, 2)); // Log the data to verify
  billStore.postBill(billData);
};
const clearPdfData = () => {
  // Clear PDF data from localStorage
  localStorage.removeItem('pdf');
  
  // Optionally clear the state in the Pinia store
  pdfStore.pdf.value = [];

  // Optionally, reload from localStorage if you need to ensure it's empty
  pdfStore.loadFromLocalStorageToClear();

  // Notify the user
  Swal.fire({
    position: "center",
    icon: "success",
    title: "bill cleared",
    showConfirmButton: false,
    timer: 3000
  });
};
const generatePDFAndPostBill = () => {
  generatePDF();
  postBillToDatabase();
  clearPdfData();
  router.push({ name: 'products' });
};
</script>



<style scoped>
.bill-container {
  width: 210mm;
  padding: 20px;
  background: #fff;
  color: #000;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #000;
  padding: 8px;
  text-align: left;
}
</style>
