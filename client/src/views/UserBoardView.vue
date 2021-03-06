<template>
  <div id="user-board-view">
    <!-- Barra de ajustes de la vista -->
    <v-toolbar class="board-toolbar" elevation="0" dense>
      <v-row class="edit-board-name-composer mt-2 flex-nowrap" align="center">
        <v-btn
          v-if="!editBoardNameComposer"
          @click="editBoardNameComposer = true"
          class="ml-6"
          text
          outlined
        >
          {{ name }}
        </v-btn>
        <v-text-field
          v-model="boardName"
          v-if="editBoardNameComposer"
          @blur="editBoardName"
          @keydown.enter.exact="editBoardName"
          class="edit-board-name-textfield ml-7 mt-6"
          autofocus
          solo
          dense
          placeholder="Nuevo nombre del tablero..."
        ></v-text-field>
        <v-btn
          @click="toggleFavorite"
          icon
          color="black"
          class="toggle-favorite-btn"
        >
          <v-icon>{{ isFavorite ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
        </v-btn>

        <v-menu offset-y class="d-flex ml-auto">
          <template v-slot:activator="{ on, attrs }">
            <v-app-bar-nav-icon
              class="toolbar-hamburguer-icon"
              v-bind="attrs"
              v-on="on"
            />
          </template>

          <v-list>
            <!-- <v-list-item>
              <v-list-item-title>Cambiar fondo</v-list-item-title>
            </v-list-item> -->
            <v-list-item @click="deleteBoard">
              <v-list-item-title>Borrar tablero</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-toolbar>

    <div class="board-container" @dragover.prevent @dragenter.prevent>
      <todo-list
        v-for="list in getListById"
        :todos="list.todos"
        :name="list.name"
        :id="list.id"
        :index="list.index"
        :key="list.id"
      >
        <todo-item
          v-for="item in list.todos"
          :todo="item"
          :id="item.id"
          :title="item.title"
          :index="item.index"
          :description="item.description"
          :key="item.id"
        >
          {{ item.title }}
        </todo-item>
      </todo-list>

      <v-form
        v-if="showTodoListComposer"
        ref="addNewListForm"
        v-model="valid"
        class="add-todo-list-controls"
        @submit.prevent="addTodoList(newListTitle)"
      >
        <v-text-field
          v-model="newListTitle"
          :dark="this.$store.state.darkTheme"
          :rules="titleRules"
          :counter="30"
          autofocus
          outlined
          label="Título de la lista"
        ></v-text-field>

        <div>
          <v-btn
            type="submit"
            class="text-capitalize add-list-btn"
            color="#1976D2"
            >Añadir lista</v-btn
          >
          <v-icon class="close-btn" @click="showTodoListComposer = false"
            >mdi-close</v-icon
          >
        </div>
      </v-form>

      <div v-if="!showTodoListComposer" class="add-todo-list">
        <v-btn @click="showTodoListComposer = true"
          >+ Añadir {{ !getListById.length ? 'nueva' : 'otra' }} lista</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import TodoList from '@/components/TodoList.vue';
import TodoItem from '@/components/TodoListItem.vue';
import { patchBoard, deleteBoard, postTodoList } from '@/api/api';

export default {
  name: 'UserBoardView',
  components: {
    TodoList,
    TodoItem,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      todoLists: [],
      newListTitle: '',
      showTodoListComposer: false,
      editBoardNameComposer: false,
      boardName: this.name,
      valid: true,
      titleRules: [v => !!v, v => v.length <= 30],
    };
  },
  watch: {
    boardName() {
      this.hasBoardNameChanged = true;
    },
  },
  computed: {
    getListById() {
      let board = this.$store.state.user.boards.find(
        board => board.name === this.name
      );
      // Devolvemos el tablero ordenado por índice
      return board ? board.todo_lists.sort((a, b) => a.index - b.index) : [];
    },
    boardID() {
      return this.$store.getters.getBoardByName(this.name)._id;
    },
    isFavorite() {
      return this.$store.getters.getBoardByName(this.name)?.favorite;
    },
  },
  methods: {
    addTodoList(title) {
      if (!this.$refs.addNewListForm.validate()) return;

      this.showTodoListComposer = false;
      postTodoList(
        this.boardID,
        this.autoIncrementID(),
        title,
        this.autoIncrementIndex()
      ).then(response => {
        if (response.status === 201) {
          this.$store.dispatch('fetchBoards');
          this.newListTitle = '';
        }
        if (response.status === 500) {
          return console.table(response.data);
        }
      });
    },
    async editBoardName() {
      this.editBoardNameComposer = false;
      if (this.boardName && this.hasBoardNameChanged) {
        this.hasBoardNameChanged = false;

        await patchBoard(this.boardID, { name: this.boardName })
          .then(async response => {
            if (response.status === 200) {
              await this.$store.dispatch('fetchBoards');
              this.$router.push(
                `/todomachine/${this.$store.state.user.username}/${this.boardName}`
              );
            }
          })
          .catch(error => console.error(error));
      }
    },
    deleteBoard() {
      deleteBoard(this.boardID)
        .then(async response => {
          if (response.status === 200) {
            await this.$store.dispatch('fetchBoards');
            this.$router.push(
              `/todomachine/${this.$store.state.user.username}`
            );
          }
        })
        .catch(error => console.error(error));
    },
    toggleFavorite() {
      patchBoard(this.boardID, { favorite: !this.isFavorite })
        .then(async response => {
          if (response.status === 200) {
            await this.$store.dispatch('fetchBoards');
          }
        })
        .catch(error => console.error(error));
    },
    autoIncrementID() {
      const maxID =
        this.getListById.length === 0
          ? 0
          : this.getListById.reduce((prev, curr) =>
              prev.id > curr.id ? prev : curr
            ).id + 1;

      return maxID;
    },
    autoIncrementIndex() {
      const maxIndex =
        this.getListById.length === 0
          ? 0
          : this.getListById[this.getListById.length - 1].index + 1;

      return maxIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
#user-board-view {
  //Contenedor principal del tablero
  .board-container {
    display: flex;
    align-items: flex-start;

    height: 90vh;
    // width: auto;
    background: var(--surface1);
    overflow-x: scroll;

    padding: 2rem;

    .v-form {
      min-width: 250px;

      .v-input {
        height: 70px;
      }

      .add-list-btn {
        color: var(--text1-dark);
      }
    }

    .add-todo-list .v-btn {
      background: var(--surface2);
      color: var(--text1);
    }

    .close-btn {
      font-size: 28px;
      color: var(--text1);

      cursor: pointer;
      margin-left: 6px;

      &:hover {
        color: var(--text2);
      }
    }
  }

  .board-toolbar {
    background-color: var(--surface1) !important;
    transition: none !important;

    .edit-board-name-composer {
      margin-left: 0.8rem;

      & > * {
        color: var(--text1) !important;
        border-color: var(--text1) !important;
        margin-left: 1rem;
      }
    }

    .edit-board-name-textfield {
      max-width: 200px;
    }
    .toolbar-hamburguer-icon {
      color: var(--text1) !important;

      margin-right: 1.2rem;
    }
  }
}
</style>
