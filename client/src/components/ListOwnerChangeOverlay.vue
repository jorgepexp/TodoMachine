<template>
  <div class="text-center">
    <v-list-item @click.stop="dialog = true">
      <v-list-item-title>Cambiar propietario</v-list-item-title>
    </v-list-item>

    <v-dialog width="500" v-model="dialog">
      <v-card class="rounded-lg">
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
            label="Buscar por nombre de usuario"
            required
            autofocus
          >
          </v-text-field>
          <div class="d-flex justify-end">
            <v-btn
              class="mb-2"
              color="primary"
              text
              @click="findUserBoards"
              :disabled="!valid"
              :loading="loading"
            >
              Buscar
            </v-btn>
          </div>
          <!-- Comportamiento extraño al no incluirlo entre paréntesis -->
          <v-banner single-line v-if="!(typeof foundUserBoards === 'object')">
            <v-icon slot="icon" color="warning" size="32">
              mdi-account-question
            </v-icon>
            Usuario no encontrado
          </v-banner>
        </v-form>

        <v-select
          v-if="foundUserBoards"
          v-model="selectedBoard"
          :items="foundUserBoards"
          item-text="name"
          return-object
          label="Selecciona un tablero"
          dense
          solo
          class="mx-8"
        ></v-select>

        <div class="d-flex justify-end">
          <v-btn
            v-if="foundUserBoards"
            :disabled="!selectedBoard"
            @click="changeListOwner"
            class="mb-4"
            color="primary"
            text
          >
            Cambiar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  getUserByUsername,
  getBoardsById,
  postTodoList,
  deleteList,
} from '@/api/api.js';
export default {
  name: 'ListOwnerChangeOverlay',
  props: {
    listId: {
      type: Number,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    todos: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      username: '',
      boardNameRules: [v => !!v || 'Título requerido'],
      dialog: false,
      valid: true,
      isUserFound: false,
      foundUserBoards: null,
      selectedBoard: '',
      loading: false,
    };
  },
  watch: {
    dialog(newValue) {
      if (newValue === false) this.reset();
    },
  },
  methods: {
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
        getBoardsById(ownerID)
          .then(response => (this.foundUserBoards = response.data.boards))
          .catch(error => {
            console.error(error);
          });

        this.isUserFound = true;
        this.loading = false;
      });
    },
    async changeListOwner() {
      await postTodoList(
        this.selectedBoard._id,
        this.getNewId(),
        this.name,
        this.getNewIndex(),
        this.todos
      ).catch(error => console.error(error));

      await deleteList(this.boardId, this.listId).catch(error =>
        console.error(error)
      );

      this.$store.dispatch('fetchBoards');
    },
    getNewId() {
      const targetBoardTodos = this.selectedBoard.todo_lists;
      const newId =
        targetBoardTodos.length === 0
          ? 0
          : targetBoardTodos.reduce((prev, curr) =>
              prev.id > curr.id ? prev : curr
            ).id + 1;
      return newId;
    },
    getNewIndex() {
      const targetBoardTodos = this.selectedBoard.todo_lists;
      const newIndex =
        targetBoardTodos.length === 0
          ? 0
          : targetBoardTodos[targetBoardTodos.length - 1].index + 1;
      return newIndex;
    },
    reset() {
      // Al no destruirse por completo, el componente mantiene su data() anterior si no se resetea
      this.$refs.form.reset();
      this.isUserFound = false;
      this.foundUserBoards = null;
      this.selectedBoard = '';
    },
  },
};
</script>

<style lang="scss"></style>
