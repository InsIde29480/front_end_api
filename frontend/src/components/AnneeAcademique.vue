<template>
  <div>
    <!-- Section Gestion des Années Académiques -->
    <h2>Gestion des Années Académiques</h2>

    <!-- Ajouter une année académique -->
    <div>
      <h3>Ajouter une année académique</h3>
      <input v-model="anneeAcademicName" placeholder="Nom de l'année académique">
      <input v-model="startYear" placeholder="Année de début">
      <input v-model="endYear" placeholder="Année de fin">
      <button @click="addAnneeAcademic">Ajouter</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>

    <!-- Liste des années académiques -->
    <div>
      <h3>Années Académiques Existantes</h3>
      <button @click="fetchAnneeAcademiques">Charger les années académiques</button>
      <pre v-if="response">{{ response }}</pre>
        <ul>
          <li v-for="annee in anneesAcademiques" :key="annee.id">
            <p><strong>ID :</strong> {{ anneeAcademicName }}</p>
            <p><strong>Nom :</strong> {{ annee.nom }}</p>
            <p><strong>Année de début :</strong> {{ annee.debut }}</p>
            <p><strong>Année de fin :</strong> {{ annee.fin }}</p>
            <button @click="selectAnneeAcademic(annee.id)">Sélectionner</button>
            <button @click="deleteAnneeAcademic(annee.id)">Supprimer</button>
          </li>
        </ul>
    </div>

    <!-- Mettre à jour une année académique -->
    <div v-if="selectedAnneeId">
      <h3>Mettre à jour une année académique</h3>
      <input v-model="updateAnneeAcademicName" placeholder="Nouveau nom de l'année académique">
      <input v-model="updateStartYear" placeholder="Nouvelle année de début">
      <input v-model="updateEndYear" placeholder="Nouvelle année de fin">
      <button @click="updateAnneeAcademic">Mettre à jour</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      anneeAcademicName: '', // Nom de l'année académique à ajouter
      startYear: '', // Année de début
      endYear: '', // Année de fin
      anneesAcademiques: [], // Liste des années académiques
      selectedAnneeId: null, // ID de l'année académique sélectionnée
      updateAnneeAcademicName: '', // Nom pour la mise à jour
      updateStartYear: '', // Année de début pour la mise à jour
      updateEndYear: '', // Année de fin pour la mise à jour
      errorMessage: '', // Message d'erreur
    };
  },
  methods: {
    // Validation des champs
    validateFields() {
      if (!this.anneeAcademicName || !this.startYear || !this.endYear) {
        this.errorMessage = 'Tous les champs (Nom, Année de début et Année de fin) doivent être remplis.';
        return false;
      }
      this.errorMessage = '';
      return true;
    },

    // Ajouter une nouvelle année académique
    async addAnneeAcademic() {
      if (!this.validateFields()) return;

      const anneeData = {
        nom: this.anneeAcademicName,
        debut: this.startYear,
        fin: this.endYear,
      };

      try {
        const response = await fetch('http://localhost:8090/annees-academiques', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(anneeData),
        });

        if (response.ok) {
          alert('Année académique ajoutée avec succès');
          this.anneeAcademicName = '';
          this.startYear = '';
          this.endYear = '';
        } else {
          throw new Error('Erreur lors de l\'ajout de l\'année académique');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout de l\'année académique');
      }
    },

    // Charger la liste des années académiques
    async fetchAnneeAcademiques() {
      try {
        const response = await fetch('http://localhost:8090/annees-academiques');

        if (response.ok) {
          const data = await response.json();
          console.log(data);    
          this.anneesAcademiques = data;
        } else {
          throw new Error('Erreur lors du chargement des années académiques');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des années académiques');
      }
    },

    // Sélectionner une année académique pour la mise à jour
    selectAnneeAcademic(id) {
      this.selectedAnneeId = id;
    },

    // Mettre à jour une année académique
    async updateAnneeAcademic() {
      if (!this.selectedAnneeId || !this.updateAnneeAcademicName || !this.updateStartYear || !this.updateEndYear) {
        alert('Veuillez remplir tous les champs avant de mettre à jour.');
        return;
      }

      const updatedData = {
        nom: this.updateAnneeAcademicName,
        debut: this.updateStartYear,
        fin: this.updateEndYear,
      };

      try {
        const response = await fetch(`http://localhost:8090/annees-academiques/${this.selectedAnneeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          alert('Année académique mise à jour');
          this.selectedAnneeId = null;
          this.updateAnneeAcademicName = '';
          this.updateStartYear = '';
          this.updateEndYear = '';
          this.fetchAnneeAcademiques(); // Rafraîchir la liste
        } else {
          throw new Error('Erreur lors de la mise à jour de l\'année académique');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la mise à jour de l\'année académique');
      }
    },

    // Supprimer une année académique
    async deleteAnneeAcademic(id) {
      try {
        const response = await fetch(`http://localhost:8090/annees-academiques/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Année académique supprimée');
          this.fetchAnneeAcademiques(); // Rafraîchir la liste
        } else {
          throw new Error('Erreur lors de la suppression de l\'année académique');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'année académique');
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 14px;
}
</style>
