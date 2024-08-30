import { defineStore } from 'pinia';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export const useBillStore = defineStore('bill', {
  state: () => ({
    bills: [],
    loading: false,
    error: null,
  }),
  actions: {
    async postBill(billData) {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.post('http://localhost:3300/bills', billData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          this.bills.push(response.data);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Bill posted successfully',
            showConfirmButton: false,
            timer: 3000,
          });
        } catch (error) {
          this.error = error;
          console.error('Error posting bill:', error.response?.data || error.message); // Detailed logging
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: `Failed to post bill: ${error.response?.data?.message || error.message}`,
            showConfirmButton: false,
            timer: 3000,
          });
        } finally {
          this.loading = false;
        }
      },
  },
});
