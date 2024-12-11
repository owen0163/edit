import { defineStore } from 'pinia';
import axios from 'axios';

// export const useDataStore = defineStore('data', {
//     state: () => ({
//         fetchedData: null,
//         loading: false,
//         error: null,
//     }),
//     actions: {
//         async fetchData(payload) {
//             try {
//                 console.log("Sending payload:", payload); // Add this for debugging
//                 const response = await axios.post('http://localhost:8000/date', payload);
//                 this.fetchedData = response.data;
//             } catch (err) {
//                 this.error = err.response?.data?.msg || err.message;
//                 console.error("API call failed with error:", err.response?.data || err.message);
//             } finally {
//                 this.loading = false;
//             }
//         }
        
//     },
// });
export const useDataStore = defineStore("data", {
    state: () => ({
        fetchedData: null as { sales: Array<{ id: number; product_name: string; quantity: number; amount: number; sale_datetime: string }> } | null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchData(payload: { day: string; start: string; end: string }) {
            try {
                this.loading = true;
                this.error = null;
                const response = await axios.post("http://localhost:8000/date", payload);
                this.fetchedData = response.data;
            } catch (err) {
                this.error = err.message;
                console.error("API call failed with error:", err.response?.data || err.message);
            } finally {
                this.loading = false;
            }
        },
    },
});
