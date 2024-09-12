// stores/useBillHistory.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useBillHistory = defineStore('billHistory', {
  state: () => ({
    billsHistory: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBills() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3300/bills');
        this.billsHistory = response.data;
      } catch (error) {
        this.error = 'Failed to fetch bills';
      } finally {
        this.loading = false;
      }
    }
  }
});
