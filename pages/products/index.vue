<template>
  <v-tabs v-model="tab" bg-color="orange-darken-3" class=" mt-16">
    <v-tab value="one">Chips</v-tab>
    <v-tab value="two">Beer</v-tab>
    <v-tab value="three">Soda</v-tab>
    <v-tab value="four">Energy Drink</v-tab>
  </v-tabs>


  <v-tabs-window v-model="tab">
    <!-- /////////////////////////////////////////////////////////////////////////////////////////////// -->
    <v-tabs-window-item value="one">
      <v-parallax src="https://wallpapers.com/images/hd/hd-orange-wavelength-art-fbcwek67vdsjxlgv.jpg">
        <v-container>
          <v-row justify="center">

            <v-col cols="12" sm="9" md="10" lg="10" xl="10">
              <productChips></productChips>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    </v-tabs-window-item>
    <!-- /////////////////////////////////////////////////////////////////////////////////////////////// -->
    <v-tabs-window-item value="two">
      <v-parallax src="https://wallpapers.com/images/hd/hd-orange-wavelength-art-fbcwek67vdsjxlgv.jpg">
        <v-container>
          <v-row justify="center">

            <v-col cols="12" sm="9" md="10" lg="10" xl="10">
              <productbeer></productbeer>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    </v-tabs-window-item>
    <!-- /////////////////////////////////////////////////////////////////////////////////////////////// -->
    <v-tabs-window-item value="three">
      <v-parallax src="https://wallpapers.com/images/hd/hd-orange-wavelength-art-fbcwek67vdsjxlgv.jpg">
        <v-container>
          <v-row justify="center">

            <v-col ccols="12" sm="9" md="10" lg="10" xl="10">
              <productsoda></productsoda>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    </v-tabs-window-item>
    <!-- /////////////////////////////////////////////////////////////////////////////////////////////// -->
    <v-tabs-window-item value="four">
      <v-parallax src="https://wallpapers.com/images/hd/hd-orange-wavelength-art-fbcwek67vdsjxlgv.jpg">
        <v-container>
          <v-row justify="center">

            <v-col ccols="12" sm="9" md="10" lg="10" xl="10">
              <ProductEnergyDrink></ProductEnergyDrink>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    </v-tabs-window-item>
  </v-tabs-window>
  <v-container>
    <v-row>
      <v-col>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card v-bind="props" :color="isHovering ? 'primary' : undefined" title="Hover over me" class="mr-1 ml-1">Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque
              cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde
              voluptatem!</v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>


  <!-- //////////////////////////////////////////////////////////////////////////// -->





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
import ProductEnergyDrink from './productEnergyDrink.vue';


definePageMeta({
  middleware: ['auth', 'admin'],
});
const tab = ref(null);

</script>

<style scoped>
.fill-height {
  height: 100vh;
  /* Full screen height */
}
</style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Lao:wght@100..900&display=swap');

.noto-serif-lao {
  font-family: "Noto Serif Lao", serif;
  font-weight: 500;
  /* Adjust this value based on your requirement */
  font-style: normal;
  font-variation-settings:
    "wdth" 84.9;
}
</style>