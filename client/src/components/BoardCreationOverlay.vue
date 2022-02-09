<template>
  <div class="text-center">
    <v-btn @click.stop="dialog = true" text>
      <div v-if="mobile">
        <span class="pr-2">Nuevo tablero</span>
        <v-icon> mdi-plus-box</v-icon>
      </div>

      <v-icon v-else large> mdi-plus-box</v-icon>
    </v-btn>

    <v-dialog width="500" v-model="dialog">
      <v-card class="rounded-lg" @focusout="$refs.form.reset()">
        <v-card-title class="text-h6 blue white--text rounded-t">
          Crear nuevo tablero
        </v-card-title>

        <v-form ref="form" v-model="valid" @submit.prevent class="px-3 mt-2">
          <v-text-field
            v-model="boardName"
            @keydown.enter="validate"
            :rules="boardNameRules"
            :counter="boardNameMaxLength"
            label="Título"
            required
            autofocus
          >
          </v-text-field>
        </v-form>

        <v-card-actions class="justify-end">
          <v-btn color="primary" text @click="validate" :disabled="!valid">
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
  props: {
    mobile: {
      type: Boolean,
      required: false,
    },
  },
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
    validate() {
      if (this.$refs.form.validate()) this.createNewBoard();
    },
    async createNewBoard() {
      await postBoard(this.$store.state.user.id, this.boardName).then(
        async response => {
          if (response.status === 201) {
            await this.$store.dispatch('fetchBoards');
            this.dialog = false;

            this.$router.push({
              name: 'board',
              params: {
                username: this.$store.state.user.username,
                name: this.boardName,
              },
            });
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

<style lang="scss" scoped></style>
