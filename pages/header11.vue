<template>
    <v-card>
      <v-layout>
        <v-app-bar
          color="orange-darken-3"
          prominent
        >
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  
          <v-toolbar-title >
            <v-btn href="/">Vendee</v-btn></v-toolbar-title>
  
          <v-spacer></v-spacer>
  
          <template v-if="$vuetify.display.mdAndUp"  >
     
     
    </template>
        </v-app-bar>
  
        <v-navigation-drawer
          v-model="drawer"
          :location="$vuetify.display.mobile ? 'bottom' : undefined"
          temporary
        >
          <v-list>
            <v-list-item href="/products">ຂໍ້ມູນສິນຄ້າ</v-list-item>
            <v-list-item href="/add" >ເພີ້ມມູນສິນຄ້າ</v-list-item>
            <v-list-item href="/about" >ຈັດການຂໍ້ມູນສິນຄ້າ</v-list-item>
            

          </v-list>
        </v-navigation-drawer>
    
        
     
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