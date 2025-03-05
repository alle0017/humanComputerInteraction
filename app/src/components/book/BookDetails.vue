<template>
      <suspense>
      <div style="display: grid; margin-top: 100px; justify-content: center; gap: 50px;">
            <div style="display: flex; width: 100%; max-width: 100vw; height: 300px; overflow: hidden; justify-content: center;">
                  <img :src="img" height="300"/>
            </div>
            <v-card>
                  <v-card-title style="text-transform: capitalize;">
                        {{ title }}
                  </v-card-title>
                  <v-card-subtitle>
                        {{ author }}
                  </v-card-subtitle>
                  <v-card-text>
                        <div style="display: grid; gap: 15px;">
                              <v-btn v-if="cost >= 0" @click="$emit('buy')">
                                    Acquista 
                                    {{ cost }}
                              </v-btn>
                              <v-btn v-else-if="selectable" @click="$emit('selected')">
                                    Scegli
                              </v-btn>
                              <div style="display: flex; gap: 10px;">
                                    <v-icon icon="mdi-clock"/>
                                    <span> tempo di ascolto: {{ hourPassed }} ore</span>
                              </div>
                              <div style="display: flex; gap: 10px;">
                                    <v-icon icon="mdi-poll"/>
                                    <span> completato al {{ (progress*100).toFixed(2) }}%</span>
                              </div>
                        </div>
                  </v-card-text>
            </v-card>

            <v-expansion-panels>
                  <v-expansion-panel>
                        <v-expansion-panel-title collapse-icon="mdi-minus" expand-icon="mdi-plus">Leggi La Storia</v-expansion-panel-title>
                        <v-expansion-panel-text>
                              <span v-html="text"></span>
                        </v-expansion-panel-text>
                  </v-expansion-panel>
            </v-expansion-panels>

            <div style="display: grid; gap: 20px;">
                  <div class="title">
                        Recensioni
                  </div>
                  <div>
                        <v-list v-if="reviews.length > 0">
                              <v-list-item v-for="r,i in reviews" :key="i">
                                    <v-list-item-title>
                                          <v-rating
                                          disabled
                                          :length="5"
                                          :size="32"
                                          :model-value="r.star"
                                          active-color="primary"
                                          empty-icon="mdi-star-outline"
                                          full-icon="mdi-star"
                                          />
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                          {{ r.text }}
                                    </v-list-item-subtitle>
                              </v-list-item>
                        </v-list>
                        <v-card color="secondary" v-else>
                              <v-card-text>
                                    Nessuna recensione disponibile
                              </v-card-text>
                        </v-card>
                  </div>
            </div>
      </div>
      </suspense>
</template>
<script>
import { getReviewForBook, getBookUserData, } from "../../db/index"

export default {
      props: ['img', 'title', 'author', 'cost', 'chapters', 'selectable' ],
      emits: ['selected', 'buy'],
      async setup( props ){
            const { chapter, hourPassed, text } = await getBookUserData( props.title );
            const reviews = await getReviewForBook( props.title );

            return {
                  reviews,
                  progress: chapter/props.chapters,
                  hourPassed,
                  text,
            }
      }
}
</script>