import OLMap from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Icon from 'ol/style/Icon';
import { Vector } from 'ol/source';
import { Point, LineString } from 'ol/geom';
import View from 'ol/View.js';
import { useGeographic } from 'ol/proj';
import Feature from 'ol/Feature';
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorLayer from 'ol/layer/Vector';
/**@import {ShallowRef} from 'vue' */


// TODO 0.0009 100mt radius
export default class GeoMap {
      /**
       * @type {Icon}
       */
      static #markerIconActive;

      /**
       * @type {Style}
       */
      static #markerStyleActive;

      /**
       * @type {Icon}
       */
      static #markerIconInactive;

      /**
       * @type {Style}
       */
      static #markerStyleInactive;

      /**
       * @type {HTMLDivElement}
       */
      static #container;

      /**
       * @type {OLMap}
       */
      static #map;

      /**
       * @type {Map<Feature,GeoLocation>}
       */
      static #markerMap;

      /**
       * @type {VectorLayer}
       */
      static #pathLayer;

      /**
       * @type {Set<( f: Feature, g: GeoLocation ) => void>}
       */
      static #listeners;

      static #initialize(){

            useGeographic();

            this.#listeners = new Set();
            this.#markerMap = new Map();
            this.#markerIconActive = new Icon(({
                  src: './src/assets/marker-active.png',
                  width: 70,
                  height: 70,
            }));
            this.#markerStyleActive = new Style({
                  image: this.#markerIconActive,
            })
            this.#markerIconInactive = new Icon(({
                  src: './src/assets/marker-inactive.png',
                  width: 70,
                  height: 70,
            }));
            this.#markerStyleInactive = new Style({
                  image: this.#markerIconInactive,
            })
            this.#container = document.createElement('div');
            this.#container.style.width = 'inherit';
            this.#container.style.height = 'inherit';

            this.#map = new OLMap({
                  target: this.#container,
                  layers: [
                  new TileLayer({
                        source: new OSM(),
                        className: '--base__layer',
                  }),
                  ],
                  view: new View({
                        center: [9.188, 45.46],
                        zoom: 16,
                        minZoom: 10,
                  }),
            });


            this.#map.on('click', e => {
                  const features = /**@type {Feature[]}*/(this.#map.getFeaturesAtPixel( e.pixel ));

                  if( !features )
                        return;

                  const selected = this.#markerMap.get( features[0] );

                  if( !selected ){
                        return;
                  }

                  this.#listeners.forEach( f => f( features[0], selected ) );
            });
      }

      get root(){
            return GeoMap.#container;
      }

      constructor(){

            if( !GeoMap.#map )
                  GeoMap.#initialize();
      }
      /**
       * 
       * @param {GeoLocation} location
       */
      createMarker( location, inactive = true ){
            const markerGeometry = new Point([location.long, location.lat]);
            const markerFeature = new Feature({
                  geometry: markerGeometry,
            });

            markerFeature.setStyle(
                  inactive? GeoMap.#markerStyleActive: GeoMap.#markerStyleInactive
            );

            const vectorSource = new Vector({
                  features: [markerFeature]
            });

            const markerLayer = new VectorImageLayer({
                  visible: true,
                  source: vectorSource
            });

            GeoMap.#map.addLayer(markerLayer);
            GeoMap.#markerMap.set( markerFeature, location );
            markerLayer.setZIndex(100);

            return markerFeature;
      }
      /**
       * @param {GeoLocation[]} path 
       */
      connectLocations( path ){

            if( path.length <= 1 ){
                  GeoMap.#pathLayer.dispose();
                  GeoMap.#pathLayer = undefined;
                  return;
            }

            const featureLine = new Feature({
                  geometry: new LineString(
                        path.map( v => [v.long,v.lat])
                  )
            });

            const vectorLine = new Vector({
                  features: [featureLine]
            });

            const vectorLineLayer = new VectorLayer({
                  source: vectorLine,
                  style: new Style({
                        fill: new Fill({ color: '#5c2a2b', }),
                        stroke: new Stroke({ 
                              color: '#5c2a2b', 
                              width: 10, 
                              lineDash: [40, 40, 40],
                        })
                  })
            });

            GeoMap.#map.addLayer( vectorLineLayer );

            if( GeoMap.#pathLayer ){
                  GeoMap.#pathLayer.dispose();
            }

            GeoMap.#pathLayer = vectorLineLayer;
            GeoMap.#pathLayer.setZIndex(10);
      }

      /**
       * @param {Feature} feature 
       */
      setLocationAsActive( feature ){
            feature.setStyle( GeoMap.#markerStyleActive );
      }

      /**
       * @param {Feature} feature 
       */
      setLocationAsInactive( feature ){
            feature.setStyle( GeoMap.#markerStyleInactive );
      }

      free(){
            // remove only if it isn't the map
            GeoMap.#map.getLayers().forEach( l => l.getClassName() != '--base__layer' && l.dispose() );
            GeoMap.#listeners.clear();
            GeoMap.#container.remove();
      }

      /**
       * @param {(f: Feature, g: GeoLocation) => void} listener 
       */
      onClick( listener ){
            GeoMap.#listeners.add( listener );
      }

      /**
       * 
       * @param {number} long 
       * @param {number} lat 
       */
      centerTo( long, lat ){
            GeoMap.#map.getView().setCenter([long,lat])
      }
}