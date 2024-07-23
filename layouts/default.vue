<template>
    <v-card>
      <v-layout>
        <v-app-bar
          color="orange-darken-3"
          prominent
        >
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  
          <v-toolbar-title>Vendee</v-toolbar-title>
  
          <v-spacer></v-spacer>
  
          <template v-if="$vuetify.display.mdAndUp"  >
     
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>
        </v-app-bar>
  
        <v-navigation-drawer
          v-model="drawer"
          :location="$vuetify.display.mobile ? 'bottom' : undefined"
          temporary
        >
          <v-list>
            <v-list-item href="/">ຂໍ້ມູນສິນຄ້າ</v-list-item>
            <v-list-item href="/about" >ຈັດການຂໍ້ມູນສິນຄ້າ</v-list-item>

          </v-list>
        </v-navigation-drawer>
  
      
        <v-main >
        <v-card-text  :search="search">
          <slot />
        </v-card-text>
      </v-main>
                  
        
     
      </v-layout>
     
    </v-card>
   
  </template>
  <script>
    export default {
      data: () => ({
        drawer: false,
        group: null,
        search: '',
  
      }),
  
      watch: {
        group () {
          this.drawer = false
        },
      },
    }
  </script>