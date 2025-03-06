<template>
  <div>
    <h2>Envoyer un fichier .xlsx</h2>
    <input type="file" @change="selectFile">
    <button @click="uploadFile">Envoyer</button>
    <h2>Liste des étudiants</h2>
    <pre v-if="response">{{ response }}</pre>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      response: null
    };
  },
  methods: {
    selectFile(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
      if (!this.file) {
        alert('Veuillez sélectionner un fichier');
        return;
      }
      const formData = new FormData();
      formData.append('file', this.file);

      try {
        const response = await fetch('http://localhost:8082/api/excel/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        this.response = await response.json();
      } catch (error) {
        console.error('Erreur lors de l\'envoi du fichier:', error);
        alert(`Erreur lors de l'envoi du fichier: ${error.message}`);
      }
    }
  }
};
</script>

<style scoped>
/* Add your CSS here */
</style>
