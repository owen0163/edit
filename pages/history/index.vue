<template>
    <div>test</div>
  </template>

  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useBillHistory } from '~/stores/useBillStore'; // Ensure the import path is correct
  
  const store = useBillHistory();
  const showProductsDialog = ref(false);
  const selectedBillId = ref(null);
  
  const selectBill = async (id) => {
    selectedBillId.value = id;
    await store.fetchBillProducts(id);
    showProductsDialog.value = true;
  };
  
  onMounted(() => {
    store.fetchBills();
  });
  
  const { billHistory, billProducts } = store;
  </script>
  
  
  