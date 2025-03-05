<template>
      <v-main>
            <div style="display: grid; justify-content: center; padding-top: 20px; margin-bottom: 20px;">
                  <v-progress-circular
                        :model-value="value/100"
                        :rotate="0"
                        :size="300"
                        :width="30"
                        color="primary"
                  >
                        <v-chip append-icon="mdi-shoe-print" style="font-size: 18px;">
                              {{ value }} 
                        </v-chip>
                  </v-progress-circular>
            </div>
            <v-card height="120" width="80%" style="margin-left: 10%;" color="secondary" prepend-icon="mdi-information">
                  <template v-slot:prepend>
                        <v-icon color="surface"></v-icon>
                  </template>
                  <v-card-text>
                        raccogliamo i dati raccolti solo dall'applicazione. 
                        Potresti aver fatto molti più passi!
                  </v-card-text>
            </v-card>
            <div style="display: grid; justify-content: center; padding-top: 50px;">
                  <v-btn 
                        prepend-icon="mdi-medal" 
                        v-if="pathReward || writerReward || teamReward || yearReward"
                        @click="getAllRewards()">
                        <template v-slot:prepend>
                              <v-icon color="surface"></v-icon>
                        </template>
                        Riscatta le ricompense
                  </v-btn>
                  <div style="display: grid; justify-items: center;" v-if="!pathReward && !writerReward && !teamReward && !yearReward">
                        <v-icon icon="fa:fas fa-sack-xmark" size="50"/>
                        <span>
                              Nessuna ricompensa disponibile
                        </span>
                  </div>
                  <v-list lines="one" style="margin-top: 20px;">
                        <v-list-item
                              v-if="pathReward"
                              prepend-icon="fa:fas fa-person-running"
                              title="Campione Della Strada"
                              :subtitle="'fai almeno '+ next + ' percorsi'"
                        ></v-list-item>
                        <v-list-item
                              v-if="yearReward"
                              prepend-icon="fa:fas fa-champagne-glasses"
                              title="Fantasioso Assiduo"
                              subtitle="Sei stato con noi un altro anno!"
                        ></v-list-item>
                        <v-list-item
                              v-if="teamReward"
                              prepend-icon="fa:fas fa-people-group"
                              title="Gioco Di Squadra"
                              subtitle="Hai partecipato a una sessione di squadra"
                        ></v-list-item>
                        <v-list-item
                              v-if="writerReward"
                              prepend-icon="fa:fas fa-hat-wizard"
                              title="Mago Scrittore"
                              subtitle="Hai scritto il tuo primo racconto"
                        ></v-list-item>
                  </v-list>
            </div>
      </v-main>
</template>
<script>
import { getSteps, } from '../utilities/steps';
import { getAllRewards, getTeamRewards, getPathRewards, getYearUsageRewards, getNextPathRewards, getWriterRewards } from '../utilities/rewards';


export default {
      data(){
            return {
                  value: getSteps(),
                  next: getNextPathRewards(),
                  pathReward: getPathRewards(),
                  yearReward: getYearUsageRewards(),
                  writerReward: getWriterRewards(),
                  teamReward: getTeamRewards(),
                  getAllRewards,
            }
      }
}
</script>