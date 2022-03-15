<template>
  <div id="list-board-change-overlay">
    <v-list-item @click.stop="dialog = true">
      <v-list-item-title>Cambiar de tablero</v-list-item-title>
    </v-list-item>

    <v-dialog v-model="dialog" width="60%">
      <v-card class="card-container">
        <v-row class="align-center">
          <v-card-title>Trasladar lista a otro tablero</v-card-title>
          <v-btn @click="dialog = !dialog" class="ml-auto mr-6" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <v-divider />
        <v-spacer />
        <v-card-subtitle class="body-1 mt-2"
          >Selecciona el tablero destino</v-card-subtitle
        >

        <v-container fluid>
          <v-row dense justify="space-around">
            <!-- <v-col> -->
            <div
              @click="changeListLocation(board._id, board.name)"
              v-for="board in boards"
              :key="board._id"
              class="card-item blue accent-3 white--text"
            >
              {{ board.name }}
            </div>
            <!-- </v-col> -->
          </v-row>
        </v-container>
        <v-spacer />
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
      targetBoardId: '',
    };
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
    async changeListLocation(selectedBoardId, selectedBoardName) {
      await postTodoList(
        selectedBoardId,
        this.getNewListId(selectedBoardName),
        this.listName.trim(),
        this.getNewListIndex(selectedBoardName),
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
  },
};
</script>

<style lang="scss">
.card-container {
  overflow: hidden;
  padding-inline: 1rem;
  padding-block: 0.7rem 1rem;
  color: var(--text1);
  background: var(--surface1);
}
.card-item {
  height: 85px;
  width: 130px;
  overflow-wrap: break-word;

  background: lightskyblue;
  color: black;
  border-radius: 5px;
  border: 1px solid darkslateblue;
  cursor: pointer;

  padding: 0.6rem;
  // margin-left: 1.2rem;

  &:hover {
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.25);
    border-color: #3178c6;
  }
}
</style>
