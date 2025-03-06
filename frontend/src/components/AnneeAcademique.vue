<template>
    <div>
      <!-- Section Années Académiques -->
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
  
      <!-- Section Groupes -->
      <h2>Ajouter un groupe</h2>
      <input v-model="nouveauGroupe.nom" placeholder="Nom du groupe">
      <input v-model="nouveauGroupe.type" placeholder="Type (TP, TD, etc.)">
      <select v-model="nouveauGroupe.anneeId">
        <option v-for="annee in annees" :key="annee.id" :value="annee.id">
          {{ annee.code }}
        </option>
      </select>
      <button @click="addGroupe">Ajouter</button>
  
      <h2>Liste des groupes</h2>
      <ul>
        <li v-for="groupe in groupes" :key="groupe.id">
          {{ groupe.nom }} ({{ groupe.type }})
          <button @click="deleteGroupe(groupe.id)">Supprimer</button>
        </li>
      </ul>
  
      <!-- Section Unités d'Enseignement -->
      <h2>Ajouter une unité d'enseignement</h2>
      <input v-model="nouvelleUnite.nom" placeholder="Nom de l'unité d'enseignement">
      <select v-model="nouvelleUnite.anneeId">
        <option v-for="annee in annees" :key="annee.id" :value="annee.id">
          {{ annee.code }}
        </option>
      </select>
      <button @click="addUnite">Ajouter</button>
  
      <h2>Liste des unités d'enseignement</h2>
      <ul>
        <li v-for="unite in unites" :key="unite.id">
          {{ unite.nom }} ({{ unite.annee.code }})
        </li>
      </ul>
  
      <!-- Section Etudiants -->
      <h2>Ajouter un étudiant à un groupe</h2>
      <select v-model="nouveauGroupe.anneeId">
        <option v-for="annee in annees" :key="annee.id" :value="annee.id">
          {{ annee.code }}
        </option>
      </select>
      <select v-model="nouveauGroupe.idGroupe">
        <option v-for="groupe in groupes" :key="groupe.id" :value="groupe.id">
          {{ groupe.nom }}
        </option>
      </select>
      <input v-model="nouveauGroupe.idEtudiant" placeholder="ID étudiant">
      <button @click="addEtudiantGroupe">Ajouter Etudiant</button>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        annees: [],
        nouvelleAnnee: '',
        groupes: [],
        nouveauGroupe: { nom: '', type: '', anneeId: null },
        unites: [],
        nouvelleUnite: { nom: '', anneeId: null },
        message: ''
      };
    },
    mounted() {
      this.getAnneesAcademiques();
      this.getGroupes();
      this.getUnites();
    },
    methods: {
      // Années Académiques Methods
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
            this.getAnneesAcademiques();
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
      },
  
      // Groupes Methods
      async getGroupes() {
        try {
          const response = await fetch('http://localhost:8080/groupes');
          this.groupes = await response.json();
        } catch (error) {
          console.error('Erreur lors du chargement des groupes:', error);
        }
      },
      async addGroupe() {
        if (!this.nouveauGroupe.nom || !this.nouveauGroupe.type || !this.nouveauGroupe.anneeId) {
          this.message = "Veuillez remplir tous les champs du groupe.";
          return;
        }
        try {
          const response = await fetch(`http://localhost:8080/annees-academiques/${this.nouveauGroupe.anneeId}/groupes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nom: this.nouveauGroupe.nom,
              type: this.nouveauGroupe.type
            })
          });
          if (response.ok) {
            this.message = "Groupe ajouté avec succès!";
            this.nouveauGroupe = { nom: '', type: '', anneeId: null };
            this.getGroupes();
          } else {
            this.message = "Erreur lors de l'ajout du groupe.";
          }
        } catch (error) {
          console.error('Erreur:', error);
          this.message = "Erreur de connexion avec l'API.";
        }
      },
      async deleteGroupe(id) {
        try {
          const response = await fetch(`http://localhost:8080/groupes/${id}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            this.message = "Groupe supprimé avec succès!";
            this.getGroupes();
          } else {
            this.message = "Erreur lors de la suppression.";
          }
        } catch (error) {
          console.error('Erreur:', error);
          this.message = "Erreur de connexion avec l'API.";
        }
      },
  
      // Unités d'Enseignement Methods
      async getUnites() {
        try {
          const response = await fetch('http://localhost:8080/unites-enseignement');
          this.unites = await response.json();
        } catch (error) {
          console.error('Erreur lors du chargement des unités d\'enseignement:', error);
        }
      },
      async addUnite() {
        if (!this.nouvelleUnite.nom || !this.nouvelleUnite.anneeId) {
          this.message = "Veuillez remplir tous les champs de l'unité d'enseignement.";
          return;
        }
        try {
          const response = await fetch(`http://localhost:8080/annees-academiques/${this.nouvelleUnite.anneeId}/unites-enseignement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nom: this.nouvelleUnite.nom
            })
          });
          if (response.ok) {
            this.message = "Unité d'enseignement ajoutée avec succès!";
            this.nouvelleUnite = { nom: '', anneeId: null };
            this.getUnites();
          } else {
            this.message = "Erreur lors de l'ajout de l'unité.";
          }
        } catch (error) {
          console.error('Erreur:', error);
          this.message = "Erreur de connexion avec l'API.";
        }
      },
  
      // Etudiants Methods
      async addEtudiantGroupe() {
        if (!this.nouveauGroupe.idEtudiant || !this.nouveauGroupe.idGroupe) {
          this.message = "Veuillez entrer l'ID étudiant et le groupe.";
          return;
        }
        try {
          const response = await fetch(`http://localhost:8080/groupes/${this.nouveauGroupe.idGroupe}/etudiants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              etudiantId: this.nouveauGroupe.idEtudiant
            })
          });
          if (response.ok) {
            this.message = "Etudiant ajouté au groupe avec succès!";
          } else {
            this.message = "Erreur lors de l'ajout de l'étudiant.";
          }
        } catch (error) {
          console.error('Erreur:', error);
          this.message = "Erreur de connexion avec l'API.";
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your CSS here */
  </style>  