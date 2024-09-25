<template>
  <v-app>
    <v-container fluid class="fill-height pa-0">
      <v-img src="https://wallpapers.com/images/hd/hd-orange-wavelength-art-fbcwek67vdsjxlgv.jpg" class="fill-height"
        cover>
        <v-container class=" mt-50px mt-15">
          <v-row justify="center">
            <v-col cols="2" sm="4" md="2" lg="2" xl="10" class="mt-8">
              <v-card max-width="170">
                <v-card-title class="text-center" style="color: #D84315;">Chips</v-card-title>
              </v-card>
            </v-col>
            <v-col cols="10" sm="4" md="10" lg="10" xl="10">
            <productChips></productChips>
          </v-col>
          </v-row>
        </v-container>
        <!-- //////////////////////////////////////////////////////////////////////////// -->
            <v-divider :thickness="7" class="border-opacity-75" color="warning"></v-divider>
            <v-container>
              <v-row justify="center">
                <v-col cols="2" sm="4" md="2" lg="2" xl="10" class="mt-8">
                  <v-card max-width="170">
              <v-card-title class="text-center" style="color: #D84315;">Beer</v-card-title>  
              </v-card>
            </v-col>
                <v-col ccols="10" sm="4" md="10" lg="10" xl="10">
           <productbeer></productbeer>
          </v-col>
        </v-row>
        </v-container>
             <!-- //////////////////////////////////////////////////////////////////////////// -->
             <v-divider :thickness="7" class="border-opacity-75" color="warning"></v-divider>
            <v-container>
              <v-row justify="center">
                <v-col cols="2" sm="4" md="2" lg="2" xl="10" class="mt-8">
                  <v-card max-width="170">
              <v-card-title class="text-center" style="color: #D84315;">Soda</v-card-title>  
              </v-card>
            </v-col>
                <v-col ccols="10" sm="4" md="10" lg="10" xl="10">
           <productsoda></productsoda>
          </v-col>
        </v-row>
        </v-container>
      </v-img>
    </v-container>
  </v-app>
  <v-container>
    <v-row>
      <v-col>
        <Header11></Header11>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Header11 from '../header11.vue';
import productsoda from './productsoda.vue';
import productbeer from './productbeer.vue';
import productChips from './productChips.vue';


definePageMeta({
  middleware: ['auth', 'admin'],
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
  /* Full screen height */
}
</style>