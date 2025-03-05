<template>
      <v-dialog v-model="active" min-width="100%" min-height="100%" :persistent="true">
            <v-card>
                  <v-card-title>
                        <v-app-bar :elevation="0" style="position: fixed; top: 0;">
                              <template v-slot:prepend>
                                    <v-btn icon="mdi-arrow-left" @click="active=false"></v-btn>
                              </template>
                              <v-app-bar-title>
                                    Scegli Una Storia
                              </v-app-bar-title>
                         </v-app-bar>
                  </v-card-title>
                  <v-card-text>
                        <BooksList 
                              :books="suggested" 
                              mode="selectable" 
                              title="consigliati" 
                              style="margin-top: 64px;"
                              @detail-request="dialog.show( $event )"
                        />
                        <BooksList 
                              :books="liked" 
                              mode="selectable" 
                              title="preferiti" 
                              style="margin-top: 64px;"
                              @detail-request="dialog.show( $event )"
                        />
                        <BooksList 
                              :books="all" 
                              mode="selectable" 
                              title="tutti" 
                              style="margin-top: 64px;"
                              @detail-request="dialog.show( $event )"
                        />
                        <BookDetailsDialog 
                              ref="dialog" 
                              :selectable="true"
                              @selected="$emit('selected', $event)"
                        />
                  </v-card-text>
            </v-card>
      </v-dialog>
</template>
<script lang="js">
import BooksList from './book/BooksList.vue';
import BookDetailsDialog from './book/BookDetailsDialog.vue';
import { ref, computed, useTemplateRef } from 'vue';
import { getLikedBooks, getAllUserBooks, getBookWithTags, } from '../db';
/**@import {ShallowRef} from vue */

export default {
      components: { BooksList, BookDetailsDialog, },
      emits: ['selected'],
      setup(){
            return { 
                  dialog: /**@type {Readonly<ShallowRef<typeof BookDetailsDialog>>}*/(useTemplateRef('dialog'))
            }
      },
      data(){
            const all = getAllUserBooks();
            return {
                  active: ref(false),
                  liked: getLikedBooks(),
                  all,
                  suggested: ref( all.value ),
            }
      },
      methods: {
            /**
             * 
             * @param {string[]} tags
             */
            async show( tags ){
                  this.active = true;
                  this.suggested = await getBookWithTags( tags );
            }
      }
}
</script>
<style>

</style>