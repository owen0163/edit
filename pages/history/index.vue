<template>

<v-container>
    <v-row>
      <v-col>
  <v-card v-if="billStore.loading" class="mb-6 mt-15 mx-auto">
    <v-card-text>Loading...</v-card-text>
  </v-card>

  <v-alert v-if="billStore.error" type="error">
    {{ billStore.error }}
  </v-alert>
  <!-- ////////////////////////////////////////////////////// -->
  <v-card class="mb-6 mt-15 mx-auto" max-width="800" >
        <v-expansion-panels >
          <v-expansion-panel v-for="bill in billStore.billsHistory" :key="bill.bill_id">
            <v-card    :variant="variants">
            <v-expansion-panel-title expand-icon="mdi-menu-down">
              <v-card-title>
                <v-row>
                  <v-col> ເລກບິນ : {{ bill.bill_id }}</v-col>
                  <v-col>ຜູ້ອອກບິນ : {{ bill.username }}</v-col>
                  <v-col>ວັນ ແລະ ເວລາ : {{ bill.bill_date }}</v-col>
                </v-row>
              </v-card-title>
            </v-expansion-panel-title>
            <v-expansion-panel-text v-for="product in bill.products" :key="product.product_id">
              <v-container>
                <v-row>
                  <v-card>
                    <v-card-title>{{ product.product_name }}</v-card-title>
                    <v-card-subtitle>
                      Quantity: {{ product.quantity }} - Price: {{ product.price }}
                    </v-card-subtitle>
                  </v-card>
                </v-row>
              </v-container>
            </v-expansion-panel-text>
     
             <v-row justify="space-between" >
                <v-col cols="6"
                  class="text-h6 ml-6">ລາຄາລວມ : {{ bill.total_amount }}
                </v-col>
             
                <v-col class="text-end mr-6 mb-2">
                  <v-btn variant="flat" color="light-blue-darken-2" @click="addbills(bill.bill_id, bill.username, bill.bill_date, bill.total_amount, bill.products)">
    Add
</v-btn>
                </v-col>
              </v-row>
          </v-card>
          </v-expansion-panel>

        </v-expansion-panels>
      </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- /////////////////////////////////////////////////////// -->
  <v-container>
    <v-row>
      <v-col>
        <Header11></Header11>
      </v-col>
    </v-row>
  </v-container>


</template>

<script setup>
import { useBillHistory } from '@/stores/useBillHistory';
import { onMounted } from 'vue';
import Header11 from '../header11.vue';

import { usePdfHistory } from '~/stores/pdfHistory';
const pdfHistoryStore = usePdfHistory();
const billStore = useBillHistory();

onMounted(() => {
  billStore.fetchBills();
  console.log(billStore.billsHistory); // Log billsHistory to check if username is present
});
const variants = ['outlined']

const addbills = (bill_id, username, bill_date, total_amount, products) => {
    pdfHistoryStore.add_bill(bill_id, username, bill_date, total_amount, products);
};

</script>
