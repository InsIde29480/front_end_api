const Parser_etudiant = {
  data() {
    return {
      file: null,
      response: null
    };
  },
  template: `
    <div>
      <h1>Parser Etudiant</h1>
      <h2>envoyer un fichier .xlsx</h2>
      <input type="file" @change="selectFile">
      <button @click="uploadFile">Envoyer</button>
      <h2>liste des étudiants</h2>
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

// Application Vue.js pour interagir avec l'API des années académiques
const Annee_academique = {
  data() {
    return {
      annees: [], // Stocke la liste des années académiques
      nouvelleAnnee: '', // Stocke la nouvelle année académique à ajouter
      message: '' // Stocke les messages d'erreur ou de succès
    };
  },
  mounted() {
    this.getAnneesAcademiques(); // Charge les années académiques au démarrage
  },
  template: `
    <div>
      <h1>Gestion des Années Académiques</h1>
      
      <h2>Ajouter une année académique</h2>
      <input v-model="nouvelleAnnee" placeholder="Ex: 2025/2026">
      <button @click="addAnneeAcademique">Ajouter</button>
      
      <h2>Liste des années académiques</h2>
      <ul>
        <li v-for="annee in annees" :key="annee.id">
          {{ annee.code }}
          <button @click="deleteAnneeAcademique(annee.id)">Supprimer</button>
        </li>
      </ul>
      
      <p v-if="message">{{ message }}</p>
    </div>
  `,
  methods: {
    async getAnneesAcademiques() {
      try {
        const response = await fetch('http://localhost:8080/annees-academiques');
        this.annees = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      }
    },
    async addAnneeAcademique() {
      if (!this.nouvelleAnnee) {
        this.message = "Veuillez entrer une année académique.";
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/annees-academiques', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: this.nouvelleAnnee })
        });
        if (response.ok) {
          this.message = "Année ajoutée avec succès!";
          this.nouvelleAnnee = '';
          this.getAnneesAcademiques(); // Rafraîchir la liste
        } else {
          this.message = "Erreur lors de l'ajout.";
        }
      } catch (error) {
        console.error('Erreur:', error);
        this.message = "Erreur de connexion avec l'API.";
      }
    },
    async deleteAnneeAcademique(id) {
      try {
        const response = await fetch(`http://localhost:8080/annees-academiques/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          this.message = "Année supprimée avec succès!";
          this.getAnneesAcademiques();
        } else {
          this.message = "Erreur lors de la suppression.";
        }
      } catch (error) {
        console.error('Erreur:', error);
        this.message = "Erreur de connexion avec l'API.";
      }
    }
  }
};

// Création et montage de l'application Vue
Vue.createApp(Parser_etudiant).mount('#Parser_etudiant');
Vue.createApp(Annee_academique).mount('#Annee_academique');