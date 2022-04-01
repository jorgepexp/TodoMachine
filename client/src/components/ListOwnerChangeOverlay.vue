<template>
  <div>
    <v-list-item @click.stop="dialog = true">
      <v-list-item-title>Cambiar de propietario</v-list-item-title>
    </v-list-item>

    <v-dialog
      width="60%"
      v-model="dialog"
      :dark="this.$store.state.darkTheme"
      content-class="list-owner-change-overlay"
    >
      <v-card class="card-container">
        <v-row class="flex-nowrap align-center">
          <v-card-title class="card-title">
            Cambiar propietario de lista
          </v-card-title>
          <v-btn @click.stop="dialog = !dialog" class="ml-auto mr-2" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>
        <v-divider />

        <v-card-subtitle class="body-1 mt-2">Busca el usuario</v-card-subtitle>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          class="px-3"
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
          <v-btn
            class="mb-2 d-flex ml-auto"
            color="primary"
            text
            @click="findUserBoards"
            :disabled="!valid"
            :loading="loading"
          >
            Buscar
          </v-btn>
        </v-form>
        <!-- Comportamiento extraño al no incluirlo entre paréntesis -->
        <v-banner single-line v-if="!(typeof foundUserBoards === 'object')">
          <v-icon slot="icon" color="warning" size="32">
            mdi-account-question
          </v-icon>
          Usuario no encontrado
        </v-banner>

        <v-container fluid>
          <v-select
            v-if="foundUserBoards"
            v-model="selectedBoard"
            :items="foundUserBoards"
            item-text="name"
            return-object
            label="Selecciona un tablero"
            dense
            solo
            class="change-board-select"
          ></v-select>
        </v-container>

        <v-btn
          v-if="foundUserBoards"
          :disabled="!selectedBoard"
          @click="changeListOwner"
          class="mb-4 d-flex ml-auto"
          color="success"
          text
        >
          Cambiar
        </v-btn>
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
      if (!this.$refs.form.validate()) return;
      this.loading = true;

      try {
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
      } catch (error) {
        console.error(error.message);
        this.loading = false;
      }
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

<style lang="scss">
.list-owner-change-overlay {
  .card-container {
    overflow: hidden;
    padding-inline: 1rem;
    padding-block: 0.7rem 1rem;
  }

  .card-title {
    word-break: break-word;
  }

  .change-board-select {
    width: 80%;
  }
}
</style>
