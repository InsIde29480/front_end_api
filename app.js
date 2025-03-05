const App = {
  data() {
    return {
      file: null,
      response: null
    };
  },
  template: `
    <div>
      <input type="file" @change="selectFile">
      <button @click="uploadFile">Envoyer</button>
      <pre v-if="response">{{ response }}</pre>
    </div>
  `,
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
        const response = await fetch('http://localhost:8080/api/excel/upload', {
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

// Création et montage de l'application Vue
Vue.createApp(App).mount('#app');
