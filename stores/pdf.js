import { defineStore } from 'pinia';
import { ref  } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useProductStore } from '~/stores/pinia';

export const usePdf = defineStore('usePdf', () =>{
         const pdf = ref([])

    const add_product = (id, currentprice, stock =1 )=> {
        const data = {
            id,
            currentprice,
            stock
        }

        const findId = pdf.value.find(e => e.id === data.id)
        if(findId){    
            alert_add_failed()
        }else{ 
            pdf.value.push(data)
            saveToLocalStorage()
            alert_add_success()
        }
            
            console.log(pdf.value)
    }
    const saveToLocalStorage = () =>{
        localStorage.setItem('pdf', JSON.stringify(pdf.value))
    }

    const loadFromLocalStorage = () =>{
        if(localStorage.getItem('pdf')){
            pdf.value = JSON.parse(localStorage.getItem('pdf'))
        }
    }
    const pdfPreview = computed(() =>{
        const ProductStore = useProductStore()

        pdf.value.map((prd, i) => {
            const findIndexProduct = ProductStore.products.findIndex(e=> e.id == prd.id)
            return{
                products : ProductStore.products[findIndexProduct]
            }
        })
    })

        const alert_add_success= ()=>{
            Swal.fire({
                position: "center",
                icon: "success",
                title: "ເພີ້ມສິນຄ້າແລ້ວ",
                showConfirmButton: false,
                timer: 3000
              });
        }
        const alert_add_failed= ()=>{
            Swal.fire({
                position: "center",
                icon: "error",
                title: "ໄດ້ມີເພີ້ມສິນຄ້າແລ້ວ",
                showConfirmButton: false,
                timer: 3000
              });
        }
    return { pdf, add_product, loadFromLocalStorage, pdfPreview }
})