const Parser_etudiant = {
  data() {
    return {
      file: null,
      response: null
    };
  },
  template: `
    <div>
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
      annees: [], // Liste des années académiques
      nouvelleAnnee: '', // Nouvelle année académique à ajouter
      groupes: [], // Liste des groupes
      nouveauGroupe: { nom: '', type: '', anneeId: null }, // Nouveau groupe
      unites: [], // Liste des unités d'enseignement
      nouvelleUnite: { nom: '', anneeId: null }, // Nouvelle unité d'enseignement
      message: '' // Message d'erreur ou de succès
    };
  },
  mounted() {
    this.getAnneesAcademiques(); // Charger les années académiques
    this.getGroupes(); // Charger les groupes
    this.getUnites(); // Charger les unités d'enseignement
  },
  template: `
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
  `,
  methods: {
    // Gestion des années académiques
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
    },

    // Gestion des groupes
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
          this.getGroupes(); // Rafraîchir la liste
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

    // Gestion des unités d'enseignement
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
          this.getUnites(); // Rafraîchir la liste
        } else {
          this.message = "Erreur lors de l'ajout de l'unité.";
        }
      } catch (error) {
        console.error('Erreur:', error);
        this.message = "Erreur de connexion avec l'API.";
      }
    },

    // Gestion des étudiants
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

const AppMessages = {
  data() {
    return {
      messageContent: '', // Pour la création de message
      studentId: '', // ID de l'étudiant pour récupérer ses messages
      messages: [], // Liste des messages
      selectedMessageId: '', // ID du message sélectionné pour la mise à jour
      messageUpdateContent: '' // Contenu mis à jour du message
    };
  },
  template: `
    <div>
      <!-- Section Gestion des Messages -->
      <h2>Envoyer un message</h2>
      <input v-model="messageContent" placeholder="Contenu du message">
      <button @click="sendMessage">Envoyer</button>

      <h2>Messages d'un étudiant</h2>
      <input v-model="studentId" placeholder="ID de l'étudiant">
      <button @click="fetchMessages">Récupérer les messages</button>

      <ul v-if="messages.length">
        <li v-for="message in messages" :key="message.id">
          <p>{{ message.content }}</p>
          <button @click="updateMessageStatus(message.id)">Mettre à jour</button>
        </li>
      </ul>

      <h2>Mettre à jour un message</h2>
      <input v-model="messageUpdateContent" placeholder="Nouveau contenu">
      <button @click="updateMessage">Mettre à jour</button>
    </div>
  `,
  methods: {
    // Envoi d'un message
    async sendMessage() {
      if (!this.messageContent) {
        alert('Veuillez entrer un contenu pour le message');
        return;
      }

      const messageData = {
        content: this.messageContent
      };

      try {
        const response = await fetch('http://localhost:8081/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        });

        if (response.ok) {
          alert('Message envoyé avec succès');
          this.messageContent = ''; // Réinitialiser le champ du message
        } else {
          throw new Error('Erreur lors de l\'envoi du message');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'envoi du message');
      }
    },

    // Récupération des messages d'un étudiant
    async fetchMessages() {
      if (!this.studentId) {
        alert('Veuillez entrer un ID d\'étudiant');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/api/messages/etudiants/${this.studentId}`);
        
        if (response.ok) {
          this.messages = await response.json();
        } else {
          throw new Error('Erreur lors de la récupération des messages');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la récupération des messages');
      }
    },

    // Mise à jour du statut d'un message
    async updateMessageStatus(messageId) {
      try {
        const response = await fetch(`http://localhost:8081/api/messages/${messageId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: 'Contenu mis à jour' // Exemple de mise à jour
          })
        });

        if (response.ok) {
          alert('Message mis à jour');
          this.fetchMessages(); // Rafraîchir les messages
        } else {
          throw new Error('Erreur lors de la mise à jour du message');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la mise à jour du message');
      }
    },

    // Mise à jour d'un message spécifique
    async updateMessage() {
      if (!this.selectedMessageId || !this.messageUpdateContent) {
        alert('Veuillez sélectionner un message et entrer un nouveau contenu');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/api/messages/${this.selectedMessageId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: this.messageUpdateContent })
        });

        if (response.ok) {
          alert('Message mis à jour');
          this.messageUpdateContent = ''; // Réinitialiser le champ
          this.fetchMessages(); // Rafraîchir la liste des messages
        } else {
          throw new Error('Erreur lors de la mise à jour du message');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la mise à jour du message');
      }
    }
  }
};

// Création et montage de l'application Vue
Vue.createApp(Parser_etudiant).mount('#Parser_etudiant');
Vue.createApp(Annee_academique).mount('#Annee_academique');
Vue.createApp(AppMessages).mount('#AppMessages');
