<template>
      <div id="map"></div>
      <v-btn 
            v-if="path.length > 1" 
            variant="elevated" 
            style="position: fixed; left: 15%; bottom: 100px; width: 70%;"
            @click="$emit('selected', path )">
            Continua
      </v-btn>
      <v-dialog v-model="isActive" max-width="500px" :persistent="true">
            <v-card>
                  <v-card-title style="text-transform: capitalize;">
                        {{ location?.location }}
                  </v-card-title>
                  <v-card-text>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                              <v-chip v-for="tag in location.tags" :key="tag" color="primary">
                                    @{{ tag }}
                              </v-chip>
                        </div>
                  </v-card-text>
                  <v-card-actions>
                        <v-btn variant="elevated" @click="selectCurrentMark()">{{ btnText }}</v-btn>
                        <v-btn-secondary @click.stop="isActive = false">Chiudi</v-btn-secondary>
                  </v-card-actions>
            </v-card>
      </v-dialog>
</template>

<script lang="js">
import { ref, useTemplateRef } from 'vue';
import GeoMap from '../../utilities/openlayer';
/**@import {Ref,ShallowRef} from 'vue' */
/**@import Feature from 'ol/Feature' */


export default {
      props: ['markers'],
      data(){
            const map = new GeoMap();
            /**
             * @type {GeoLocation[]}
             */
            const path = [];
            /**
             * @type {Feature}
             */
            let selectedFeature = undefined;
            /**
             * @type {Ref<GeoLocation|undefined>}
             */
            const location = ref();
            const isActive = ref(false);
            /**
             * @type {Ref<'Aggiungi'|'Rimuovi'>}
             */
            const btnText = ref('Aggiungi');

            if( !this.markers || !(this.markers instanceof Array))
                  throw new Error('incorrect marker array type');

            for( let i = 0; i < this.markers.length; i++ ){
                  map.createMarker( this.markers[i] );
            }

            return {
                  path,
                  /**
                   * @type {Feature}
                   */
                  selectedFeature,
                  /**
                   * @type {Ref<GeoLocation|undefined>}
                   */
                  location,
                  isActive,
                  /**
                   * @type {Ref<'Aggiungi'|'Rimuovi'>}
                   */
                  btnText,
                  map,
            }
      },
      mounted(){
            const container = document.getElementById('map');

            container.append( this.map.root )

            this.map.onClick(( feature, loc ) => {
                  if( this.path.indexOf( loc ) >= 0 ){
                        this.btnText = 'Rimuovi';
                  }else {
                        this.btnText = 'Aggiungi';
                  }

                  this.selectedFeature = feature;
                  this.location = loc;
                  this.isActive = true;
            })
      },
      beforeUnmount(){
            this.map.free();
      },
      methods: {
            selectCurrentMark(){
                  if( !this.location )
                        return;

                  this.isActive = false;

                  if( this.path.indexOf( this.location ) >= 0 ){
                        this.path.splice(
                              this.path.indexOf( this.location ),
                              1
                        );
                        this.map.setLocationAsActive( /**@type {Feature}*/(this.selectedFeature) );
                  }else{
                        this.path.push( this.location );
                        this.map.setLocationAsInactive( /**@type {Feature}*/(this.selectedFeature) );
                  }

                  this.map.connectLocations( this.path );
            },
      }
}
</script>

<style>
#map {
      width: 100%;
      height: 100vh;
      overflow: scroll;
}
</style>