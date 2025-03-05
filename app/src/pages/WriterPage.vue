<template>
      <v-main>
      <div style="display: grid; margin: 10%;">
            <v-text-field
                  label="Titolo"
                  :rules="[required]"
                  :model-value="title"
            ></v-text-field>
            <v-text-field
                  label="Costo"
                  :rules="[required,numberOnly]"
                  :model-value="cost"
            ></v-text-field>
            <v-text-field
                  label="Tag"
                  placeholder="ex. tag1,tag2,tag3"
                  :model-value="tags"
            ></v-text-field>
            <v-text-field
                  label="Immagine"
                  :model-value="img"
            ></v-text-field>
            <v-expansion-panels>
                  <v-expansion-panel v-for="chapter,i in chapters" :key="i">
                        <v-expansion-panel-title 
                              collapse-icon="mdi-minus" 
                              expand-icon="mdi-plus">
                              Capitolo {{ i + 1 }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                              <v-textarea 
                                    variant="outlined"
                                    :model-value="chapter"
                              ></v-textarea>
                        </v-expansion-panel-text>
                  </v-expansion-panel>
            </v-expansion-panels>
      </div>
      </v-main>
</template>
<script lang="js">

export default {
      props: {
            chapters: {
                  type: Array,
                  default: [''],
            },
            title: {
                  type: String,
                  default: '',
            },
            tags: {
                  type: String,
                  default: '',
            },
            img: {
                  type: String,
            },
            cost: {
                  type: Number,
                  default: 0,
            }
      },
      data(){
            return {
                  /**
                   * @param {string} value 
                   */
                  required: value => !!value || 'Campo obbligatorio!',
                  /**
                  * @param {string} value 
                  */
                  numberOnly: value => Boolean(value.match(/[0-9]+/))  || 'Campo obbligatorio!'
            }
      }
}
</script>
<style>

</style>