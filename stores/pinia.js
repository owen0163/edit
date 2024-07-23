import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('Product', {
  state: () => ({
    products: [],
    product: null,
  }),
  actions: {
    async fetchProducts() {
      try {
        const response = await axios.get('https://b8fc17f5-f052-43d4-aca5-a3ba283991d5-00-33ml6ruwudc9l.sisko.replit.dev/products');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchProductById(id) {
      try {
        const response = await axios.get(`https://b8fc17f5-f052-43d4-aca5-a3ba283991d5-00-33ml6ruwudc9l.sisko.replit.dev/products/${id}`);
        this.product = response.data;
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    },
    async updateProduct(id, updatedProduct) {
      try {
        const response = await axios.put(`https://b8fc17f5-f052-43d4-aca5-a3ba283991d5-00-33ml6ruwudc9l.sisko.replit.dev/products/${id}`, updatedProduct);
        await this.fetchProducts();
      } catch (error) {
        console.error('Error updating product:', error);
        throw error;
      }
    },
    async addProduct(newProduct) {
    
      try {
        const response = await axios.post('https://b8fc17f5-f052-43d4-aca5-a3ba283991d5-00-33ml6ruwudc9l.sisko.replit.dev/products/add', newProduct);
        await this.fetchProducts();
      } catch (error) {
        console.error('Error adding product:', error);
        throw error;
      }
    },
  },
});
