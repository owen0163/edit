<template>
    <v-container class="mt-15">
        <v-row>
            <v-col cols="12" md="12" lg="4">
                <v-card class="mt-5" max-width="300">
                    <v-row justify="center">
                        <!-- Start Date Picker -->
                        <v-col cols="10">
                            <v-text-field v-model="date" label="Start Date" clearable type="date" solo
                                style="max-width: 200px" class="ml-4"></v-text-field>
                        </v-col>

                        <!-- Start Time Picker -->
                        <v-col cols="10" >
                            <v-text-field v-model="timeStart" label="Start" prepend-icon="mdi-clock-time-four-outline"
                                readonly style="max-width: 200px" @click="modal1 = true" class="ml-2"></v-text-field>

                            <v-dialog v-model="modal1" width="auto">
                                <v-time-picker v-if="modal1" v-model="timeStart" @click:cancel="modal1 = false"
                                    @click:save="modal1 = false" format="24hr" color="green-lighten-1"></v-time-picker>
                            </v-dialog>
                        </v-col>

                        <!-- End Time Picker -->
                        <v-col cols="10">
                            <v-text-field v-model="timeEnd" label="End" prepend-icon="mdi-clock-time-four-outline"
                                readonly style="max-width: 200px" @click="modal2 = true" class="ml-2"></v-text-field>

                            <v-dialog v-model="modal2" width="auto">
                                <v-time-picker v-if="modal2" v-model="timeEnd" @click:cancel="modal2 = false"
                                    @click:save="modal2 = false" format="24hr" color="green-lighten-1"></v-time-picker>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="auto" class="mb-3">
                            <v-btn color="#1976D2" variant="flat" @click="handleFetchData">
                                Fetch Data
                            </v-btn>
                            <v-btn color="#D32F2F" variant="flat" class="ml-2" @click="clearData">
                                clear
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
   

        <!-- Display fetched data -->

            <v-col cols="12" md="12" lg="8">
                <v-card class="mt-5">
                    <v-card-title>Fetched Data</v-card-title>
                    <v-card-subtitle v-if="loading">Loading...</v-card-subtitle>
                    <v-card-subtitle v-if="error" class="text-error">{{ error }}</v-card-subtitle>

                    <v-data-table v-if="fetchedData && fetchedData.sales" :items="fetchedData.sales" 
                        class="elevation-1 ">
                        <template v-slot:no-data>
                            <v-alert type="info">No data available for the selected range.</v-alert>
                        </template>
                    </v-data-table>
                </v-card>
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


<script lang="ts">
import { defineComponent } from "vue";
import { useDataStore } from "~/stores/data ";
import { storeToRefs } from "pinia";
import Header11 from "../header11.vue";

export default defineComponent({
    name: "TimePickerExample",
    components: { Header11 },
    data() {
        return {
            date: null, // Holds the selected start date
            timeStart: null, // Holds the selected start time
            timeEnd: null, // Holds the selected end time
            modal1: false, // Controls the start time dialog visibility
            modal2: false, // Controls the end time dialog visibility
            // headers: [ // Define headers for the table
            //     { text: "Sale ID", value: "id" },
            //     { text: "Product", value: "product_name" },
            //     { text: "Quantity", value: "quantity" },
            //     { text: "Amount", value: "amount" },
            //     { text: "Sale Date", value: "sale_datetime" },
            // ],
        };
    },
    setup() {
        const dataStore = useDataStore();
        const { fetchedData, loading, error } = storeToRefs(dataStore); // Access store state
        const { fetchData } = dataStore; // Access store action

        // Return everything needed in the template
        return { fetchedData, loading, error, fetchData };
    },
    methods: {
        async handleFetchData() {


            const payload = {
                day: this.date,
                start: this.timeStart,
                end: this.timeEnd,
            };

            // console.log("Payload being sent:", payload);

            try {
                await this.fetchData(payload);
                
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        },
        clearData() {
        // Clear the date and time inputs
        this.date = null;
        this.timeStart = null;
        this.timeEnd = null;

        // Clear fetched data by resetting it in the store
        const dataStore = useDataStore();
        dataStore.fetchedData = null;
    },
    }

});
</script>



<style scoped>
.mt-15 {
    margin-top: 15px;
}
</style>