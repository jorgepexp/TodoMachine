<template>
  <div class="text-center">
    <v-list-item @click.stop="dialog = true">
      <v-list-item-title>Cambiar propietario</v-list-item-title>
    </v-list-item>

    <v-dialog width="500" v-model="dialog">
      <v-card class="rounded-lg" @focusout="reset">
        <v-card-title class="text-h6 blue rounded-t">
          Cambiar propietario de lista
        </v-card-title>

        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          class="px-3 mt-2"
          @submit.prevent="findUserBoards"
        >
          <v-text-field
            v-model="username"
            :rules="boardNameRules"
            label="Nombre del usuario a buscar"
            required
            autofocus
          >
          </v-text-field>
          <v-banner single-line v-if="typeof foundUserBoards !== 'object'">
            <v-icon slot="icon" color="warning" size="32">
              mdi-account-question
            </v-icon>
            Usuario no encontrado
          </v-banner>

          <v-card-actions class="justify-end">
            <v-btn
              color="primary"
              text
              @click="findUserBoards"
              :disabled="!valid"
              :loading="loading"
            >
              Buscar
            </v-btn>
          </v-card-actions>
        </v-form>

        <v-list v-if="isUserFound">
          <v-list-item v-for="board in foundUserBoards" :key="board.name">
            <v-list-item-title>{{ board.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getUserByUsername, getBoardsById } from '../api.js';
export default {
  name: 'ListOwnerChangeOverlay',
  data() {
    return {
      username: '',
      boardNameRules: [v => !!v || 'Título requerido'],
      dialog: false,
      valid: true,
      isUserFound: false,
      foundUserBoards: null,
      loading: false,
    };
  },

  methods: {
    prueba() {
      // Reiniciamos el mensaje de alerta al cerrar el diálogo

      this.$refs.form.reset();
      this.isUserFound = false;
      this.foundUserBoards = null;
    },
    findUserBoards() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loading = true;
      getUserByUsername(this.username).then(response => {
        if (!response.data.users.length) {
          this.foundUserBoards = false;
          this.loading = false;
          return;
        }
        const ownerID = response.data.users[0]._id;
        const userBoards = getBoardsById(ownerID).then(response => {
          console.log(response);
          return response.data.boards;
        });
        this.userBoardsFound = true;
        this.isUserFound = true;
        this.loading = false;
        this.foundUserBoards = userBoards;
      });
    },
    // findBoardByName() {
    //   this.foundUserBoards.find()
    //   return board;
    // },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style lang="scss"></style>
