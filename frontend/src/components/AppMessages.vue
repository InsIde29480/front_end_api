<template>
  <div>
    <!-- Section Gestion des Messages -->
    <h2>Envoyer un message</h2>
    <input v-model="studentId" placeholder="Numéro étudiant à envoyer">
    <input v-model="subject" placeholder="Sujet du message">
    <input v-model="messageContent" placeholder="Contenu du message">
    <button @click="sendMessage">Envoyer</button>

    <h2>Messages d'un étudiant</h2>
    <input v-model="studentId2" placeholder="ID de l'étudiant">
    <button @click="fetchMessages">Récupérer les messages</button>

    <!-- Affichage des messages reçus -->
    <div v-if="messages.length">
      <ul>
        <li v-for="message in messages" :key="message.id">
          <p><strong>ID :</strong> {{ message.id }}</p>
          <p><strong>Sujet :</strong> {{ message.sujet || "Aucun sujet" }}</p>
          <p><strong>Texte :</strong> {{ message.texte }}</p>
          <p><strong>Lu :</strong> {{ message.lu ? "Oui" : "Non" }}</p>
          <button @click="updateMessageStatus(message.id)">Mettre à jour</button>
        </li>
      </ul>
    </div>

    <!-- Mettre à jour un message -->
    <h2>Mettre à jour un message</h2>
    <input v-model="messageUpdateContent" placeholder="Nouveau contenu">
    <button @click="updateMessage">Mettre à jour</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageContent: '',
      studentId: '',
      subject: '',
      messages: [], // Liste des messages
      selectedMessageId: '',
      messageUpdateContent: '',
      errorMessage: ''
    };
  },
  methods: {
    validateFields() {
      if (!this.studentId || !this.subject || !this.messageContent) {
        this.errorMessage = 'Tous les champs (ID étudiant, sujet, et contenu du message) doivent être remplis.';
        return false;
      }
      this.errorMessage = '';
      return true;
    },

    async sendMessage() {
      if (!this.validateFields()) return;

      const messageData = {
        texte: this.messageContent,
        sujet: this.subject,
        etudiantId: this.studentId
      };

      try {
        const response = await fetch('http://localhost:8085/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData)
        });

        if (response.ok) {
          alert('Message envoyé avec succès');
          this.messageContent = '';
          this.subject = ''; 
          this.studentId = ''; 
        } else {
          throw new Error('Erreur lors de l\'envoi du message');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'envoi du message');
      }
    },

    async fetchMessages() {
      if (!this.studentId2) {
        alert('Veuillez entrer un ID d\'étudiant');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8085/api/messages/etudiants/${this.studentId2}`);

        if (response.ok) {
          const data = await response.json();
          console.log("Données reçues :", data); // Debug

          this.messages = data; // On attribue directement les messages
        } else {
          throw new Error('Erreur lors de la récupération des messages');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la récupération des messages');
      }
    },

    updateMessageStatus(messageId) {
      this.selectedMessageId = messageId;
    },

    async updateMessage() {
      if (!this.selectedMessageId || !this.messageUpdateContent) {
        alert('Veuillez sélectionner un message et entrer un nouveau contenu');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8085/api/messages/${this.selectedMessageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texte: this.messageUpdateContent }) // Correction : "texte"
        });

        if (response.ok) {
          alert('Message mis à jour');
          this.messageUpdateContent = '';
          this.fetchMessages(); // Rafraîchir les messages
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
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 14px;
}
</style>
