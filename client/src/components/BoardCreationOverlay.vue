<template>
  <div>
    <v-btn @click.stop="dialog = true" text>
      <div v-if="mobile">
        <span class="pr-2">Nuevo tablero</span>
        <v-icon> mdi-plus-box</v-icon>
      </div>

      <v-icon v-else large> mdi-plus-box</v-icon>
    </v-btn>

    <v-dialog width="500" v-model="dialog">
      <v-card class="rounded-lg">
        <v-card-title class="indigo darken-2 white--text rounded-t">
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
          <v-card-actions class="justify-end">
            <v-btn
              @click="validate"
              class="ma-2 white--text"
              color="indigo accent-4"
              :disabled="!valid"
            >
              Crear tablero
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { postBoard } from '@/api/api';
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
  watch: {
    dialog() {
      if (this.dialog === false) this.$refs.form.reset();
    },
  },
  methods: {
    // TODO Mostrar mensaje de error al utilizar un nombre de tablero ya en uso
    validate() {
      const isBoardNameUsed = this.$store.getters.getBoardByName(
        this.boardName
      );
      if (this.$refs.form.validate() && !isBoardNameUsed) {
        this.createNewBoard();
      }
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
            this.$refs.form.reset();
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
