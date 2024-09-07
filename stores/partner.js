// stores/partnerStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePartnerStore = defineStore('partner', {
  state: () => ({
    partners: [],
    selectedPartnerId: null,
    selectedDates: [],
    error: null,
  }),
  actions: {
    async fetchAllPartners() {
      try {
        const response = await axios.get('https://1d42a0d5-7661-4467-8eef-b6c1e07ad907-00-3fjq7ac687h9n.sisko.replit.dev/parnetrs');
        this.partners = response.data;
      } catch (error) {
        console.error('Failed to fetch partners:', error);
        this.error = 'Failed to fetch partners';
      }
    },
    async fetchPartnerById(id) {
      try {
        const response = await axios.get(`https://1d42a0d5-7661-4467-8eef-b6c1e07ad907-00-3fjq7ac687h9n.sisko.replit.dev/parnetr/${id}`);
        this.partners = [response.data]; // Store the single partner data in an array
      } catch (error) {
        console.error('Failed to fetch partner:', error);
        this.error = 'Failed to fetch partner';
      }
    },
    async fetchPartnerData(partnerId, specificDates) {
      try {
        const response = await axios.post('https://1d42a0d5-7661-4467-8eef-b6c1e07ad907-00-3fjq7ac687h9n.sisko.replit.dev/get-partner1', {
          partner_id: partnerId,
          specificDates,
        });
        console.log(response.data); // Handle response as needed
      } catch (error) {
        console.error('Failed to fetch partner data:', error);
        this.error = 'Failed to fetch partner data';
      }
    },
    setSelectedPartnerId(id) {
      this.selectedPartnerId = id;
    },
    setSelectedDates(dates) {
      this.selectedDates = dates;
    },
  },
});
