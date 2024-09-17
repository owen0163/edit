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
    },
    async fetchBillById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:3300/postbills', { id });
        this.currentBill = response.data;
      } catch (error) {
        this.error = 'Failed to fetch bill';
      } finally {
        this.loading = false;
      }
    },
    getBillOptions() {
      return this.billsHistory.map(bill => ({
        id: bill.bill_id,  // Ensure this matches the actual field from the API response
        display_name: `Bill ID: ${bill.bill_id}` // Default to 'Unknown' if username is missing
      }));
    },
  }
});
