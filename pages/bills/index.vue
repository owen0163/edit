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
//////////////////////////////////////////////////////////////////////////
const generatePDF = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Title Section
  pdf.setFont('helvetica');
  pdf.setFontSize(18);
  pdf.text('Bill', 10, 10);

  // Partner Info Section
  pdf.setFontSize(12);
  pdf.text(`User ID: ${user.value.user_id || 'Unknown'}`, 10, 20);
  pdf.text(`User: ${user.value.name || 'Unknown'}`, 10, 26);
  pdf.text(`Date: ${currentDateTime.value}`, 10, 32);

  // Table Headers
  const headers = [['ID', 'Item', 'Image', 'Quantity', 'Price', 'Amount']];

  // Map the pdfOrder data to rows in the table
  const rows = pdfOrder.value.map((product) => [
    product.id,
    product.name,
    { content: '', styles: { minCellHeight: 20 } }, // Placeholder for image
    product.stock,
    product.currentprice.toFixed(2),
    (product.stock * product.currentprice).toFixed(2),
  ]);

  // Calculate total amount
  const totalAmount = pdfOrder.value.reduce(
    (total, product) => total + product.stock * product.currentprice,
    0
  );

  // Add a total row at the end of the table
  rows.push([
    '', // Empty for ID
    '', // Empty for Item
    '', // Empty for Image
    '', // Empty for Quantity
    'Total', // Label "Total" under Price column
    totalAmount.toFixed(2), // Total amount under Amount column
  ]);

  // Generate the table with autoTable
  autoTable(pdf, {
    startY: 40, // Start below the user info
    head: headers,
    body: rows,
    didDrawCell: (data) => {
      // Prevent rendering the image in the header and for the total row
      if (data.row.section === 'body' && data.column.index === 2 && data.row.index !== rows.length - 1 && pdfOrder.value[data.row.index]?.img) {
        pdf.addImage(
          pdfOrder.value[data.row.index].img, 
          'JPEG',
          data.cell.x + 2, 
          data.cell.y + 2, 
          16, 16
        ); // Drawing image in the cell
      }
    },
    headStyles: {
      fillColor: [0, 128, 255], // Header background color (e.g., blue)
      textColor: [255, 255, 255], // Header text color (e.g., white)
      fontStyle: 'bold', // Bold font in header
    },
    // Add styling for the table
    styles: {
      fontSize: 10, // Global font size
      halign: 'center', // Center align text in all cells
      valign: 'middle', // Vertical align text
      lineColor: [0, 0, 0], // Border color
      lineWidth: 0.5, // Border thickness
      minCellHeight: 10, // Cell height
      textColor: [0, 0, 0], // Text color
    },
    // Customize specific columns (optional)
    columnStyles: {
      0: { halign: 'center' }, // ID column center aligned
      1: { halign: 'left' }, // Item column left aligned
      2: { halign: 'center' }, // Image placeholder centered
      3: { halign: 'center' }, // Quantity center aligned
      4: { halign: 'right' }, // Price right aligned
      5: { halign: 'right' }, // Amount right aligned
    },
    // Add table border
    tableLineColor: [0, 0, 0], // Border color for table
    tableLineWidth: 0.5, // Border width for table
  });

  // Save the PDF
  pdf.save('bill.pdf');
};

// const generatePDF = () => {
//   const pdf = new jsPDF('p', 'mm', 'a4');
  
//   // Title Section
//   pdf.setFont('helvetica', );
//   pdf.setFontSize(18);
//   pdf.text('Bill ', 10, 10);

//   // Partner Info Section
//   pdf.setFontSize(12);
//   pdf.text(`User ID: ${user.value.user_id || 'Unknown'}`, 10, 20);
//   pdf.text(`User: ${user.value.name || 'Unknown'}`, 10, 26);
//   pdf.text(`Date: ${currentDateTime.value}`, 10, 32);

//   // Table Headers
//   const headers = [['ID', 'Item', 'Image', 'Quantity', 'Price', 'Amount']];

//   // Map the pdfOrder data to rows in the table
//   const rows = pdfOrder.value.map((product) => [
//     product.id,
//     product.name,
//     { content: '', styles: { minCellHeight: 20 } }, // Placeholder for image
//     product.stock,
//     product.currentprice.toFixed(2),
//     (product.stock * product.currentprice).toFixed(2),
//   ]);

//   // Calculate total amount
//   const totalAmount = pdfOrder.value.reduce(
//     (total, product) => total + product.stock * product.currentprice,
//     0
//   );

//   // Add a total row at the end of the table
//   rows.push([
//     '', // Empty for ID
//     '', // Empty for Item
//     '', // Empty for Image
//     '', // Empty for Quantity
//     'Total', // Label "Total" under Price column
//     totalAmount.toFixed(2), // Total amount under Amount column
//   ]);

//   // Generate the table with autoTable
//   autoTable(pdf, {
//     startY: 40, // Start below the user info
//     head: headers,
//     body: rows,
//     didDrawCell: (data) => {
//       // Prevent rendering the image in the header
//       if (data.row.section === 'body' && data.column.index === 2 && pdfOrder.value[data.row.index]?.img) {
//         pdf.addImage(
//           pdfOrder.value[data.row.index].img, 
//           'JPEG',
//           data.cell.x + 2, 
//           data.cell.y + 2, 
//           16, 16
//         ); // Drawing image in the cell
//       }
//     },
//     // Add styling for the table
//     styles: {
//       fontSize: 10, // Global font size
//       halign: 'center', // Center align text in all cells
//       valign: 'middle', // Vertical align text
//       lineColor: [0, 0, 0], // Border color
//       lineWidth: 0.5, // Border thickness
//       minCellHeight: 10, // Cell height
//       // textColor: [0, 0, 0], // Text color
//     },
//     // Customize specific columns (optional)
//     columnStyles: {
//       0: { halign: 'center' }, // ID column center aligned
//       1: { halign: 'left' }, // Item column left aligned
//       2: { halign: 'center' }, // Image placeholder centered
//       3: { halign: 'center' }, // Quantity center aligned
//       4: { halign: 'right' }, // Price right aligned
//       5: { halign: 'right' }, // Amount right aligned
//     },
//     // Add table border
//     tableLineColor: [0, 0, 0], // Border color for table
//     tableLineWidth: 0.5, // Border width for table
//   });



//   // Save the PDF
//   pdf.save('bill.pdf');
// };
///////////////////////////////////////////////////////////////////////////
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