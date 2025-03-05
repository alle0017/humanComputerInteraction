<template>
      <v-main>
            <PathCard type="creative" @click="router.push('/creative-paths')"/>
            <PathCard type="narrative" @click="router.push('/narrative-paths')"/>
            <PathCard type="interactive"/>
      </v-main>
</template>
<script lang="js">
import PathCard from '../components/path/PathCard.vue';

export default {
      components: {
            PathCard
      },
      data(){
            return {
                  router: this.$router,
            }
      }
}
</script>
<style>

</style>