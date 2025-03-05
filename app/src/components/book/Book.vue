<template>
      <div style="display: grid; justify-content: center; padding: 20px; gap: 20px;">
            <div style="width: 100px; height: 150px; overflow: hidden;">
                  <img :src="img" height="150"/>
            </div>
            <div>
                  <v-chip v-if="cost >= 0" :text="cost > 0? cost+'': 'gratis'" density="compact" append-icon="mdi-hand-coin">
                  </v-chip>
            </div>
      </div>
</template>
<script>
export default {
      props: ['title', 'img', 'cost'],
}
</script>