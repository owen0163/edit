import { defineStore } from 'pinia';
import { ref  } from 'vue';


export const usePdf = defineStore('usePdf', () =>{
         const pdf = ref([])

    const add_product = (id, currentprice, stock =1 )=> {
        const data = {
            id,
            currentprice,
            stock
        }
            pdf.value.push(data)
            console.log(pdf.value)
    }
    return { add_product }
})