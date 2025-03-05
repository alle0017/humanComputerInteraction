<template>
      <v-app style="color: primary;">
            <v-app-bar :elevation="2">
                  <v-app-bar-title>
                        <v-chip append-icon="mdi-hand-coin">
                              {{ user.coins }}
                        </v-chip>
                  </v-app-bar-title>
                  <template v-slot:append>
                        
                        <v-chip append-icon="mdi-arm-flex">
                              Livello {{ user.lvl }}
                        </v-chip>
                        <v-btn icon="mdi-account"></v-btn>
                  </template>
            </v-app-bar>
            <Suspense>
                  <RouterView />
            </Suspense>
            <v-bottom-navigation mode="shift" v-show="bottomBarModel">
                  <v-btn value="paths" @click="router.push('/paths')">
                        <v-icon icon="mdi-map-marker" color="primary"></v-icon>
                        <span>Percorsi</span>
                  </v-btn>

                  <v-btn value="library" @click="router.push('/library')">
                        <v-icon icon="mdi-library" color="primary"></v-icon>
                        <span>Libreria</span>
                  </v-btn>

                  <v-btn value="activity" @click="router.push('/activity')">
                        <v-icon icon="mdi-trophy-variant" color="primary"/>
                        <span>Attività</span>
                  </v-btn>
                  <v-btn value="friends">
                        <v-icon icon="mdi-account-group" color="primary"/>
                        <span>Amici</span>
                  </v-btn>
            </v-bottom-navigation>
      </v-app>
</template>
<script lang="js">
import router from './plugins/router';
import { useUserData } from './db';
import { isInSession } from './db/session';
import { ref } from 'vue';
import { FBUser } from './db/index';

export default {
      data(){

            const auth = FBUser.get()
            auth.login('andrea@vincyevivi.com','ciao01');

            const bottomBarModel = ref(true);

            if( isInSession() )
                  router.push('/session')
            else
                  router.push('/paths');

            router.beforeEach( to => {
                  if( to.path == '/session' ){
                        bottomBarModel.value = false;
                  }else{
                        bottomBarModel.value = true;
                  }
            });

            return {
                  user: auth.get(),
                  router,
                  bottomBarModel,
            }
      },
}
</script>
<style>

</style>