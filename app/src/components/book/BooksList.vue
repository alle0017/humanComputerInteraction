<template>
      <div style="display: grid;">
            <span style="text-transform: capitalize; font-size: 18px; margin-bottom: 50px;">{{ title }}</span>
            <v-slide-group show-arrows next-icon="mdi-menu-right" prev-icon="mdi-menu-left" v-if="books.length > 0">
                  <v-slide-group-item v-for="book in books" :key="book.title">
                        <v-card class="ma-4" color="secondary" @click="showDetails( book )">
                              <Book :title="book.title" :cost="mode == 'buy'? book.cost: -1" :img="book.img" class="pa-4"/>
                        </v-card>
                  </v-slide-group-item>
            </v-slide-group>
            <v-card color="primary" v-else>
                  <v-card-text>
                        Nessun libro disponibile in questa sezione
                  </v-card-text>
            </v-card>
      </div>
</template>
<script>
import Book from './Book.vue';
import { ref } from 'vue';
export default {
      props: ['books','mode','title'],
      components: { Book, },
      emits: ['detail-request'],
      data(){
            if( this.mode && this.mode != 'selectable' && this.mode != 'buy' && this.mode != 'none' )
                  throw new Error('incorrect mode value')
            return {
                  userData: ref({
                        hours: 0,

                  })
            }
      },

      methods: {
            /**
             * @param {Book} book 
             */
            showDetails( book ){ 
                  if( this.mode != 'buy' ){
                        this.$emit( 'detail-request', {
                              ...book,
                              cost: -1,
                        });
                  }else{
                        this.$emit( 'detail-request', book );
                  }
            }
      }
}
</script>