<template>
  <div class="text-center">
    <v-dialog width="500" v-model="dialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on" ref="btn" class="addBoardBtn">
          <v-icon large @focusout="prueba">mdi-plus-box</v-icon>
        </v-btn>
      </template>

      <v-card class="rounded-lg" @focusout="reset">
        <v-card-title class="text-h6 blue rounded-t">
          Crear nuevo tablero
        </v-card-title>

        <v-form
          ref="form"
          v-model="valid"
          class="px-3 mt-2"
          lady-validation
          @submit.prevent="createNewBoard"
        >
          <v-text-field
            v-model="boardName"
            :rules="boardNameRules"
            label="Título"
            required
            autofocus
          >
          </v-text-field>
        </v-form>

        <v-card-actions class="justify-end">
          <v-btn
            color="primary"
            text
            @click="createNewBoard"
            :disabled="!valid"
          >
            Crear tablero
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { postBoard } from '../api.js';
export default {
  name: 'BoardCreationOverlay',
  data() {
    return {
      boardName: '',
      boardNameRules: [v => !!v || 'Título requerido'],
      dialog: false,
      valid: true,
    };
  },
  methods: {
    async createNewBoard() {
      if (!this.$refs.form.validate()) {
        return;
      }

      await postBoard(this.$store.state.user.id, this.boardName).then(
        response => {
          if (response.status === 201) {
            this.$store.dispatch('fetchBoards');
          }
          if (response.status === 400) {
            console.error(response);
          }
        }
      );

      this.$router.push({
        name: 'board',
        params: {
          username: this.$store.state.user.username,
          id: this.boardName,
        },
      });
      this.dialog = false;
      this.boardName = '';
    },
    reset() {
      this.$refs.form.reset();
    },
    prueba() {
      console.log('Holu');
    },
  },
};
</script>

<style lang="scss"></style>
