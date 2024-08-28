import { defineStore } from 'pinia';
import axios from 'axios';


export const usePdf = defineStore('usePdf', () =>{
         const pdf = ref([])

    const add_product = (id, currentprice, stock =1 )=> {
        const data = {
            id,
            currentprice,
            stock
        }
            pdf.value.push(data)
            console.log(cart.value)
    }
})