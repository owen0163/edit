import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { useProductStore } from '~/stores/pinia';

export const usePdf = defineStore('usePdf', () => {
  const pdf = ref([]);

  const add_product = (id, currentprice, stock = 1) => {
    const data = { id, currentprice, stock };
    const findId = pdf.value.find(e => e.id === data.id);
    if (findId) {    
      alert_add_failed();
    } else { 
      pdf.value.push(data);
      saveToLocalStorage();
      alert_add_success();
    }
    console.log(pdf.value);
  };
  const updateProductStock = (id, newStock) => {
    const product = pdf.value.find(p => p.id === id);
    if (product) {
      product.stock = newStock;
      saveToLocalStorage();
    }
  };
  const saveToLocalStorage = () => {
    localStorage.setItem('pdf', JSON.stringify(pdf.value));
  };

  const loadFromLocalStorage = () => {
    if (localStorage.getItem('pdf')) {
      pdf.value = JSON.parse(localStorage.getItem('pdf'));
    }
  };
  const loadFromLocalStorageToClear = () => {
    const storedPdf = localStorage.getItem('pdf');
    pdf.value = storedPdf ? JSON.parse(storedPdf) : [];
  };

  const pdfPreview = computed(() => {
    const ProductStore = useProductStore();
    return pdf.value.map((prd) => {
      const product = ProductStore.products.find((e) => e.id === prd.id);
      return {
        ...prd,
        name: product?.name || 'Unknown',
        img: product?.image || '',
      };
    });
  });

  const alert_add_success = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "ເພີ້ມສິນຄ້າແລ້ວ",
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        title: 'noto-serif-lao', // Use this class for the title
        popup: 'noto-serif-lao', // Use this class for the popup
      }
    });
  };

  const alert_add_failed = () => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "ໄດ້ມີເພີ້ມສິນຄ້າແລ້ວ",
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        title: 'noto-serif-lao', // Use this class for the title
        popup: 'noto-serif-lao', // Use this class for the popup
      }
    });
  };

  return { pdf,updateProductStock, add_product, loadFromLocalStorage, pdfPreview, saveToLocalStorage, loadFromLocalStorageToClear };
});
