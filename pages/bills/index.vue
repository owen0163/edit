<template>
  <v-container class="bill-container">
    <v-card outlined class="mt-15">
      <div ref="billContent">
        <v-card-title class="text-center">bill</v-card-title>
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
                  <img :src="pdf.img" alt="Product Image" style="width: 50px; height: 50px; object-fit: cover;"
                    @load="onImageLoad" @error="onImageError" />
                </td>
                <td>
                  <v-text-field v-model="pdf.stock" type="number" class="ml-4" variant="plain"
                    style="max-width: 70px; font-size: 12px; padding: 0 10px;"
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
          <v-card-text>
              <v-row justify="space-between" >
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

const totalImages = ref(0);
const loadedImages = ref(0);

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

  pdfStore.loadFromLocalStorage();
  totalImages.value = pdfOrder.value.length;
});

const checkAndSaveStock = (pdf) => {
  const stock = products.products.find(product => product.id === pdf.id).stock;
  if (pdf.stock <= stock && pdf.stock >= 0) {
    pdfStore.updateProductStock(pdf.id, pdf.stock);
  } else {
    pdf.stock = stock;
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Cannot exceed stock of ${stock}`,
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

const onImageLoad = () => {
  loadedImages.value++;
  if (loadedImages.value === totalImages.value) {
    console.log('All images loaded');
  }
};

const onImageError = (event) => {
  console.error(`Image failed to load: ${event.target.src}`); // Debug log
  event.target.src = '/path/to/placeholder-image.png'; // Fallback image
  loadedImages.value++;
  if (loadedImages.value === totalImages.value) {
    console.log('All images handled (loaded or failed).');
  }
};

const generatePDF = () => {
  if (loadedImages.value < totalImages.value) {
    Swal.fire({
      position: "center",
      icon: "info",
      title: "Please wait until all images are loaded.",
      showConfirmButton: false,
      timer: 3000
    });
    return;
  }

  const element = billContent.value;
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm

  html2canvas(element, {
    useCORS: true, // Enable cross-origin for images
    allowTaint: true,
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

const postBillToDatabase = () => {
  const billData = {
    userId: user.value.user_id,
    products: pdfOrder.value.map(item => ({
      productId: item.id,
      quantity: item.stock,
      price: item.currentprice
    })),
  };

  console.log('Posting bill data:', JSON.stringify(billData, null, 2));
  billStore.postBill(billData);
};

const clearPdfData = () => {
  localStorage.removeItem('pdf');
  pdfStore.pdf.value = [];
  pdfStore.loadFromLocalStorageToClear();

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
