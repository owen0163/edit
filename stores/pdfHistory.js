import { defineStore } from 'pinia';
import { ref } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { useBillHistory } from '@/stores/useBillHistory';

export const usePdfHistory = defineStore('usePdfHistory', () => {
    const bills = ref([]);

    const add_bill = (bill_id, username, bill_date) => {
        const data = { bill_id, username, bill_date };
        const findId = bills.value.find(e => e.bill_id === data.bill_id);
        if (findId) {    
            alert_add_failed();
        } else { 
            bills.value.push(data);
            saveToLocalStorage();
            alert_add_success();
        }
        console.log(bills.value);
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('bills', JSON.stringify(bills.value));
    };

    const loadFromLocalStorage = () => {
        if (localStorage.getItem('bills')) {
            bills.value = JSON.parse(localStorage.getItem('bills'));
        }
    };

    const alert_add_success = () => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "ເພີ້ມບິນແລ້ວ",
            showConfirmButton: false,
            timer: 3000
        });
    };

    const alert_add_failed = () => {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "ມີບິນນີ້ແລ້ວ",
            showConfirmButton: false,
            timer: 3000
        });
    };


    const pdfbillPreview = computed(() => {
        const billsHistory = useBillHistory();
        return bills.value.map((bill) => {
          const matchingBill = billsHistory.billsHistory.find((e) => e.bill_id === bill.bill_id);
          return {
            ...bill,
            name: matchingBill ? matchingBill.username : 'Unknown',
            date: matchingBill ? matchingBill.bill_date : bill.bill_date,
            amount: matchingBill ? matchingBill.amount : 'N/A',
          };
        });
      });

    return { bills, add_bill, loadFromLocalStorage, saveToLocalStorage, pdfbillPreview };
});
