<template>
      <suspense>
      <v-dialog v-model="active" min-width="100%" min-height="100%" :persistent="true">
            <v-card>
                  <v-card-title>
                        <v-app-bar :elevation="0" style="position: fixed; top: 0;">
                              <template v-slot:prepend>
                                    <v-btn icon="mdi-arrow-left" @click="active=false"></v-btn>
                              </template>
                         </v-app-bar>
                  </v-card-title>
                  <v-card-text>
                        <BookDetails 
                              :title="book.title" 
                              :img="book.img" 
                              :author="book.author" 
                              :cost="book.cost"
                              :chapters="book.chapter"
                              :selectable="selectable"
                              @selected="$emit('selected', book )"
                              @buy="active = false; $emit('buy', book )"
                        />
                  </v-card-text>
            </v-card>
      </v-dialog>
      </suspense>
</template>
<script>
import BookDetails from './BookDetails.vue';
import { ref } from 'vue';
/**@import { Ref } from 'vue';*/


export default {
      components: { BookDetails, },
      props: ['selectable'],
      emits: ['selected','buy'],
      data(){
            return {
                  active: ref(false),
                  /**
                   * @type {Ref<Book>}
                   */
                  book: ref({
                        title: '',
                        img: '',
                        author: '',
                        cost: 0,
                        chapter: 1,
                        tags: [],
                  }),
            }
      },

      methods: {
            /**
             * 
             * @param {Book} book 
             */
            show( book ){ 
                  this.active = true;
                  this.book = book;
            }
      }
}
</script>