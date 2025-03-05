<template>
      <v-bottom-sheet v-model="sheet" :persistent="true">
            <v-card class="text-center" height="200">
                  <template v-slot:prepend>
                        <v-btn icon="mdi-arrow-left" variant="text" @click="sheet = false;"></v-btn>
                  </template>
                  <v-card-text>
                        <books-list 
                              mode="selectable" 
                              title="storie disponibili" 
                              :books="books"
                              @detail-request="startSession( $event )"
                        />
                        <v-chip color="primary">
                              <v-icon icon="mdi-clock" start></v-icon>
                              richiede {{ neededTime }} ore
                        </v-chip>
                        <v-timeline align="start" side="end" style="margin-top: 50px">
                              <v-timeline-item 
                                    v-for="location in locations" 
                                    fill-dot 
                                    dot-color="secondary" 
                                    icon="mdi-castle" 
                                    icon-color="background"
                                    style="text-transform: capitalize;">

                                    {{ location.location }}
                              </v-timeline-item>
                        </v-timeline>
                  </v-card-text>
            </v-card>
      </v-bottom-sheet>
</template>
<script>
import BooksList from '../book/BooksList.vue';
import { getBooksFromTitle } from '../../db';
import { FBUser } from '../../db';
import { updateSession } from '../../db/session';
export default {
      components: { BooksList },
      data: () => ({
            sheet: false,
            neededTime: 0,
            /**
             * @type {GeoLocation[]}
             */
            locations: [],
             /**
             * @type {Book[]}
             */
            books: [],
      }),
      methods: {
            /**
             * @param {DefaultPath} path 
             */
            async show( path ){
                  this.sheet = true;
                  this.locations = path.locations;
                  this.books = await getBooksFromTitle( path.stories );
                  this.neededTime = path.neededTime;
            },
            /**
             * @param {Book} book 
             */
            async startSession( book ){
                  const progress = await FBUser.get().getProgress( book.title );

                  updateSession( 
                        book.title, 
                        progress.chapter, 
                        this.locations, 
                        0, 
                        false 
                  );
                  this.$router.push('/session');
            },
      }
}
</script>