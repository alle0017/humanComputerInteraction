<template>
      <div id="map" ref="map"></div>
      <PathPreview ref="preview"/>
</template>

<script lang="js">
import { ref, useTemplateRef } from 'vue';
import GeoMap from '../utilities/openlayer';
import PathPreview from '../components/path/PathPreview.vue';
import { getDefaultPaths } from '../db';
/**@import {Ref,ShallowRef} from 'vue' */
/**@import Feature from 'ol/Feature' */


export default {
      components: { PathPreview },
      setup(){
            return {
                  container: /**@type {ShallowRef<HTMLElement>}*/(useTemplateRef('map')),
                  ref: /**@type {ShallowRef<PathPreview>}*/(useTemplateRef('preview')),
            }
      },
      data(){
            const map = new GeoMap();
            /**
             * @type {Map<GeoLocation,DefaultPath>}
             */
            const paths = new Map();
            const defaultPaths = getDefaultPaths();

            for( let i = 0; i < defaultPaths.length; i++ ){
                  map.createMarker( defaultPaths[i].locations[0] );
                  paths.set( defaultPaths[i].locations[0], defaultPaths[i] );
            }

            map.onClick(( feature, loc ) => {
                  //@ts-ignore
                  this.ref.show( paths.get( loc ) );
            });

            navigator.geolocation.getCurrentPosition( p => {
                  map.centerTo( p.coords.longitude, p.coords.latitude );
            });

            return {
                  map,
                  paths,
            }
      },
      mounted(){
            this.container.append( this.map.root )
      },
      beforeUnmount(){
            this.map.free();
      },
      methods: {
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