<template>
  <v-app>
    <v-container fluid class="fill-height pa-0">
      <v-img
        src="https://static.vecteezy.com/ti/gratis-vektor/p1/24596331-hintergrund-design-mit-orange-farbe-geeignet-zum-4k-auflosung-vektor.jpg"
        class="fill-height" cover>
        <v-container class="bill-container">
          <v-card outlined class="mt-15">
            <div ref="billContent">
              <v-card-title class="text-center">bill</v-card-title>
              <v-card-subtitle>UserID: {{ user?.user_id || 'Unknown' }}</v-card-subtitle>
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
            <v-btn variant="flat" color="primary" @click="generatePDFAndPostBill">bill</v-btn>
          
            <v-btn variant="elevated" color="red-darken-2" @click="clearPdfData">
              ລືບ
            </v-btn>
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useProductStore } from '~/stores/pinia';
import { usePdf } from '~/stores/pdf';
import { useBillStore } from '~/stores/bill';
import Header11 from '../header11.vue';
import VueCookies from 'vue-cookies';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth'
});


const router = useRouter();
const pdfStore = usePdf();
const products = useProductStore();
const billStore = useBillStore();
const billContent = ref(null);
const user = ref({ user_id: 'Unknown', name: 'Unknown' });
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
console.log('User data:', user.value);
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

// const onImageError = (event) => {
//   console.error(`Image failed to load: ${event.target.src}`); // Debug log
//   event.target.src = '/path/to/placeholder-image.png'; // Fallback image
//   loadedImages.value++;
//   if (loadedImages.value === totalImages.value) {
//     console.log('All images handled (loaded or failed).');
//   }
// };
const toBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle cross-origin images
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg'); // Convert to Base64
      resolve(dataURL);
    };
    img.onerror = reject;
    img.src = url;
  });
};
/////////////////////////////////////////////////////////////////////////////////
// const generatePDF = () => {
//   const pdf = new jsPDF('p', 'mm', 'a4');
//   const margin = 10;
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();
//   let yPosition = margin;

//   // Title
//   pdf.setFontSize(22);
//   pdf.setTextColor(40, 40, 40);
//   pdf.text('Bill', pageWidth / 2, yPosition, { align: 'center' });
//   yPosition += 15;

//   // User Info
//   pdf.setFontSize(12);
//   pdf.setTextColor(80, 80, 80);
//   pdf.text(`UserID: ${user.value.user_id || 'Unknown'}`, margin, yPosition);
//   yPosition += 6;
//   pdf.text(`User: ${user.value.name || 'Unknown'}`, margin, yPosition);
//   yPosition += 6;
//   pdf.text(`Date: ${currentDateTime.value}`, margin, yPosition);
//   yPosition += 10;

//   // Table Headers
//   pdf.setFontSize(12);
//   const cellHeight = 15;
//   const cellWidth = [20, 70, 25, 20, 20, 40];
//   const headers = ['ID', 'Item', 'Image', 'Quantity', 'Price', 'Amount'];

//   let xPosition = margin;

//   // Draw table header with background
//   pdf.setFillColor(220, 220, 220);
//   pdf.rect(margin, yPosition, pageWidth - 2 * margin, cellHeight, 'F'); // Fill header background
//   pdf.setTextColor(0);
//   headers.forEach((header, index) => {
//     pdf.text(header, xPosition + 2, yPosition + 7);
//     pdf.rect(xPosition, yPosition, cellWidth[index], cellHeight);
//     xPosition += cellWidth[index];
//   });

//   yPosition += cellHeight;

//   // Draw table data
//   pdfOrder.value.forEach((pdfItem, index) => {
//     if (yPosition + cellHeight > pageHeight - margin) {
//       pdf.addPage();
//       yPosition = margin;
//     }

//     xPosition = margin;

//     // Draw alternating row colors
//     if (index % 2 === 0) {
//       pdf.setFillColor(240, 240, 240);
//       pdf.rect(margin, yPosition, pageWidth - 2 * margin, cellHeight, 'F');
//     }

//     pdf.setTextColor(40, 40, 40);
//     pdf.text(pdfItem.id.toString(), xPosition + 10, yPosition + 8, { align: 'center' });
//     pdf.rect(xPosition, yPosition, cellWidth[0], cellHeight);
//     xPosition += cellWidth[0];

//     pdf.text(pdfItem.name, xPosition + 2, yPosition + 8);
//     pdf.rect(xPosition, yPosition, cellWidth[1], cellHeight);
//     xPosition += cellWidth[1];

//     if (pdfItem.img) {
//       const imgWidth = 12;
//       const imgHeight = 12;
//       const xCentered = xPosition + (cellWidth[2] - imgWidth) / 2;
//       pdf.addImage(pdfItem.img, 'JPEG', xCentered, yPosition + 2, imgWidth, imgHeight);
//     }
//     pdf.rect(xPosition, yPosition, cellWidth[2], cellHeight);
//     xPosition += cellWidth[2];

//     pdf.text(pdfItem.stock.toString(), xPosition + cellWidth[3] / 2, yPosition + 8, { align: 'center' });
//     pdf.rect(xPosition, yPosition, cellWidth[3], cellHeight);
//     xPosition += cellWidth[3];

//     pdf.text(pdfItem.currentprice.toString(), xPosition + cellWidth[3] / 2, yPosition + 8, { align: 'center' });
//     pdf.rect(xPosition, yPosition, cellWidth[3], cellHeight);
//     xPosition += cellWidth[3];

//     const amount = (pdfItem.stock * pdfItem.currentprice).toString();
//     pdf.text(amount, xPosition + 2, yPosition + 8);
//     pdf.rect(xPosition, yPosition, cellWidth[5], cellHeight);

//     yPosition += cellHeight;
//   });

//   // Total row
//   if (yPosition + cellHeight > pageHeight - margin) {
//     pdf.addPage();
//     yPosition = margin;
//   }

//   xPosition = margin;

//   for (let i = 0; i < 5; i++) {
//     pdf.rect(xPosition, yPosition, cellWidth[i], cellHeight);
//     xPosition += cellWidth[i];
//   }

//   pdf.text('Total', xPosition + 16 - cellWidth[5], yPosition + 8);
//   pdf.text(totalAmount.value.toString(), xPosition + 2, yPosition + 8);
//   pdf.rect(xPosition, yPosition, cellWidth[5], cellHeight);

//   // Save the generated PDF
//   pdf.save('bill.pdf');
// };
const generatePDF = async () => {
  // Convert image URLs to Base64 if not already in Base64
  const base64Promises = pdfOrder.value.map(async (item) => {
    if (item.img && !item.img.startsWith('data:')) {
      try {
        item.img = await toBase64(item.img);  // Convert image to Base64
      } catch (err) {
        console.error('Image conversion error:', err);
        item.img = '';  // Fallback in case of error
      }
    }
  });

  // Ensure all images are converted before generating the PDF
  await Promise.all(base64Promises);

  // Start generating the PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = margin;

  // Title
  pdf.setFontSize(22);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Bill', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // User Info
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text(`UserID: ${user.value.user_id || 'Unknown'}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`User: ${user.value.name || 'Unknown'}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Date: ${currentDateTime.value}`, margin, yPosition);
  yPosition += 10;

  // Define the headers and body for the table
  const headers = [['ID', 'Item', 'Image', 'Quantity', 'Price', 'Amount']];
  const body = pdfOrder.value.map((pdfItem) => [
    pdfItem.id.toString(),
    pdfItem.name,
    '',  // Placeholder for the image
    pdfItem.stock.toString(),
    pdfItem.currentprice.toString(),
    (pdfItem.stock * pdfItem.currentprice).toString(),
  ]);

  // Define any summary or total rows
  const summaryRows = [
    ['', '', '', '', 'Total', totalAmount.value.toString()],
  ];

  const fullTableBody = [...body, ...summaryRows];

  // Use autoTable to generate the table
  autoTable(pdf, {
    startY: yPosition,
    head: headers,
    body: fullTableBody,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      halign: 'center',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [209, 206, 206],  // Light gray background for the headers
      textColor: [0, 0, 0],        // Black text
      halign: 'center',
    },
    bodyStyles: {
      lineWidth: 0.1,
      textColor: [0, 0, 0],
    },
    tableLineColor: [23, 13, 13], // Black border color
    tableLineWidth: 0.1,
    didDrawCell: function (data) {
      // Draw images inside the third column
      if (data.column.index === 2 && pdfOrder.value[data.row.index]?.img) {
        const img = pdfOrder.value[data.row.index].img;
        const cell = data.cell;
        const imageX = cell.x + (cell.width - 12) / 2;  // Center the image in the cell
        const imageY = cell.y + (cell.height - 12) / 2;  // Center the image in the cell
        pdf.addImage(img, 'JPEG', imageX, imageY, 12, 12);  // Adjust size as needed
      }
    },
  });

  // Save the generated PDF
  pdf.save('bill.pdf');
};



//////////////////////////////////////////////////////////////////////////////
// const postBillToDatabase = () => {
//   const billData = {
//   userId: user.value.user_id,
//   products: pdfOrder.value.map(item => ({
//     productId: item.id,
//     quantity: item.stock,
//     price: item.currentprice
//   })),
// };

//   console.log('Posting bill data:', JSON.stringify(billData, null, 2));
//   billStore.postBill(billData);
// };
const postBillToDatabase = async () => {
  const billData = {
    userId: user.value.user_id,
    products: pdfOrder.value.map(item => ({
      productId: item.id,
      quantity: item.stock,
      price: item.currentprice
    })),
  };

  try {
    console.log('Posting bill data:', JSON.stringify(billData, null, 2));
    await billStore.postBill(billData); // Ensure `postBill` returns a promise
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Bill posted successfully",
      showConfirmButton: false,
      timer: 3000
    });
  } catch (error) {
    console.error('Failed to post bill:', error);
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Failed to post bill: ${error.message}`,
      showConfirmButton: false,
      timer: 3000
    });
  }
};
/////////////////////////////////////////////////////////////////////////////
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

.fill-height {
  height: 100vh;
  /* Full screen height */
}
</style>