

import { defineStore } from 'pinia';
import axios from 'axios';

export const usePartnerStore = defineStore('partner', {
  state: () => ({
    partners: [],
    selectedPartnerId: null,
    selectedDates: [],
    startDate: null,
    endDate: null,
    error: null,
  }),
  actions: {
    // Fetch all partners
    async fetchAllPartners() {
      try {
        const response = await axios.get('http://localhost:8080/parnetrs');
        this.partners = response.data;
      } catch (error) {
        console.error('Failed to fetch partners:', error);
        this.error = 'Failed to fetch partners';
      }
    },

    // Fetch a partner by ID
    async fetchPartnerById(id) {
      try {
        const response = await axios.get(`http://localhost:8080/parnetr/${id}`);
        this.partners = [response.data]; // Store the single partner data in an array
      } catch (error) {
        console.error('Failed to fetch partner:', error);
        this.error = 'Failed to fetch partner';
      }
    },

    // Fetch partner data based on selected partner and date range
    async fetchPartnerData(partnerId, { startDate, endDate }) {
      try {
        const response = await axios.post('http://localhost:8080/get-partner1', {
          partner_id: partnerId,
          startDate,  // Pass the start date
          endDate,    // Pass the end date
        });
      
        console.log(response.data); // Handle response as needed
         // Save data to local storage
    localStorage.setItem('partnerData', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch partner data:', error);
        this.error = 'Failed to fetch partner data';
      }
    },

    // Set selected partner ID
    setSelectedPartnerId(id) {
      this.selectedPartnerId = id;
    },

    // Set selected date range
    setDateRange(startDate, endDate) {
      this.startDate = startDate;
      this.endDate = endDate;
    },

    // Set specific selected dates
    setSelectedDates(dates) {
      this.selectedDates = dates;
    },
  },
});

