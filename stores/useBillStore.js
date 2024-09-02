// stores/useBillStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBillHistory = defineStore('billHistory', () => {
  const billHistory = ref([]);
  const billProducts = ref([]);

  const fetchBills = async () => {
    try {
      const response = await fetch('http://localhost:3300/bills');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched bills:', data); // Add logging here
      billHistory.value = data;
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const fetchBillProducts = async (billId) => {
    try {
      const response = await fetch(`http://localhost:3300/bills/${billId}/products`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched bill products:', data); // Add logging here
      billProducts.value = data;
    } catch (error) {
      console.error('Error fetching bill products:', error);
    }
  };

  return { billHistory, billProducts, fetchBills, fetchBillProducts };
});

