<template>
      <v-card width="80%" :height="400" style="margin: 10%;" color="secondary" rounded @click="$emit('click')">
            <v-card-title>
                  {{ title }}
            </v-card-title>
            <v-card-text>
                  {{ explanation }}
                  <v-img :src="image"/>
            </v-card-text>
      </v-card>
</template>
<script lang="js">
export default {
      props: ['type'],
      emits: ['click'],
      setup( props ){
            let title = '';
            let explanation = '';
            let image = '';
            
            switch( props.type ){
                  case 'narrative': {
                        title = 'Percorso Narrativo';
                        explanation = 'Immergiti in un mondo fantastico creato apposta per il tuo percorso. Ascolta la storia che abbiamo scelto per te sul percorso che più preferisci.';
                        image = './src/assets/castle.png';
                  }break;
                  case 'creative': {
                        title = 'Percorso Personalizzato';
                        explanation = 'Crea il tuo personalissimo percorso e ascolta la storia che più preferisci.';
                        image = './src/assets/mountains.png';
                  }break;
                  case 'interactive': {
                        title = 'Percorso Interattivo';
                        explanation = 'Partecipa ad una fantastica camminata arrichita da tantissimi minigiochi. Ancora più immersiva!';
                        image = './src/assets/gamepad.png';
                  }break;
                  default: {
                        throw new Error('undefined card type')
                  }
            }
            return {
                  title,
                  explanation,
                  image,
            }
      }
}
</script>
<style>

</style>