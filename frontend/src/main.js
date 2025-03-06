import { createApp } from 'vue';
import App from './App.vue'; // This is your root component
import ParserEtudiant from './components/ParserEtudiant.vue'; // Your ParserEtudiant component
//import AnneeAcademique from './components/AnneeAcademique.vue'; // Your AnneeAcademique component
import AppMessages from './components/AppMessages.vue'; // Your AppMessages component

const app = createApp(App);

// Register components globally (optional, if you want to use them throughout the app)
app.component('ParserEtudiant', ParserEtudiant);
//app.component('AnneeAcademique', AnneeAcademique);
app.component('AppMessages', AppMessages);

// Mount the Vue app to the #app element
app.mount('#app');
