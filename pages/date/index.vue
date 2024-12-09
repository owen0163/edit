<template>
    <v-container class="mt-15">
        <v-row>
            <v-col>
                <v-card>
                    <v-row>
                        <v-col>
                            <!-- Start Date Picker -->
                            <v-text-field label="Start Date" clearable type="date" solo style="max-width: 200px"
                                class="ml-2"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <!-- Start Time Picker -->
                        <v-col cols="3">
                            <v-text-field v-model="startTime" label="Start" prepend-icon="mdi-clock-time-four-outline"
                                readonly style="max-width: 200px" @click="modal1 = true" class="ml-2"></v-text-field>

                            <v-dialog v-model="modal1" width="auto">
                                <v-time-picker v-if="modal1" v-model="startTime" @click:cancel="modal1 = false"
                                    @click:save="modal1 = false" format="24hr"></v-time-picker>
                            </v-dialog>
                        </v-col>

                        <!-- End Time Picker -->
                        <v-col cols="3">
                            <v-text-field v-model="endTime" label="End" prepend-icon="mdi-clock-time-four-outline"
                                readonly style="max-width: 200px" @click="modal2 = true" class="ml-2"></v-text-field>

                            <v-dialog v-model="modal2" width="auto">
                                <v-time-picker v-if="modal2" v-model="endTime" @click:cancel="modal2 = false"
                                    @click:save="modal2 = false" format="24hr"></v-time-picker>
                            </v-dialog>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <v-container>
        <v-row>
            <v-col>
                <Header11 />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header11 from "../header11.vue";

export default defineComponent({
    name: "TimePickerExample",
    components: { Header11 },
    data() {
        return {
            startTime: null, // Holds the selected start time
            endTime: null,   // Holds the selected end time
            modal1: false,   // Controls the start time dialog visibility
            modal2: false,   // Controls the end time dialog visibility
        };
    },
});
</script>

<style scoped>
.mt-15 {
    margin-top: 15px;
}
</style>