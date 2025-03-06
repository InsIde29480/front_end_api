<template>
  <div id="app">
    <ParserEtudiant />
    <AnneeAcademique />
    <AppMessages />
  </div>
</template>

<script>
import ParserEtudiant from './components/ParserEtudiant.vue';
import AnneeAcademique from './components/AnneeAcademique.vue';
import AppMessages from './components/AppMessages.vue';

export default {
  name: 'App',
  components: {
    ParserEtudiant,
    AnneeAcademique,
    AppMessages
  }
};
</script>

<style>
/* Global styles for App.vue */
</style>
