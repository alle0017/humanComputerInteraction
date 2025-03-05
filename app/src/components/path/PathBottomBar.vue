<template>
      <div style="width: 100%; display: flex; justify-content: center;">
            <v-btn @click="openModal()" style="position: fixed; bottom: 100px;">
                  <template v-slot:prepend>
                        <v-icon icon="mdi-unfold-more-horizontal" color="background"/>
                  </template>
                  Apri Comandi
            </v-btn>
      </div>
      <v-bottom-sheet v-model="sheet"  height="300">
            <div class="bg-surface" style="display: flex; gap: 10px; padding: 2px;">
                  <v-btn @click="goNext()" variant="flat" style="padding-left: 10px;">
                        <template v-slot:prepend>
                              <v-icon icon="mdi-map-marker-radius" color="background"/>
                        </template>
                        Convalida Tappa
                  </v-btn>
                  <v-btn-secondary @click="sheet = false; $emit('stop')" style="padding-left: 10px;">
                        <template v-slot:prepend>
                              <v-icon icon="mdi-stop"/>
                        </template>
                        Ferma Sessione
                  </v-btn-secondary>
            </div>
            <v-card class="text-center">
                  <v-card-text>
                        <span v-html="text"></span>
                  </v-card-text>
            </v-card>
      </v-bottom-sheet>
</template>
<script>
import BooksList from '../book/BooksList.vue';
import { saveProgressAndRetrieve } from '../../db';
import { ref } from 'vue';
export default {
      props: ['session'],
      components: { BooksList },
      emits: ['next','stop'],
      data(){
            const text = ref('');

            return {
                  sheet: false,
                  text,
            } 
      },
      methods: {
            async goNext(){
                  this.text = await saveProgressAndRetrieve( 
                        this.session.book, 
                        this.session.chapter 
                  );
                  
                  this.$emit('next');
            },
            async openModal(){
                  if( !this.text ){
                        this.text = await saveProgressAndRetrieve( 
                              this.session.book, 
                              this.session.chapter 
                        );
                  }
                  this.sheet = true;
            }
      }
}
</script>