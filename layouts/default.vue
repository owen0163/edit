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
  
          <template v-if="$vuetify.display.mdAndUp">
            <v-btn icon="mdi-magnify" variant="text"></v-btn>
  
            <v-btn icon="mdi-filter" variant="text"></v-btn>
          </template>
  
          <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
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
        <v-card-text>
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
  
      }),
  
      watch: {
        group () {
          this.drawer = false
        },
      },
    }
  </script>