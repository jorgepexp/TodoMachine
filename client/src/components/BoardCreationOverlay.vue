<template>
  <div class="text-center">
    <v-btn @click.stop="dialog = true" text class="addBoardBtn">
      <v-icon large>mdi-plus-box</v-icon>
    </v-btn>

    <v-dialog width="500" v-model="dialog">
      <v-card class="rounded-lg" @focusout="$refs.form.reset()">
        <v-card-title class="text-h6 blue white--text rounded-t">
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
            :counter="boardNameMaxLength"
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
      boardNameRules: [
        v => !!v || 'Título requerido',
        v => v?.length <= this.boardNameMaxLength || 'Máximo 30 caracteres',
      ],
      boardNameMaxLength: 30,
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
        async response => {
          if (response.status === 201) {
            await this.$store.dispatch('fetchBoards');
            this.$router.push({
              name: 'board',
              params: {
                username: this.$store.state.user.username,
                name: this.boardName,
              },
            });
            this.dialog = false;
            this.boardName = '';
          }
          if (response.status === 400) {
            console.error(response);
          }
        }
      );
    },
  },
};
</script>

<style lang="scss"></style>
