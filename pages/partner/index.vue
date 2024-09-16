<template>
  <v-app>
    <v-container fluid class="fill-height pa-0">
      <v-img
        src="https://static.vecteezy.com/ti/gratis-vektor/p1/24596331-hintergrund-design-mit-orange-farbe-geeignet-zum-4k-auflosung-vektor.jpg"
        class="fill-height" cover>
        <v-container>
          <v-row>
            <v-col cols="10" md="3">
              <v-card class="mt-15" max-width="350">
                <v-card-title>
                  <!-- Autocomplete for selecting a partner -->
                  <v-autocomplete label="Partner" :items="store.partners" item-value="partner_id"
                    item-title="partner_name" v-model="selectedPartnerId" @change="onPartnerChange"
                    variant="underlined"></v-autocomplete>
                </v-card-title>
                <v-card-text>
                  <!-- Start Date selection -->

                  <!-- <v-select label="Start Date" :items="dateOptions" v-model="startDate" max-width="400" /> -->
                  <v-text-field v-model="startDate" label="Start Date" clearable type="date" solo
                    style="max-width: 400px"></v-text-field>
                  <!-- End Date selection -->
                  <!-- <v-select label="End Date" :items="dateOptions" v-model="endDate" max-width="400" /> -->
                  <v-text-field v-model="endDate" label="End Date" clearable type="date" solo style="max-width: 400px"
                    :min="startDate"></v-text-field>

                </v-card-text>

                <v-card-actions>
                  <v-row justify="center" class="w-100">
                    <v-col cols="auto">
                      <div class="text-center">
                        <v-btn variant="elevated" color="blue-accent-3" @click="fetchData">
                          Fetch Data
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
              <v-card-actions>
                <v-row justify="center" class="mt-3">
                  <v-col cols="auto">
                    <div class="text-center">
                      <v-btn variant="elevated" color="blue-darken-1" @click="generatePDF">
                        print pdf
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <div class="text-center">
                      <v-btn variant="elevated" color="red" @click="clearLocalStorage">
                        Clear
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-col>
            <v-col cols="12" md="9">
              <v-card class="mt-15">
                <div>
                  <v-row>
                    <v-col cols="3">
                      <v-card-title>Partner Report</v-card-title>
                      <v-card-subtitle>No: {{ partnerInfoRef.partner_id }}</v-card-subtitle>
                      <v-card-subtitle>Partner: {{ partnerInfoRef.partner_name }}</v-card-subtitle>
                    </v-col>
                    <v-col cols="8" class="d-flex justify-end">
                      <img width="110" :src="yourImage" />
                    </v-col>
                  </v-row>
                  <v-card-text>
                    <v-row justify="space-between">
                      <v-col cols="3" class="bg-yellow-darken-2 text-black pa-3 ml-2">
                        Date: {{ currentDateTime }}
                      </v-col>
                      <v-col>
                        {{ partnerInfoRef.partner_fullname }}
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-card-text>
                    <v-table class="custom-table">
                      <thead>
                        <tr class="text-center">
                          <th>Date</th>
                          <th>Number of TXN</th>
                          <th>Total Sale Amount</th>
                          <th>Refund TXN</th>
                          <th>Total Refund</th>
                          <th>Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in tableData" :key="item.date">
                          <td>{{ item.date }}</td>
                          <td>{{ item.number_TXN }}</td>
                          <td class="text-end">{{ new Intl.NumberFormat('en-US').format(item.total_sale_amount) }}</td>
                          <td class="text-end">{{ item.refund_TXN }}</td>
                          <td class="text-end">{{ new Intl.NumberFormat('en-US').format(item.total_Refund) }}</td>
                          <td></td> <!-- Add remarks if needed -->
                        </tr>

                        <tr class="total">
                          <td class="text-end">Total Sale</td>
                          <td></td>
                          <td class="text-end">{{ totalSaleAmount }}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>

                        <tr>
                          <td>Cancel from system Refund </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="text-end">-{{ totalRefund }}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Total Sale After Refund</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="text-end">{{ totalSaleAfterRefund }}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Transaction fee 2% (2) = (1)*2%</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="text-end">-{{ transactionFee }}</td>
                          <td></td>
                        </tr>
                        <tr class="total">
                          <td class="text-end">Total Net</td>
                          <td></td>
                          <td class="text-end">{{ totalNetAfterFee }}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </v-table>
                    <v-card-text>
                      <v-row justify="space-between">
                        <v-col cols="4" class="ml-15">
                          ຜູ້ອອກບິນ
                        </v-col>

                        <v-col cols="6">
                          ຜູ້ຮັບບິນ
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card-text>

                </div>
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
        <Header11 />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Header11 from '../header11.vue';
import { usePartnerStore } from '~/stores/partner';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import yourImage from '@/src/assets/images/vendee.jpg'


definePageMeta({
  middleware: 'auth'
});



const store = usePartnerStore();

// Reactive state for selected partner, startDate, and endDate
const selectedPartnerId = ref(store.selectedPartnerId);
const startDate = ref(null); // Start date selection
const endDate = ref(null);   // End date selection
const tableData = ref([]);

// Computed property for date options based on selected partner
const dateOptions = computed(() => {
  const partner = store.partners.find(p => p.partner_id === selectedPartnerId.value);
  return partner ? Object.keys(partner.date || {}) : [];
});

// Reactive state for partner info
const partnerInfoRef = ref({
  partner_id: 'Unknown',
  partner_name: 'Unknown',
  partner_fullname: 'Unknown'
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

// Handle partner selection change
const onPartnerChange = async () => {
  if (selectedPartnerId.value) {
    try {
      await store.fetchPartnerData(selectedPartnerId.value, { startDate: startDate.value, endDate: endDate.value });
      updatePartnerInfo(); // Update partner info after fetching data
    } catch (error) {
      console.error('Failed to fetch partner data:', error);
    }
  }
};

// Fetch data based on selected partner and date range (startDate and endDate)
const fetchData = async () => {
  if (selectedPartnerId.value && startDate.value && endDate.value) {
    try {
      await store.fetchPartnerData(selectedPartnerId.value, { startDate: startDate.value, endDate: endDate.value });
      // After fetching data, update tableData and partner info
      tableData.value = Object.entries(fetchStoredData().filteredDates || {}).map(([date, data]) => ({
        date,
        ...data
      }));
      updatePartnerInfo(); // Update partner info after fetching data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } else {
    console.warn('Please select a partner and valid start and end dates.');
  }
};

// Fetch and parse data from local storage
const fetchStoredData = () => {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem('partnerData');
    console.log('Stored Data:', storedData); // Debugging line
    return storedData ? JSON.parse(storedData) : {};
  }
  return {}; // Return an empty object if not on the client-side
};

// Update partner info from stored data
const updatePartnerInfo = () => {
  const storedData = fetchStoredData();
  partnerInfoRef.value = {
    partner_id: storedData.partner_id || 'Unknown',
    partner_name: storedData.partner_name || 'Unknown',
    partner_fullname: storedData.partner_fullname || 'Unknown'
  };
};

// Clear localStorage and reset state
const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('partnerData');
    // Reset partner info
    partnerInfoRef.value = {
      partner_id: 'Unknown',
      partner_name: 'Unknown',
      partner_fullname: 'Unknown'
    };
    // Clear table data
    tableData.value = [];
    console.log('Local storage cleared');
  }
};

// Watch for changes in partner or date selections
watch([selectedPartnerId, startDate, endDate], ([newPartnerId, newStartDate, newEndDate]) => {
  store.setSelectedPartnerId(newPartnerId);
  store.setDateRange(newStartDate, newEndDate); // Update date range in store
}, { deep: true });

// Fetch partners on mount
onMounted(async () => {
  try {
    await store.fetchAllPartners();
  } catch (error) {
    console.error('Failed to fetch partners:', error);
  }
});
/////////////////////////////////////////////////
const totalSaleAmount = computed(() => {
  const total = tableData.value.reduce((sum, item) => {
    return sum + parseFloat(item.total_sale_amount) || 0;
  }, 0);
  return new Intl.NumberFormat('en-US').format(total.toFixed(2)); // Format when returning
});

const totalRefund = computed(() => {
  const total = tableData.value.reduce((sum, item) => {
    return sum + parseFloat(item.total_Refund) || 0;
  }, 0);
  return new Intl.NumberFormat('en-US').format(total.toFixed(2)); // Format when returning
});

const totalSaleAfterRefund = computed(() => {
  const saleAmount = tableData.value.reduce((sum, item) => {
    return sum + parseFloat(item.total_sale_amount) || 0;
  }, 0);

  const refundAmount = tableData.value.reduce((sum, item) => {
    return sum + parseFloat(item.total_Refund) || 0;
  }, 0);

  const netAmount = saleAmount - refundAmount;
  return new Intl.NumberFormat('en-US').format(netAmount.toFixed(2)); // Format when returning
});

const transactionFee = computed(() => {
  const saleAmount = tableData.value.reduce((sum, item) => {
    return sum + parseFloat(item.total_sale_amount) || 0;
  }, 0);

  const fee = saleAmount * 0.02; // 2% of total sale amount
  return new Intl.NumberFormat('en-US').format(fee.toFixed(2)); // Format when returning
});

const totalNetAfterFee = computed(() => {
  const totalAfterRefund = parseFloat(totalSaleAfterRefund.value.replace(/,/g, '')) || 0; // Use unformatted number for calculation
  const fee = parseFloat(transactionFee.value.replace(/,/g, '')) || 0; // Use unformatted number for calculation
  const netAfterFee = totalAfterRefund - fee;
  return new Intl.NumberFormat('en-US').format(netAfterFee.toFixed(2)); // Format when returning
});
// const totalSaleAmount = computed(() => {
//   const total = tableData.value.reduce((total, item) => {
//     return total + parseFloat(item.total_sale_amount) || 0;
//   }, 0);
//   return total.toFixed(2); // Return raw number, not formatted
// });

// const totalRefund = computed(() => {
//   const total = tableData.value.reduce((total, item) => {
//     return total + parseFloat(item.total_Refund) || 0;
//   }, 0);
//   return total.toFixed(2); // Return raw number, not formatted
// });

// const totalSaleAfterRefund = computed(() => {
//   const saleAmount = tableData.value.reduce((total, item) => {
//     return total + parseFloat(item.total_sale_amount) || 0;
//   }, 0);

//   const refundAmount = tableData.value.reduce((total, item) => {
//     return total + parseFloat(item.total_Refund) || 0;
//   }, 0);

//   const netAmount = saleAmount - refundAmount;
//   return netAmount.toFixed(2); // Return raw number, not formatted
// });

// const transactionFee = computed(() => {
//   const saleAmount = tableData.value.reduce((total, item) => {
//     return total + parseFloat(item.total_sale_amount) || 0;
//   }, 0);

//   const fee = saleAmount * 0.02; // 2% of total sale amount
//   return fee.toFixed(2); // Return raw number, not formatted
// });

// const totalNetAfterFee = computed(() => {
//   const totalAfterRefund = parseFloat(totalSaleAfterRefund.value) || 0; // Note: Using raw numbers now
//   const fee = parseFloat(transactionFee.value) || 0; // Using raw numbers now
//   return (totalAfterRefund - fee).toFixed(2); // Compute and return a raw number
// });
/////////////////////////////////////////////////////
///////////////////PDF//////////////////////////////
const generatePDF = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');


  const imageBase64 = yourImage;

  // Margins and settings for the page
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = margin;

  const imgWidth = 30;  // Adjust width
  const imgHeight = 30; // Adjust height


  // Title of the PDF
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('Partner Report', pageWidth / 22, yPosition,);
  yPosition += 10;

  // Partner Info Section
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.addImage(imageBase64, 'JPEG', pageWidth - imgWidth - margin, margin - 10, imgWidth, imgHeight,);
  pdf.text(`Partner ID: ${partnerInfoRef.value.partner_id || 'Unknown'}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Partner Name: ${partnerInfoRef.value.partner_name || 'Unknown'}`, margin, yPosition);
  yPosition += 7;
  pdf.text(`Date: ${currentDateTime.value}   ${partnerInfoRef.value.partner_fullname}`, margin, yPosition);
  yPosition += 10;



  // Define Table Headers and Body Rows
  const headers = [
    [
      { content: 'Date' },
      { content: 'Number of TXNs' },
      { content: 'Total Sale Amount' },
      { content: 'Refund TXN' },
      { content: 'Total Refund' },
      { content: 'Remark' }
    ],
  ];

  // Main data rows for the table (example data)
  const body = tableData.value.map(item => [
    { content: item.date, styles: { halign: 'center' } },
    { content: item.number_TXN.toString(), styles: { halign: 'center' } },
    { content: new Intl.NumberFormat('en-US').format(item.total_sale_amount), styles: { halign: 'right' } },
    { content: item.refund_TXN.toString(), styles: { halign: 'center' } },
    { content: new Intl.NumberFormat('en-US').format(item.total_Refund), styles: { halign: 'right' } },
    { content: '', styles: { halign: 'center' } }  // Empty remark cell
  ]);

  // Add the summary rows after the data
  const summaryRows = [
    [
      { content: 'Total Sale', colSpan: 2, styles: { halign: 'right', fillColor: [209, 206, 206] } },
      { content: totalSaleAmount.value, colSpan: 1, styles: { halign: 'right', fillColor: [209, 206, 206] } },
    ],
    [
      { content: 'Cancel from system Refund', colSpan: 2, styles: { halign: 'right' } },
      { content: '-' + totalRefund.value, colSpan: 3, styles: { halign: 'right' } },
    ],
    [
      { content: 'Total Sale After Refund', colSpan: 2, styles: { halign: 'right' } },
      { content: totalSaleAfterRefund.value, colSpan: 3, styles: { halign: 'right' } },
    ],
    [
      { content: 'Transaction fee 2% (2) = (1)*2%', colSpan: 2, styles: { halign: 'right' } },
      { content: '-' + transactionFee.value, colSpan: 3, styles: { halign: 'right' } },
    ],
    [
      { content: 'Total Net', colSpan: 2, styles: { halign: 'right', fillColor: [209, 206, 206] } },
      { content: totalNetAfterFee.value, colSpan: 3, styles: { halign: 'right', fillColor: [209, 206, 206] } },
    ],
  ];

  // Combine data rows and summary rows into one array
  const fullTableBody = [
    ...body,
    ...summaryRows
  ];

  // Generate a single table with data and summary at the bottom
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
      halign: 'center'
    },
    bodyStyles: {
      lineWidth: 0.1,
      textColor: [0, 0, 0]
    },
    tableLineColor: [23, 13, 13], // Black border color
    tableLineWidth: 0.1,
    // didDrawPage: () => {
    //   // Footer text
    //   const finalY = pdf.autoTable.previous.finalY;
    //   const footerY = finalY + 10; // Position the footer 10mm below the table

    //   pdf.setFontSize(12);
    //   pdf.text('ຜູ້ອອກບິນ',  margin, footerY);
    //   pdf.text('ຜູ້ຮັບບິນ', pageWidth / 3, footerY, { align: 'center' });
    // }
  });

  // Save the PDF
  pdf.save('partner-report.pdf');
};
////////////////////////////////////////

// Watch startDate and adjust endDate if necessary

</script>


<script>
export default {
  data() {
    return {
      menu: false,
    };
  },
};
</script>


<style scoped>
.bill-container {
  width: 210mm;
  padding: 20px;
  background: #fff;
  color: #000;
}

.custom-table th,
.custom-table td {
  font-size: 14px;
  /* Adjust font size */
  padding: 8px;
  /* Adjust padding */

}

.custom-table th {
  background-color: #d1cece;
  /* Optional: Add background color */
}

.custom-table td {
  border: 1px solid #170d0d;
  /* Optional: Add border */
}

.custom-table td.text-end {
  text-align: right;
  /* Align text to the right */
}

.total {
  background-color: #d1cece;
  /* Optional: Add background color */
}
.fill-height {
  height: 100vh; /* Full screen height */
}
</style>
