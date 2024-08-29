import { defineStore } from 'pinia';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

export const useProductStore = defineStore('Product', {
  state: () => ({
    products: [],
    product: null,
  }),
  actions: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3300/products');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchProductById(id) {
      try {
        const response = await axios.get(`http://localhost:3300/products/${id}`);
        this.product = response.data;
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    },
    async updateProduct(id, updatedProduct) {
      try {
        const response = await axios.put(`http://localhost:3300/products/${id}`, updatedProduct);
        await this.fetchProducts();
      
      } catch (error) {
        console.error('Error updating product:', error);
        throw error;
      }
    },
    
    async addProduct(product) {
      try {
        const response = await axios.post('http://localhost:3300/products', product);
        // Optionally, you can fetch products here if needed
        this.fetchProducts(); // Assuming you have a fetchProducts method
        return response.data;
      } catch (error) {
        console.error('Error adding product:', error);
        throw error;
      }
  },
    async removeProduct(id) {
      try {
        await axios.delete(`http://localhost:3300/products/${id}`);
        await this.fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    },

  },
});
