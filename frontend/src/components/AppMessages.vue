<template>
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
  </template>
  
  <script>
  export default {
    data() {
      return {
        messageContent: '',
        studentId: '',
        messages: [],
        selectedMessageId: '',
        messageUpdateContent: ''
      };
    },
    methods: {
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
            this.messageContent = '';
          } else {
            throw new Error('Erreur lors de l\'envoi du message');
          }
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur lors de l\'envoi du message');
        }
      },
  
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
  
      async updateMessageStatus(messageId) {
        try {
          const response = await fetch(`http://localhost:8081/api/messages/${messageId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content: 'Contenu mis à jour'
            })
          });
  
          if (response.ok) {
            alert('Message mis à jour');
            this.fetchMessages();
          } else {
            throw new Error('Erreur lors de la mise à jour du message');
          }
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur lors de la mise à jour du message');
        }
      },
  
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
            this.messageUpdateContent = '';
            this.fetchMessages();
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
  /* Add your CSS here */
  </style>
  