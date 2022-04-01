<template>
  <div>
    <v-list-item @click.stop="dialog = true">
      <v-list-item-title>Cambiar de tablero</v-list-item-title>
    </v-list-item>

    <v-dialog
      content-class="list-board-change-overlay"
      v-model="dialog"
      width="60%"
      :dark="this.$store.state.darkTheme"
    >
      <v-card class="card-container">
        <v-row class="flex-nowrap align-center">
          <v-card-title class="card-title"
            >Cambiar lista de tablero</v-card-title
          >
          <v-btn @click="dialog = !dialog" class="ml-auto mr-2" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <v-divider />
        <v-spacer />
        <v-card-subtitle class="body-1 mt-2"
          >Selecciona el tablero destino</v-card-subtitle
        >

        <v-container fluid>
          <p v-if="!boards.length" class="red--text">
            Ningún otro tablero disponible
          </p>
          <v-select
            v-else
            v-model="selectedBoard"
            :items="boards"
            item-text="name"
            return-object
            label="Selecciona un tablero"
            dense
            solo
          ></v-select>
        </v-container>
        <v-spacer />
        <v-btn
          @click="changeListLocation"
          :disabled="!selectedBoard"
          color="success"
          class="d-flex ml-auto"
          text
          >Confirmar</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { deleteList, postTodoList } from '@/api/api';

export default {
  props: {
    listId: {
      type: Number,
      required: true,
    },
    listName: {
      type: String,
      required: true,
    },
    todos: {
      type: Array,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      selectedBoard: '',
    };
  },
  watch: {
    dialog(newValue) {
      if (newValue === false) this.reset();
    },
  },
  computed: {
    boards() {
      //* Retiramos el tablero actual de la lista de posibilidades
      const filteredBoard = this.$store.state.user.boards.filter(
        board => board._id !== this.boardId
      );

      return filteredBoard;
    },
  },
  methods: {
    async changeListLocation() {
      await postTodoList(
        this.selectedBoard._id,
        this.getNewListId(this.selectedBoard.name),
        this.listName.trim(),
        this.getNewListIndex(this.selectedBoard.name),
        this.todos
      )
        .then(response => {
          if (response.status === 201) {
            deleteList(this.boardId, this.listId)
              .then(async response => {
                if (response.status === 200) {
                  await this.$store.dispatch('fetchBoards');
                }
                this.dialog = false;
              })
              .catch(error => console.log(error));
          }
        })
        .catch(error => console.log(error));
    },
    // Estos métodos se podrían unificar
    getNewListId(selectedBoardName) {
      const selectedBoard = this.$store.getters.getBoardByName(
        selectedBoardName
      );
      const targetBoardTodos = selectedBoard.todo_lists;
      const newListId =
        targetBoardTodos.length === 0
          ? 0
          : targetBoardTodos.reduce((prev, curr) =>
              prev.id > curr.id ? prev : curr
            ).id + 1;
      return newListId;
    },
    getNewListIndex(selectedBoardName) {
      const selectedBoard = this.$store.getters.getBoardByName(
        selectedBoardName
      );
      const targetBoardTodos = selectedBoard.todo_lists;
      const newListIndex =
        targetBoardTodos.length === 0
          ? 0
          : targetBoardTodos.reduce((prev, curr) =>
              prev.index > curr.index ? prev : curr
            ).index + 1;
      return newListIndex;
    },
    reset() {
      // Al no destruirse por completo, el componente mantiene su data() anterior si no se resetea
      this.selectedBoard = '';
    },
  },
};
</script>

<style lang="scss">
.list-board-change-overlay {
  .card-container {
    overflow: hidden;
    padding-inline: 1rem;
    padding-block: 0.7rem 1rem;
    color: var(--text1);
  }

  .card-title {
    word-break: break-word;
  }

  .card-item {
    height: 85px;
    width: 130px;
    // overflow-wrap: break-word;

    background: lightskyblue;
    color: black;
    border-radius: 5px;
    cursor: pointer;

    padding: 0.6rem;

    &:hover {
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.25);
      transform: scale(1.05);
      border-color: #3178c6;
    }
  }

  @media (min-width: 600px) {
    .edit-item-overlay {
      width: 500px;
    }

    // .card-container
  }
}
</style>
