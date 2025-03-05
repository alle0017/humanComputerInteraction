<template>
      <v-main>
            <v-tabs
                  v-model="tabs"
                  color="primary"
                  grow
                  height="60"
                  style="margin-top: 10px;"
            >
                  <v-tab
                        :value="1"
                  >
                        <v-icon icon="mdi-bookshelf" size="50"></v-icon>
                  </v-tab>

                  <v-tab
                        :value="2"
                  >
                        <v-icon icon="mdi-shopping" size="50"></v-icon>
                  </v-tab>
            </v-tabs>
            <v-tabs-window v-model="tabs">
                  <v-tabs-window-item :value="1">
                        <v-card>
                              <v-card-text>
                                    <BooksList 
                                          :books="liked" 
                                          mode="selectable" 
                                          title="preferiti" 
                                          style="margin-top: 20px;"
                                          @detail-request="$refs.dialog.show( $event )"
                                    />
                                    <BookGrid 
                                          :books="all" 
                                          mode="selectable" 
                                          title="i miei libri" 
                                          style="margin-top: 20px;"
                                          @detail-request="$refs.dialog.show( $event )"
                                    />
                              </v-card-text>
                        </v-card>
                  </v-tabs-window-item>
                  <v-tabs-window-item :value="2">
                        <v-card>
                              <v-card-text>
                                    <v-autocomplete
                                          label="Cerca"
                                          variant="outlined"
                                          menu-icon="mdi-menu-down"
                                          :items="market"
                                          ref="input"
                                          @input="filter($refs.input.filteredItems)"
                                    ></v-autocomplete>
                                    <BookGrid 
                                          :books="market" 
                                          mode="buy" 
                                          title="Negozio" 
                                          style="margin-top: 20px;"
                                          @detail-request="$refs.dialog.show( $event )"
                                    />
                              </v-card-text>
                        </v-card>
                  </v-tabs-window-item>
            </v-tabs-window>
            <BookDetailsDialog ref="dialog" @buy="buy($event)"/>
      </v-main>
</template>
<script lang="js">
import BooksList from '../components/book/BooksList.vue';
import BookGrid from '../components/book/BookGrid.vue';
import BookDetailsDialog from '../components/book/BookDetailsDialog.vue';
import { getAllUserBooks, getLikedBooks, getMarketBooks, buyBook } from '../db';
import { useTemplateRef, ref } from 'vue';
/**@import {ShallowRef} from vue */

export default {
      components: {
            BooksList,
            BookGrid,
            BookDetailsDialog,
      },
      async setup(){
            const marketAll = await getMarketBooks();
            return { 
                  market: ref( marketAll ),
                  marketAll,
            }
      },
      data(){
            return {
                  // @ts-ignore
                  tabs: null,
                  liked: getLikedBooks(),
                  all: getAllUserBooks(),
            }
      },
      methods: {
            /**
             * @param {{value: string}[]} filters
             */
            filter( filters ){
                  //@ts-ignore
                  if( !filters || !filters.length || !this.$refs.input.value ){
                        this.market = this.marketAll;
                  }else{
                        const filtered = filters.map( f => f.value );
                        this.market = this.marketAll.filter( b => filtered.indexOf( b.title ) >= 0 );
                  }
            },
            /**
             * @param {Book} book 
             */
            async buy( book ){
                  try {
                        const flag = await buyBook( book.title, book.cost );

                        if( !flag )
                              throw new Error('failed')

                        const idx = this.marketAll.findIndex( b => b.title == book.title );

                        this.marketAll.splice( idx, 1 );
                        this.market = this.marketAll;
                  }catch(e){

                  }
            }
      }
}
</script>
<style>

</style>