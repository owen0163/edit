<template>
    <v-container>
      <v-row>
        <v-col cols="10" md="3">
          <v-card class="mt-15" max-width="350">
            <v-card-title>
              <v-select
                label="Select Partner"
                max-width="340"
                :items="partnerItems"
                v-model="selectedPartnerId"
                @change="onPartnerChange"
              />
            </v-card-title>
            <v-card-text>
              <v-select
                label="Select Date"
                max-width="400"
                :items="dateOptions"
                v-model="selectedDates"
                multiple
              />
            </v-card-text>
            <v-card-actions>
              <v-row justify="center" class="w-100">
                <v-col cols="auto">
                  <div class="text-center">
                    <v-btn variant="elevated" color="blue-accent-3" @click="fetchData">
                      Fetch Data
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <!-- Additional content -->
        </v-col>
      </v-row>
    </v-container>
  
    <v-container>
      <v-row>
        <v-col>
          <Header11></Header11>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import Header11 from '../header11.vue';
  import { usePartnerStore } from '~/stores/partner';
  
  const store = usePartnerStore();
  const selectedPartnerId = ref(store.selectedPartnerId);
  const selectedDates = ref(store.selectedDates);
  
  // Computed property for partner items
  const partnerItems = computed(() => {
    return store.partners.map(p => ({ text: p.partner_name, value: p.partner_id }));
  });
  
  // Computed property for date options based on selected partner
  const dateOptions = computed(() => {
    const partner = store.partners.find(p => p.partner_id === selectedPartnerId.value);
    return partner ? Object.keys(partner.date || {}) : [];
  });
  
  // Watch for changes in selectedPartnerId to fetch partner-specific data
  watch(selectedPartnerId, async (newId) => {
    if (newId) {
      try {
        await store.fetchPartnerById(newId);
      } catch (error) {
        console.error('Failed to fetch partner data:', error);
      }
    }
  });
  
  const onPartnerChange = async () => {
    if (selectedPartnerId.value) {
      try {
        await store.fetchPartnerData(selectedPartnerId.value, selectedDates.value);
      } catch (error) {
        console.error('Failed to fetch partner data:', error);
      }
    }
  };
  
  const fetchData = async () => {
    if (selectedPartnerId.value) {
      try {
        await store.fetchPartnerData(selectedPartnerId.value, selectedDates.value);
      } catch (error) {
        console.error('Failed to fetch partner data:', error);
      }
    }
  };
  
  // Watch and update store state when selectedPartnerId or selectedDates changes
  watch([selectedPartnerId, selectedDates], ([newPartnerId, newDates]) => {
    store.setSelectedPartnerId(newPartnerId);
    store.setSelectedDates(newDates);
  }, { deep: true });
  
  onMounted(async () => {
    try {
      await store.fetchAllPartners();
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    }
  });
  </script>
  

  