<template>
      <div id="map" ref="map"></div>
      <PathBottomBar :session="session" @next="validate()" @stop="stop()"/>
      <v-dialog v-model="isActive" max-width="500px" :persistent="true">
            <v-card>
                  <v-card-title style="text-transform: capitalize;" class="text-center">
                        
                  </v-card-title>
                  <v-card-text class="text-center">
                        <div style="display:  grid; justify-items: center;">
                              <v-icon :icon="modal.icon" size="70"/>
                              <span>
                                    {{ modal.title }}
                              </span>
                              <span>
                                    {{ modal.text }}
                                    <v-chip color="primary">
                                          {{ session.currentLocation + modal.bonus }}
                                    </v-chip>
                              </span>
                        </div>
                  </v-card-text>
                  <v-card-actions>
                        <v-btn variant="elevated" @click="endSession()">Chiudi</v-btn>
                  </v-card-actions>
            </v-card>
      </v-dialog>
</template>

<script lang="js">
import { ref, useTemplateRef } from 'vue';
import PathBottomBar from '../components/path/PathBottomBar.vue';
import GeoMap from '../utilities/openlayer';
import { endSession, getSession, updateSession } from '../db/session';
import { addSteps } from '../utilities/steps';
import { getDefaultPaths, saveProgressAndRetrieve, addResult } from '../db';
import { Marks } from '../test.config';
import router from '../plugins/router';
/**@import {Ref,ShallowRef} from 'vue' */
/**@import Feature from 'ol/Feature' */


export default {
      components: { PathBottomBar },
      setup(){
            return {
                  container: /**@type {ShallowRef<HTMLElement>}*/(useTemplateRef('map')),
            }
      },
      data(){
            const map = new GeoMap();
            const session = getSession();
            const features = [];

            for( let i = 0; i != session.path.length; i++ ){
                  features.push( map.createMarker( session.path[i], session.currentLocation > i ) );

                  if( i < session.currentLocation ){
                        map.setLocationAsActive( features[i] )
                  }
            }

            map.connectLocations( session.path );

            return {
                  map,
                  session,
                  features,
                  isActive: false,
                  modal: {
                        title: 'Peccato',
                        text: 'sarà per la prossima volta',
                        bonus: 0,
                        icon: 'mdi-emoticon-wink-outline',
                  }
            }
      },
      mounted(){
            this.container.append( this.map.root )
      },
      beforeUnmount(){
            this.map.free();
      },
      methods: {
            endSession(){
                  addResult( 
                        this.session.currentLocation,  
                        this.session.currentLocation == this.session.path.length
                  );
                  endSession();
                  router.push('/paths');
            },
            stop(){
                  this.isActive = true;
            },
            validate(){
                  this.session.chapter++;
                  this.session.currentLocation++;

                  addSteps( 
                        this.session.path[ this.session.currentLocation - 1 ],
                        this.session.path[ this.session.currentLocation ]
                  )

                  updateSession( 
                        this.session.book, 
                        this.session.chapter, 
                        this.session.path, 
                        this.session.currentLocation, 
                        this.session.group 
                  );

                  if( this.features[this.session.currentLocation] ){
                        //@ts-ignore
                        this.map.setLocationAsActive( this.features[this.session.currentLocation] )
                  }

                  if( this.session.currentLocation >= this.session.path.length - 1 ){
                        this.modal.bonus = 10;
                        this.modal.icon = 'mdi-emoticon-cool-outline';
                        this.modal.title = 'Complimenti!!!';
                        this.modal.text = 'Hai finito un\'altra sfida, continua così.';
                        this.isActive = true;
                  }
            }
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