<template>
    <v-container class="bill-container">
      <v-card outlined class="mt-15">
        <div ref="billContent">
          <v-card-title>Vendee</v-card-title>
          <v-card-subtitle>user:  {{ user ? user.name : 'Guest' }}</v-card-subtitle>
          <v-card-subtitle>Date: {{ currentDateTime  }}</v-card-subtitle>
  
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>image</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products.products" :key="product.id">
                    
                  <td>{{ product.name }}</td>
                  <td><img :src="product.image" alt="Product Image" style="width: 50px; height: 50px; object-fit: cover;"></td>
                  <td>{{ product.stock }}</td>
                  <td>{{ product.currentprice }}</td>
                  <td>{{ product.stock * product.currentprice }}</td>
                </tr>
                <tr>
                  <td>Total</td>
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
        <v-btn variant="flat" color="primary" @click="generatePDF">Download PDF</v-btn>
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
  import { useProductStore } from '~/stores/pinia';
  import Header11 from '../header11.vue';
  import { useAuthStore } from '~/stores/auth';
  
  const authStore = useAuthStore();
  const products = useProductStore();
  const billContent = ref(null);
  const user = computed(() => authStore.user);
  const currentDateTime = ref(new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }));
  
  const totalAmount = computed(() =>
    products.products.reduce((total, product) => total + (product.stock * product.currentprice), 0)
  );
  
  onMounted(async () => {
    await products.fetchProducts();
  });
  
  // Default generatePDF to a no-op function
let generatePDF = () => {};
  if (process.client) {
    const generatePDF = async () => {
      // Dynamically import jspdf and html2canvas
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
  
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
  }
  </script>
  <!-- <script setup>
import { ref, computed, onMounted } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useProductStore } from '~/stores/pinia';
import Header11 from '../header11.vue';
import { useAuthStore } from '~/stores/auth';

  const authStore = useAuthStore();
  const products = useProductStore();
  const billContent = ref(null);

  onMounted(async () => {
  await products.fetchProducts();
  
});
const totalAmount = computed(() =>
  products.products.reduce((total, product) => total + (product.stock * product.currentprice), 0)
);
// Automatically generated current date and time
const currentDateTime = ref(new Date().toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
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
  </script> -->
  
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
  
  th, td {
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
  }
  </style>