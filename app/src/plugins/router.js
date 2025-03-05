import { createMemoryHistory, createRouter } from 'vue-router'
import PathsPage from "../pages/PathsPage.vue"
import CreativePathPage from "../pages/CreativePathPage.vue"
import NarrativePathPage from '../pages/NarrativePathPage.vue';
import SessionPage from '../pages/SessionPage.vue';
import ActivityPage from '../pages/ActivityPage.vue';
import LibraryPage from '../pages/LibraryPage.vue';
import WriterPage from '../pages/WriterPage.vue';

const routes = [
      { 
            path: '/', 
            component: PathsPage,
            name: 'Percorsi',
      },
      { 
            path: '/paths', 
            component: PathsPage,
            name: 'Percorsi',
      },{ 
            path: '/creative-paths', 
            component: CreativePathPage,
            name: 'Percorso Personalizzato',
      },{ 
            path: '/narrative-paths', 
            component: NarrativePathPage,
            name: 'Percorso Narrativo',
      },{ 
            path: '/session', 
            component: SessionPage,
            name: 'Passeggiata',
      },{ 
            path: '/activity', 
            component: ActivityPage,
            name: 'Attività',
      },{ 
            path: '/library', 
            component: LibraryPage,
            name: 'Libreria',
      },{ 
            path: '/writer', 
            component: WriterPage,
            name: 'Sezione Scrittore',
      },

]

export default createRouter({
      history: createMemoryHistory(),
      routes,
});