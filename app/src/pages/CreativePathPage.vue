<template>
      <ComposablePathMap 
            :markers="markers"
            @selected="selectStory( $event )"
            />
      <StorySelectionModal 
            ref="modal"
            :is-active="isActive"
            @selected="startSession($event)"
      />
</template>
<script lang="js">
/**@import { ShallowRef } from 'vue'*/;
import ComposablePathMap from '../components/path/ComposablePathMap.vue';
import StorySelectionModal from '../components/StorySelectionModal.vue';
import { getMarks } from '../db';
import { ref, useTemplateRef, } from 'vue';
import { updateSession } from '../db/session';
import { FBUser } from '../db';
export default {
      components: {
            ComposablePathMap,
            StorySelectionModal,
      },
      setup(){
            return {
                  isActive: ref(false),
            }
      },
      data(){
            return {
                  markers: getMarks(),
                  /**
                   * @type {GeoLocation[]}
                   */
                  path: [],
            }
      },
      methods: {
            /**
             * @param {Book} book 
             */
            async startSession( book ){
                  const progress = await FBUser.get().getProgress( book.title );

                  updateSession( 
                        book.title, 
                        progress.chapter, 
                        this.path, 
                        0, 
                        false 
                  );
                  this.$router.push('/session');
            },
            /**
             * @param {GeoLocation[]} path
             */
            selectStory( path ){
                  this.path = path;
                  //@ts-ignore
                  this.$refs.modal.show( 
                        path.map( 
                              /**@param {GeoLocation} pos*/pos => pos.tags )
                        .flat() 
                  );
            }
      }
}
</script>
<style>

</style>